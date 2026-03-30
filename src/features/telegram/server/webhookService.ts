import { confirmTelegramBooking, rejectTelegramBooking } from "@/features/booking/server/bookingService";
import { registerTelegramCustomer } from "@/features/auth/server/authService";
import { buildTelegramAssistantReply } from "@/features/llm/server/assistantService";
import { getEnv } from "@/features/shared/server/env";
import { isPhoneValid, normalizePhone } from "@/features/shared/server/phone";
import { generateOtpCode, hashOtpCode, verifyOtpCode } from "@/features/telegram/server/otp";
import {
  answerTelegramCallback,
  sendTelegramMessage
} from "@/features/telegram/server/telegramApi";
import {
  ensureTelegramProfile,
  resetTelegramProfile,
  updateTelegramProfile
} from "@/features/telegram/server/telegramRepository";
import { sendOtpSms } from "@/features/telegram/server/smsService";

type TelegramUpdate = {
  callback_query?: {
    data?: string;
    id: string;
    message?: {
      chat?: {
        id: number;
      };
    };
  };
  message?: {
    chat: {
      id: number;
    };
    text?: string;
  };
};

export async function handleTelegramWebhook(input: {
  headers: Headers;
  update: TelegramUpdate;
}) {
  validateSecret(input.headers);

  if (input.update.callback_query) {
    await handleCallback(input.update.callback_query);
    return;
  }

  if (input.update.message?.text) {
    await handleTextMessage(
      input.update.message.chat.id,
      input.update.message.text.trim()
    );
  }
}

async function handleTextMessage(chatId: number, text: string) {
  const profile = await ensureTelegramProfile(chatId);

  if (!profile) {
    throw new Error("Telegram profile was not initialized");
  }

  if (text === "/start") {
    await resetTelegramProfile(chatId);
    await sendTelegramMessage({
      chatId,
      text: [
        "Здравствуйте. Я bot Bookit.",
        "Могу помочь с регистрацией, поиском свободных кортов и бронированием.",
        "Для начала напишите ваше имя."
      ].join("\n")
    });
    return;
  }

  if (profile.stage !== "ready" || !profile.userId) {
    await handleRegistrationStep(profile, text);
    return;
  }

  const reply = await buildTelegramAssistantReply({
    chatId,
    message: text,
    previousIntent: profile.pendingIntent,
    userId: profile.userId
  });

  await updateTelegramProfile({
    chatId,
    patch: {
      pendingIntent: reply.nextIntent
    }
  });

  await sendTelegramMessage({
    chatId,
    replyMarkup: reply.keyboard,
    text: reply.text
  });
}

async function handleRegistrationStep(
  profile: NonNullable<Awaited<ReturnType<typeof ensureTelegramProfile>>>,
  text: string
) {
  if (profile.stage === "collect_name") {
    await updateTelegramProfile({
      chatId: profile.chatId,
      patch: {
        pendingName: text,
        stage: "collect_phone"
      }
    });
    await sendTelegramMessage({
      chatId: profile.chatId,
      text: "Теперь отправьте номер телефона в международном формате."
    });
    return;
  }

  if (profile.stage === "collect_phone") {
    const phone = normalizePhone(text);

    if (!isPhoneValid(phone)) {
      await sendTelegramMessage({
        chatId: profile.chatId,
        text: "Номер не распознан. Пример: +375291112233"
      });
      return;
    }

    const code = generateOtpCode();
    const sms = await sendOtpSms({
      code,
      phone
    });

    await updateTelegramProfile({
      chatId: profile.chatId,
      patch: {
        codeExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        pendingCodeHash: hashOtpCode(code),
        pendingPhone: phone,
        stage: "verify_code"
      }
    });

    await sendTelegramMessage({
      chatId: profile.chatId,
      text: sms.delivered
        ? "Код отправлен по SMS. Пришлите его сюда."
        : `${sms.preview}\nПосле настройки SMS-провайдера этот fallback исчезнет.`
    });
    return;
  }

  const isValid = isOtpValid(profile, text);

  if (!isValid) {
    await sendTelegramMessage({
      chatId: profile.chatId,
      text: "Код неверный или истек. Попробуйте еще раз."
    });
    return;
  }

  const user = await registerTelegramCustomer({
    fullName: profile.pendingName || "Telegram user",
    phone: profile.pendingPhone || ""
  });

  await updateTelegramProfile({
    chatId: profile.chatId,
    patch: {
      codeExpiresAt: null,
      pendingCodeHash: null,
      pendingIntent: {},
      stage: "ready",
      userId: user.id
    }
  });

  await sendTelegramMessage({
    chatId: profile.chatId,
    text: [
      "Регистрация завершена.",
      "Теперь можете писать, например:",
      "Мне нужен корт в Минске на завтра после обеда."
    ].join("\n")
  });
}

async function handleCallback(query: NonNullable<TelegramUpdate["callback_query"]>) {
  const chatId = query.message?.chat?.id;
  const data = query.data || "";

  if (!chatId || !data.includes(":")) {
    return;
  }

  const [action, bookingId] = data.split(":");

  if (action === "confirm") {
    await confirmTelegramBooking({ bookingId, chatId });
    await answerTelegramCallback({
      callbackQueryId: query.id,
      text: "Бронирование подтверждено"
    });
    await sendTelegramMessage({
      chatId,
      text: "Бронь подтверждена и сохранена."
    });
    return;
  }

  if (action === "reject") {
    await rejectTelegramBooking({ bookingId, chatId });
    await answerTelegramCallback({
      callbackQueryId: query.id,
      text: "Бронирование отменено"
    });
    await sendTelegramMessage({
      chatId,
      text: "Черновик бронирования отменен."
    });
  }
}

function isOtpValid(
  profile: NonNullable<Awaited<ReturnType<typeof ensureTelegramProfile>>>,
  text: string
) {
  if (!profile.pendingCodeHash || !profile.codeExpiresAt) {
    return false;
  }

  if (new Date(profile.codeExpiresAt).getTime() < Date.now()) {
    return false;
  }

  return verifyOtpCode({
    code: text,
    hash: profile.pendingCodeHash
  });
}

function validateSecret(headers: Headers) {
  const secret = getEnv().TELEGRAM_WEBHOOK_SECRET;

  if (!secret) {
    return;
  }

  const header = headers.get("x-telegram-bot-api-secret-token");

  if (header !== secret) {
    throw new Error("Invalid Telegram webhook secret");
  }
}
