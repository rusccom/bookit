import { z } from "zod";

import {
  getTodayIso,
  isFutureBookingStart,
  isIsoDate,
  parseTimeLabel
} from "@/features/shared/server/dateTime";

const durations = new Set([30, 60, 90, 120]);
const timeSchema = z.string().regex(/^(?:[01]\d|2[0-3]):(?:00|30)$/, "Время должно быть кратно 30 минутам");
const dateSchema = z.string().refine(isIsoDate, "Укажите корректную дату").refine(
  (value) => value >= getTodayIso(), "Нельзя выбрать прошедшую дату"
);

export const availabilitySearchSchema = z.object({
  city: z.string().trim().min(2, "Выберите город").max(80),
  date: dateSchema,
  durationMinutes: z.number().int().refine((value) => durations.has(value), "Выберите доступную длительность"),
  endTime: timeSchema.optional(),
  startTime: timeSchema.optional(),
  venueQuery: z.string().trim().max(100).optional()
}).refine((input) => validTimeFilters(input), {
  message: "Время «до» должно быть позже времени «после»"
});

export const bookingSlotSchema = z.object({
  date: dateSchema,
  durationMinutes: z.number().int().refine((value) => durations.has(value), "Выберите доступную длительность"),
  startTime: timeSchema,
  unitId: z.string().uuid("Корт не найден")
}).refine((input) => isFutureBookingStart(input.date, parseTimeLabel(input.startTime)), {
  message: "Нельзя забронировать прошедшее время"
});

export function parseAvailabilityInput(input: z.input<typeof availabilitySearchSchema>) {
  return parseOrThrow(availabilitySearchSchema, input);
}

export function parseBookingSlot(input: z.input<typeof bookingSlotSchema>) {
  return parseOrThrow(bookingSlotSchema, input);
}

function validTimeFilters(input: { endTime?: string; startTime?: string }) {
  if (!input.endTime || !input.startTime) return true;
  return parseTimeLabel(input.startTime) < parseTimeLabel(input.endTime);
}

function parseOrThrow<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message || "Проверьте параметры поиска");
  return result.data;
}
