import type { BookingIntent } from "@/features/llm/server/intentSchema";
import { extractBookingIntent } from "@/features/llm/server/intentParser";
import {
  createTelegramPendingBooking,
  searchAvailability
} from "@/features/booking/server/bookingService";
import { toIsoDateLabel } from "@/features/shared/server/dateTime";

type AssistantReply = {
  keyboard?: {
    inline_keyboard: Array<Array<{ callback_data: string; text: string }>>;
  };
  nextIntent: Record<string, unknown>;
  text: string;
};

export async function buildTelegramAssistantReply(input: {
  chatId: number;
  message: string;
  previousIntent: Record<string, unknown>;
  userId: string;
}): Promise<AssistantReply> {
  const todayIso = toIsoDateLabel(new Date());
  const intent = await extractBookingIntent({
    message: input.message,
    previousIntent: input.previousIntent,
    todayIso
  });

  if (intent.needsClarification) {
    return {
      nextIntent: compactIntent(intent),
      text: intent.clarificationQuestion || intent.responseText
    };
  }

  if (intent.action === "availability") {
    return buildAvailabilityReply(intent);
  }

  if (intent.action === "book") {
    return buildBookingReply({
      chatId: input.chatId,
      intent,
      userId: input.userId
    });
  }

  return {
    nextIntent: {},
    text: intent.responseText
  };
}

async function buildAvailabilityReply(intent: BookingIntent): Promise<AssistantReply> {
  const items = await searchAvailability({
    city: intent.city || "",
    date: intent.date || "",
    durationMinutes: intent.durationMinutes || 60,
    endTime: intent.endTime || undefined,
    startTime: intent.startTime || undefined,
    venueQuery: intent.venueQuery || undefined
  });

  if (!items.length) {
    return {
      nextIntent: compactIntent(intent),
      text: "Свободных слотов по таким условиям не найдено."
    };
  }

  const lines = items.slice(0, 6).map((item) => {
    const firstOptions = item.options
      .slice(0, 4)
      .map((option) => `${option.startTime}-${option.endTime}`)
      .join(", ");

    return `• ${item.venueTitle} / ${item.unitTitle}: ${firstOptions}`;
  });

  return {
    nextIntent: compactIntent(intent),
    text: [`Свободно на ${intent.date}:`, ...lines].join("\n")
  };
}

async function buildBookingReply(input: {
  chatId: number;
  intent: BookingIntent;
  userId: string;
}): Promise<AssistantReply> {
  const items = await searchAvailability({
    city: input.intent.city || "",
    date: input.intent.date || "",
    durationMinutes: input.intent.durationMinutes || 60,
    startTime: input.intent.startTime || undefined,
    venueQuery: input.intent.venueQuery || undefined
  });
  const match = pickBookingMatch(items, input.intent);

  if (!match) {
    return {
      nextIntent: compactIntent(input.intent),
      text:
        "Не смог однозначно определить нужный корт. Уточните площадку или название корта."
    };
  }

  const bookingId = await createTelegramPendingBooking({
    chatId: input.chatId,
    date: input.intent.date || "",
    durationMinutes: input.intent.durationMinutes || 60,
    startTime: input.intent.startTime || "",
    unitId: match.unitId,
    userId: input.userId
  });

  return {
    keyboard: {
      inline_keyboard: [
        [
          { callback_data: `confirm:${bookingId}`, text: "Да" },
          { callback_data: `reject:${bookingId}`, text: "Нет" }
        ]
      ]
    },
    nextIntent: {},
    text: [
      "Подтвердите бронирование:",
      `${match.venueTitle} / ${match.unitTitle}`,
      `${input.intent.date} ${input.intent.startTime} на ${
        input.intent.durationMinutes
      } минут`
    ].join("\n")
  };
}

function compactIntent(intent: BookingIntent) {
  return {
    action: intent.action,
    city: intent.city,
    date: intent.date,
    durationMinutes: intent.durationMinutes,
    endTime: intent.endTime,
    startTime: intent.startTime,
    venueQuery: intent.venueQuery
  };
}

function pickBookingMatch(
  items: Awaited<ReturnType<typeof searchAvailability>>,
  intent: BookingIntent
) {
  if (!intent.startTime) {
    return null;
  }

  const matches = items.filter((item) =>
    item.options.some((option) => option.startTime === intent.startTime)
  );

  return matches.length === 1 ? matches[0] : null;
}
