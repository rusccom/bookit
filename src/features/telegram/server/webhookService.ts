import { registerTelegramCustomer } from "@/features/auth/server/authService";
import { confirmTelegramBooking, rejectTelegramBooking } from "@/features/booking/server/bookingService";
import { buildTelegramAssistantReply } from "@/features/llm/server/assistantService";
import { getEnv, isSmsConfigured } from "@/features/shared/server/env";
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

type TelegramProfile = NonNullable<Awaited<ReturnType<typeof ensureTelegramProfile>>>;

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
    await startRegistration(chatId);
    return;
  }

  if (profile.stage !== "ready" || !profile.userId) {
    await handleRegistrationStep(profile, text);
    return;
  }

  await handleReadyUserMessage({
    chatId: profile.chatId,
    pendingIntent: profile.pendingIntent,
    userId: profile.userId
  }, text);
}

async function startRegistration(chatId: number) {
  await resetTelegramProfile(chatId);
  await sendTelegramMessage({
    chatId,
    text: [
      "Здравствуйте. Я bot Bookit.",
      "Могу помочь с регистрацией, поиском свободных кортов и бронированием.",
      "Для начала напишите ваше имя."
    ].join("\n")
  });
}

async function handleReadyUserMessage(
  profile: {
    chatId: number;
    pendingIntent: Record<string, unknown>;
    userId: string;
  },
  text: string
) {
  const reply = await buildTelegramAssistantReply({
    chatId: profile.chatId,
    message: text,
    previousIntent: profile.pendingIntent,
    userId: profile.userId
  });

  await updateTelegramProfile({
    chatId: profile.chatId,
    patch: {
      pendingIntent: reply.nextIntent
    }
  });

  await sendTelegramMessage({
    chatId: profile.chatId,
    replyMarkup: reply.keyboard,
    text: reply.text
  });
}

async function handleRegistrationStep(profile: TelegramProfile, text: string) {
  if (profile.stage === "collect_name") {
    await handleNameStep(profile, text);
    return;
  }

  if (profile.stage === "collect_phone") {
    await handlePhoneStep(profile, text);
    return;
  }

  await handleCodeStep(profile, text);
}

async function handleNameStep(profile: TelegramProfile, text: string) {
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
}

async function handlePhoneStep(profile: TelegramProfile, text: string) {
  const phone = normalizePhone(text);

  if (!isPhoneValid(phone)) {
    await sendTelegramMessage({
      chatId: profile.chatId,
      text: "Номер не распознан. Пример: +375291112233"
    });
    return;
  }

  if (!isSmsConfigured()) {
    await completeTelegramRegistration(profile, phone, false);
    return;
  }

  await sendVerificationCode(profile.chatId, phone);
}

async function sendVerificationCode(chatId: number, phone: string) {
  const code = generateOtpCode();
  const sms = await sendOtpSms({
    code,
    phone
  });

  await updateTelegramProfile({
    chatId,
    patch: {
      codeExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      pendingCodeHash: hashOtpCode(code),
      pendingPhone: phone,
      stage: "verify_code"
    }
  });

  await sendTelegramMessage({
    chatId,
    text: sms.delivered
      ? "Код отправлен по SMS. Пришлите его сюда."
      : `${sms.preview}\nПосле настройки SMS-провайдера этот fallback исчезнет.`
  });
}

async function handleCodeStep(profile: TelegramProfile, text: string) {
  if (!isOtpValid(profile, text)) {
    await sendTelegramMessage({
      chatId: profile.chatId,
      text: "Код неверный или истек. Попробуйте еще раз."
    });
    return;
  }

  await completeTelegramRegistration(profile, profile.pendingPhone || "", true);
}

async function completeTelegramRegistration(
  profile: TelegramProfile,
  phone: string,
  smsConfirmed: boolean
) {
  const user = await registerTelegramCustomer({
    fullName: profile.pendingName || "Telegram user",
    phone
  });

  await updateTelegramProfile({
    chatId: profile.chatId,
    patch: {
      codeExpiresAt: null,
      pendingCodeHash: null,
      pendingIntent: {},
      pendingPhone: phone,
      stage: "ready",
      userId: user.id
    }
  });

  await sendTelegramMessage({
    chatId: profile.chatId,
    text: buildRegistrationDoneText(smsConfirmed)
  });
}

function buildRegistrationDoneText(smsConfirmed: boolean) {
  const hint = smsConfirmed
    ? "Теперь можете писать, например:"
    : "SMS-подтверждение отключено, номер сохранен как введенный. Теперь можете писать, например:";

  return [
    "Регистрация завершена.",
    hint,
    "Мне нужен корт в Минске на завтра после обеда."
  ].join("\n");
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

function isOtpValid(profile: TelegramProfile, text: string) {
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
