import {
  confirmTelegramBooking,
  rejectTelegramBooking
} from "@/features/booking/server/bookingService";
import { isTelegramUserActive } from "@/features/telegram/server/telegramAccess";
import {
  answerTelegramCallback,
  sendTelegramMessage
} from "@/features/telegram/server/telegramApi";
import { ensureTelegramProfile } from "@/features/telegram/server/telegramRepository";

type CallbackQuery = {
  data?: string;
  id: string;
  message?: { chat?: { id: number } };
};

export async function handleTelegramCallback(query: CallbackQuery) {
  const chatId = query.message?.chat?.id;
  const data = query.data || "";
  if (!chatId || !data.includes(":")) return;
  const profile = await ensureTelegramProfile(chatId);
  if (!profile?.userId || !await isTelegramUserActive(profile.userId)) return;
  const [action, bookingId] = data.split(":");
  if (action === "confirm") await confirmTelegramCallback(query.id, bookingId, chatId);
  if (action === "reject") await rejectBooking(query.id, bookingId, chatId);
}

async function confirmTelegramCallback(callbackId: string, bookingId: string, chatId: number) {
  await confirmTelegramBooking({ bookingId, chatId });
  await answerTelegramCallback({ callbackQueryId: callbackId, text: "Бронирование подтверждено" });
  await sendTelegramMessage({ chatId, text: "Бронь подтверждена и сохранена." });
}

async function rejectBooking(callbackId: string, bookingId: string, chatId: number) {
  await rejectTelegramBooking({ bookingId, chatId });
  await answerTelegramCallback({ callbackQueryId: callbackId, text: "Бронирование отменено" });
  await sendTelegramMessage({ chatId, text: "Черновик бронирования отменен." });
}
