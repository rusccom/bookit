import { z } from "zod";

import { isBookingDurationMinutes } from "@/features/booking/bookingDurationOptions";
import {
  getTodayIso,
  isFutureBookingStart,
  isIsoDate,
  parseTimeLabel
} from "@/features/shared/server/dateTime";
import { halfHourTimeSchema } from "@/features/shared/server/timeSchema";
import { parseWithMessage } from "@/features/shared/server/validation";

const dateSchema = z.string().refine(isIsoDate, "Укажите корректную дату").refine(
  (value) => value >= getTodayIso(), "Нельзя выбрать прошедшую дату"
);
const bookingSlotFields = {
  date: dateSchema,
  startTime: halfHourTimeSchema,
  unitId: z.string().uuid("Корт не найден")
};

export const availabilitySearchSchema = z.object({
  city: z.string().trim().min(2, "Выберите город").max(80),
  date: dateSchema,
  durationMinutes: z.number().int().refine(isBookingDurationMinutes, "Выберите доступную длительность"),
  endTime: halfHourTimeSchema.optional(),
  startTime: halfHourTimeSchema.optional(),
  venueQuery: z.string().trim().max(100).optional()
}).refine((input) => validTimeFilters(input), {
  message: "Время «до» должно быть позже времени «после»"
});

export const bookingSlotSchema = z.object({
  ...bookingSlotFields,
  durationMinutes: z.number().int().refine(isBookingDurationMinutes, "Выберите доступную длительность"),
}).refine(isFutureSlot, {
  message: "Нельзя забронировать прошедшее время"
});

export const ownerBookingSlotSchema = z.object({
  ...bookingSlotFields,
  durationMinutes: z.number().int().min(30, "Минимальный резерв — 30 минут").max(24 * 60)
}).refine(isFutureSlot, {
  message: "Нельзя зарезервировать прошедшее время"
});

export function parseAvailabilityInput(input: z.input<typeof availabilitySearchSchema>) {
  return parseWithMessage(availabilitySearchSchema, input, "Проверьте параметры поиска");
}

export function parseBookingSlot(input: z.input<typeof bookingSlotSchema>) {
  return parseWithMessage(bookingSlotSchema, input, "Проверьте параметры бронирования");
}

export function parseOwnerBookingSlot(input: z.input<typeof ownerBookingSlotSchema>) {
  return parseWithMessage(ownerBookingSlotSchema, input, "Проверьте параметры резерва");
}

function validTimeFilters(input: { endTime?: string; startTime?: string }) {
  if (!input.endTime || !input.startTime) return true;
  return parseTimeLabel(input.startTime) < parseTimeLabel(input.endTime);
}

function isFutureSlot(input: { date: string; startTime: string }) {
  return isFutureBookingStart(input.date, parseTimeLabel(input.startTime));
}
