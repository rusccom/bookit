import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

import { bookingIntentSchema } from "@/features/llm/server/intentSchema";
import { getEnv, isAiConfigured } from "@/features/shared/server/env";

let client: OpenAI | null = null;

export async function extractBookingIntent(input: {
  message: string;
  previousIntent: Record<string, unknown>;
  todayIso: string;
}) {
  if (!isAiConfigured()) {
    return getFallbackIntent();
  }

  const completion = await getClient().chat.completions.parse({
    messages: [
      {
        content: buildSystemPrompt(input.todayIso, input.previousIntent),
        role: "system"
      },
      {
        content: input.message,
        role: "user"
      }
    ],
    model: getEnv().OPENAI_MODEL,
    response_format: zodResponseFormat(bookingIntentSchema, "booking_intent")
  });

  return completion.choices[0]?.message.parsed || getFallbackIntent();
}

function buildSystemPrompt(
  todayIso: string,
  previousIntent: Record<string, unknown>
) {
  return [
    "You help a Telegram booking bot for sports courts.",
    `Today is ${todayIso}.`,
    `Previous intent state: ${JSON.stringify(previousIntent)}.`,
    "Merge the current message with the previous intent.",
    "Return action=availability when user asks what is free.",
    "Return action=book when user clearly wants to reserve a concrete slot.",
    "Resolve relative dates like tomorrow into ISO format YYYY-MM-DD.",
    "Use 24-hour HH:MM format and 30-minute aligned durations.",
    "If city or date is missing for availability, set needsClarification=true.",
    "If booking lacks city, venue, date, start time, or duration, set needsClarification=true.",
    "Keep responseText and clarificationQuestion concise in Russian."
  ].join(" ");
}

function getClient() {
  if (client) {
    return client;
  }

  client = new OpenAI({
    apiKey: getEnv().OPENAI_API_KEY
  });

  return client;
}

function getFallbackIntent() {
  return {
    action: "faq" as const,
    city: null,
    date: null,
    durationMinutes: null,
    endTime: null,
    needsClarification: true,
    clarificationQuestion:
      "LLM пока не настроена. Добавьте OPENAI_API_KEY и OPENAI_MODEL в env.",
    responseText:
      "LLM пока не настроена. Добавьте OPENAI_API_KEY и OPENAI_MODEL в env.",
    startTime: null,
    venueQuery: null
  };
}
