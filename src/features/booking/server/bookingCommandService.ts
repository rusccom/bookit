import {
  findOwnerUnit
} from "@/features/booking/server/availabilityRepository";
import {
  createBooking,
  hasActiveOverlap,
  runBookingTransaction,
  updateBookingStatus
} from "@/features/booking/server/bookingMutationRepository";
import {
  findTelegramPendingBooking,
  getBookingForActor
} from "@/features/booking/server/bookingQueryRepository";
import {
  ensureOwnerUnitCanBeBooked,
  ensureUnitCanBeBooked
} from "@/features/booking/server/availabilityService";
import {
  parseTimeLabel
} from "@/features/shared/server/dateTime";
import { isFutureBooking } from "@/features/booking/server/bookingTime";
import type { CreateBookingInput } from "@/features/booking/server/bookingRepositoryTypes";
import type { DbExecutor } from "@/features/database/server/types";

type BookingDraft = Omit<CreateBookingInput, "sql">;

export async function createCustomerBooking(input: {
  date: string;
  durationMinutes: number;
  note?: string;
  startTime: string;
  unitId: string;
  userId: string;
}) {
  await ensureUnitCanBeBooked(input);
  return createConfirmedBooking({
    bookingDate: input.date,
    createdByUserId: input.userId,
    customerUserId: input.userId,
    durationMinutes: input.durationMinutes,
    note: normalizeNote(input.note),
    source: "web_customer",
    startTime: input.startTime,
    unitId: input.unitId
  });
}

export async function createOwnerManualBooking(input: {
  date: string;
  endTime: string;
  note?: string;
  ownerUserId: string;
  startTime: string;
  unitId: string;
}) {
  const durationMinutes = parseTimeLabel(input.endTime) - parseTimeLabel(input.startTime);
  await ensureOwnerUnitExists(input.ownerUserId, input.unitId);
  await ensureOwnerUnitCanBeBooked({
    date: input.date, durationMinutes, startTime: input.startTime, unitId: input.unitId
  });
  return createConfirmedBooking({
    bookingDate: input.date, createdByUserId: input.ownerUserId, durationMinutes,
    note: normalizeNote(input.note), source: "owner_manual",
    startTime: input.startTime, unitId: input.unitId
  });
}

async function ensureOwnerUnitExists(ownerUserId: string, unitId: string) {
  const unit = await findOwnerUnit({ ownerUserId, unitId });
  if (!unit) throw new Error("Корт не найден или отключён");
}

export async function createTelegramPendingBooking(input: {
  chatId: number;
  date: string;
  durationMinutes: number;
  startTime: string;
  unitId: string;
  userId: string;
}) {
  await ensureUnitCanBeBooked(input);
  const startMinutes = parseTimeLabel(input.startTime);
  return insertBookingSafely({
    bookingDate: input.date, createdByUserId: input.userId, customerUserId: input.userId,
    endMinutes: startMinutes + input.durationMinutes,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    source: "telegram_llm", startMinutes, status: "pending_confirmation",
    telegramChatId: input.chatId, unitId: input.unitId
  });
}

export async function confirmTelegramBooking(input: {
  bookingId: string;
  chatId: number;
}) {
  const pending = await findTelegramBooking(input);
  return runBookingTransaction(pending.unitId, (sql) => confirmPendingBooking(input, sql));
}

async function confirmPendingBooking(input: { bookingId: string; chatId: number }, sql: DbExecutor) {
  const booking = await findTelegramBooking(input);
  await ensureNoOverlap({
    bookingDate: booking.bookingDate, bookingId: input.bookingId,
    endMinutes: booking.endMinutes, sql,
    startMinutes: booking.startMinutes, unitId: booking.unitId
  });
  await updateBookingStatus({ bookingId: input.bookingId, sql, status: "confirmed" });
}

export async function rejectTelegramBooking(input: {
  bookingId: string;
  chatId: number;
}) {
  await findTelegramBooking(input);
  await updateBookingStatus({ bookingId: input.bookingId, status: "cancelled" });
}

export async function cancelBooking(input: {
  actorRole: "customer" | "owner";
  actorUserId: string;
  bookingId: string;
}) {
  const booking = await getBookingForActor(input);

  if (!booking) {
    throw new Error("Бронирование не найдено");
  }

  if (booking.status === "cancelled") throw new Error("Бронирование уже отменено");
  if (!isFutureBooking(booking)) throw new Error("Прошедшее бронирование нельзя отменить");

  await updateBookingStatus({
    bookingId: input.bookingId,
    status: "cancelled"
  });
}

async function createConfirmedBooking(input: {
  bookingDate: string;
  createdByUserId: string;
  customerUserId?: string;
  durationMinutes: number;
  note?: string;
  source: string;
  startTime: string;
  unitId: string;
}) {
  const startMinutes = parseTimeLabel(input.startTime);
  return insertBookingSafely({
    bookingDate: input.bookingDate, createdByUserId: input.createdByUserId,
    customerUserId: input.customerUserId, endMinutes: startMinutes + input.durationMinutes,
    note: input.note, source: input.source, startMinutes,
    status: "confirmed", unitId: input.unitId
  });
}

async function insertBookingSafely(input: BookingDraft) {
  return runBookingTransaction(input.unitId, async (sql) => {
    await ensureNoOverlap({
      bookingDate: input.bookingDate, endMinutes: input.endMinutes,
      sql, startMinutes: input.startMinutes, unitId: input.unitId
    });
    return createBooking({ ...input, sql });
  });
}

async function ensureNoOverlap(input: {
  bookingDate: string;
  bookingId?: string;
  endMinutes: number;
  sql: Parameters<typeof hasActiveOverlap>[0]["sql"];
  startMinutes: number;
  unitId: string;
}) {
  const overlap = await hasActiveOverlap(input);

  if (overlap) {
    throw new Error("Этот слот уже занят");
  }
}

async function findTelegramBooking(input: {
  bookingId: string;
  chatId: number;
}) {
  const booking = await findTelegramPendingBooking(input);

  if (!booking) {
    throw new Error("Ожидающее бронирование не найдено");
  }

  return {
    bookingDate: booking.dateLabel,
    endMinutes: parseTimeLabel(booking.endTime),
    startMinutes: parseTimeLabel(booking.startTime),
    unitId: booking.unitId
  };
}

function normalizeNote(value?: string) {
  const note = value?.trim() || "";
  if (note.length > 500) throw new Error("Комментарий не должен превышать 500 символов");
  return note;
}
