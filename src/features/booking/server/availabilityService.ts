import type { UnitOption } from "@/features/booking/server/bookingTypes";
import { formatSlotMinutes } from "@/features/catalog/slotOptions";
import {
  findUnit,
  listActiveBookingsByUnits,
  listRulesByUnits,
  listUnitsForAvailability
} from "@/features/booking/server/availabilityRepository";
import {
  parseAvailabilityInput,
  parseBookingSlot
} from "@/features/booking/server/availabilitySchema";
import { buildAvailabilityOptions, buildOpenBlocks } from "@/features/booking/server/slotEngine";
import { getMinimumBookingMinutes, getWeekday, parseTimeLabel } from "@/features/shared/server/dateTime";

type SearchInput = Parameters<typeof parseAvailabilityInput>[0];
type RulesMap = Awaited<ReturnType<typeof listRulesByUnits>>;
type BookingsMap = Awaited<ReturnType<typeof listActiveBookingsByUnits>>;

export async function searchAvailability(input: SearchInput) {
  const parsed = parseAvailabilityInput(input);
  const units = await listUnitsForAvailability(parsed);
  const maps = await loadAvailabilityMaps(units, parsed.date);
  return units.map((unit) => buildUnitResult(unit, maps, parsed)).filter(hasOptions);
}

export async function searchAvailabilityForView(input: SearchInput) {
  try {
    return { error: "", items: await searchAvailability(input) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось загрузить свободное время";
    return { error: message, items: [] };
  }
}

export async function ensureUnitCanBeBooked(input: {
  date: string;
  durationMinutes: number;
  startTime: string;
  unitId: string;
}) {
  const parsed = parseBookingSlot(input);
  const unit = await findUnit(parsed.unitId);
  if (!unit) throw new Error("Корт недоступен для бронирования");
  if (parsed.durationMinutes % unit.slotMinutes !== 0) throw new Error(`Длительность записи должна быть кратна шагу корта: ${formatSlotMinutes(unit.slotMinutes)}`);
  const maps = await loadAvailabilityMaps([unit], parsed.date);
  const result = buildUnitResult(unit, maps, parsed);
  const endTime = addMinutes(parsed.startTime, parsed.durationMinutes);
  if (!result.options.some((item) => item.startTime === parsed.startTime && item.endTime === endTime)) {
    throw new Error("Этот слот уже занят или недоступен");
  }
}

async function loadAvailabilityMaps(units: UnitOption[], date: string) {
  const unitIds = units.map((unit) => unit.unitId);
  const [rules, bookings] = await Promise.all([
    listRulesByUnits({ unitIds, weekday: getWeekday(date) }),
    listActiveBookingsByUnits({ bookingDate: date, unitIds })
  ]);
  return { bookings, rules };
}

function buildUnitResult(
  unit: UnitOption,
  maps: { bookings: BookingsMap; rules: RulesMap },
  input: { date: string; durationMinutes: number; endTime?: string; startTime?: string }
) {
  const blocks = buildOpenBlocks({
    bookings: maps.bookings.get(unit.unitId) || [],
    rules: maps.rules.get(unit.unitId) || []
  });
  const options = buildAvailabilityOptions({
    blocks,
    durationMinutes: input.durationMinutes,
    endFilter: toMinutes(input.endTime),
    slotMinutes: unit.slotMinutes,
    startFilter: minimumStart(input.date, input.startTime)
  });
  return { ...unit, options };
}

function minimumStart(date: string, requested?: string) {
  const values = [getMinimumBookingMinutes(date), toMinutes(requested)].filter(isNumber);
  return values.length ? Math.max(...values) : undefined;
}

function toMinutes(value?: string) {
  return value ? parseTimeLabel(value) : undefined;
}

function isNumber(value: number | undefined): value is number {
  return value !== undefined;
}

function hasOptions<T extends { options: unknown[] }>(item: T): boolean {
  return item.options.length > 0;
}

function addMinutes(time: string, minutes: number): string {
  const total = parseTimeLabel(time) + minutes;
  const hours = Math.floor(total / 60);
  return `${String(hours).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
