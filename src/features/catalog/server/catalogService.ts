import { z } from "zod";

import {
  COURT_KIND_OPTIONS,
  COURT_SURFACE_OPTIONS
} from "@/features/catalog/courtOptions";
import {
  createUnitWithRules,
  listDistinctCities,
  listOwnerUnits,
  listSearchUnits,
  setOwnerUnitActive,
  updateUnitWithRules
} from "@/features/catalog/server/catalogRepository";
import type { WeeklyScheduleEntry } from "@/features/catalog/server/catalogTypes";
import { parseTimeLabel } from "@/features/shared/server/dateTime";

const allowedKinds = new Set<string>(COURT_KIND_OPTIONS.map((item) => item.value));
const allowedSurfaces = new Set<string>(COURT_SURFACE_OPTIONS.map((item) => item.value));
const timeSchema = z.string().regex(/^(?:[01]\d|2[0-3]):(?:00|30)$/, "Время должно быть кратно 30 минутам");

const scheduleSchema = z.object({
  endTime: timeSchema,
  startTime: timeSchema,
  weekday: z.number().int().min(0).max(6)
}).refine((item) => parseTimeLabel(item.startTime) < parseTimeLabel(item.endTime), {
  message: "Время закрытия должно быть позже времени открытия"
});

const courtSchema = z.object({
  address: z.string().trim().min(3, "Укажите адрес").max(200, "Адрес слишком длинный"),
  city: z.string().trim().min(2, "Укажите город").max(80, "Название города слишком длинное"),
  description: z.string().trim().max(500, "Описание не должно превышать 500 символов"),
  kind: z.string().refine((value) => allowedKinds.has(value), "Выберите вид спорта"),
  ownerUserId: z.string().uuid(),
  pricePerHour: z.number().finite().min(0, "Цена не может быть отрицательной").max(10000, "Проверьте цену"),
  schedule: z.array(scheduleSchema).min(1, "Выберите хотя бы один рабочий день").max(7),
  surface: z.string().refine((value) => allowedSurfaces.has(value), "Выберите покрытие"),
  title: z.string().trim().min(2, "Укажите название корта").max(100),
  venueTitle: z.string().trim().min(2, "Укажите название площадки").max(100)
});

type CourtInput = z.input<typeof courtSchema>;

export async function createOwnerUnit(input: CourtInput) {
  await createUnitWithRules(parseCourt(input));
}

export async function updateOwnerUnit(input: CourtInput & { unitId: string }) {
  const unitId = z.string().uuid("Некорректный корт").parse(input.unitId);
  await updateUnitWithRules({ ...parseCourt(input), unitId });
}

export async function toggleOwnerUnit(input: {
  active: boolean;
  ownerUserId: string;
  unitId: string;
}) {
  const schema = z.object({ active: z.boolean(), ownerUserId: z.string().uuid(), unitId: z.string().uuid() });
  const updated = await setOwnerUnitActive(schema.parse(input));
  if (!updated) throw new Error("Корт не найден");
}

export async function getOwnerUnits(ownerUserId: string) {
  return listOwnerUnits(ownerUserId);
}

export async function getCityOptions() {
  return listDistinctCities();
}

export async function searchUnits(input: { city: string; venueQuery?: string }) {
  return listSearchUnits(input);
}

function parseCourt(input: CourtInput) {
  const result = courtSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message || "Проверьте данные корта");
  assertUniqueDays(result.data.schedule);
  return result.data;
}

function assertUniqueDays(schedule: WeeklyScheduleEntry[]) {
  const days = new Set(schedule.map((item) => item.weekday));
  if (days.size !== schedule.length) throw new Error("Каждый день должен быть указан один раз");
}
