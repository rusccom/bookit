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
import { ensureUnitCanBeBooked } from "@/features/booking/server/availabilityService";
import { parseTimeLabel } from "@/features/shared/server/dateTime";

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
    note: input.note,
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
  const unit = await findOwnerUnit({
    ownerUserId: input.ownerUserId,
    unitId: input.unitId
  });

  if (!unit) {
    throw new Error("Unit not found for owner");
  }

  const durationMinutes = parseTimeLabel(input.endTime) - parseTimeLabel(input.startTime);

  await ensureUnitCanBeBooked({
    date: input.date,
    durationMinutes,
    startTime: input.startTime,
    unitId: input.unitId
  });

  return createConfirmedBooking({
    bookingDate: input.date,
    createdByUserId: input.ownerUserId,
    durationMinutes,
    note: input.note,
    source: "owner_manual",
    startTime: input.startTime,
    unitId: input.unitId
  });
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
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const startMinutes = parseTimeLabel(input.startTime);
  const endMinutes = startMinutes + input.durationMinutes;

  return runBookingTransaction(input.unitId, async (sql) => {
    await ensureNoOverlap({
      bookingDate: input.date,
      endMinutes,
      sql,
      startMinutes,
      unitId: input.unitId
    });

    return createBooking({
      bookingDate: input.date,
      createdByUserId: input.userId,
      customerUserId: input.userId,
      endMinutes,
      expiresAt,
      source: "telegram_llm",
      sql,
      startMinutes,
      status: "pending_confirmation",
      telegramChatId: input.chatId,
      unitId: input.unitId
    });
  });
}

export async function confirmTelegramBooking(input: {
  bookingId: string;
  chatId: number;
}) {
  const pending = await findTelegramBooking(input);

  return runBookingTransaction(pending.unitId, async (sql) => {
    const booking = await findTelegramBooking(input);
    await ensureNoOverlap({
      bookingDate: booking.bookingDate,
      bookingId: input.bookingId,
      endMinutes: booking.endMinutes,
      sql,
      startMinutes: booking.startMinutes,
      unitId: booking.unitId
    });

    await updateBookingStatus({
      bookingId: input.bookingId,
      sql,
      status: "confirmed"
    });
  });
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
    throw new Error("Booking not found");
  }

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
  const endMinutes = startMinutes + input.durationMinutes;

  return runBookingTransaction(input.unitId, async (sql) => {
    await ensureNoOverlap({
      bookingDate: input.bookingDate,
      endMinutes,
      sql,
      startMinutes,
      unitId: input.unitId
    });

    return createBooking({
      bookingDate: input.bookingDate,
      createdByUserId: input.createdByUserId,
      customerUserId: input.customerUserId,
      endMinutes,
      note: input.note,
      source: input.source,
      sql,
      startMinutes,
      status: "confirmed",
      unitId: input.unitId
    });
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
    throw new Error("Slot is already booked");
  }
}

async function findTelegramBooking(input: {
  bookingId: string;
  chatId: number;
}) {
  const booking = await findTelegramPendingBooking(input);

  if (!booking) {
    throw new Error("Pending Telegram booking not found");
  }

  return {
    bookingDate: booking.dateLabel,
    endMinutes: parseTimeLabel(booking.endTime),
    startMinutes: parseTimeLabel(booking.startTime),
    unitId: booking.unitId
  };
}
