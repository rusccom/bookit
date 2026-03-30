import { getEnv } from "@/features/shared/server/env";

type ReplyMarkup = {
  inline_keyboard: Array<Array<{ callback_data: string; text: string }>>;
};

export async function sendTelegramMessage(input: {
  chatId: number;
  replyMarkup?: ReplyMarkup;
  text: string;
}) {
  return callTelegram("sendMessage", {
    chat_id: input.chatId,
    reply_markup: input.replyMarkup,
    text: input.text
  });
}

export async function answerTelegramCallback(input: {
  callbackQueryId: string;
  text?: string;
}) {
  return callTelegram("answerCallbackQuery", {
    callback_query_id: input.callbackQueryId,
    text: input.text
  });
}

async function callTelegram(method: string, payload: Record<string, unknown>) {
  const token = getEnv().TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("Telegram bot token is not configured");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(`Telegram API request failed: ${response.status}`);
  }

  return response.json();
}
