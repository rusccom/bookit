import type { AvailabilityResult } from "@/features/booking/server/bookingTypes";
import {
  findUnit,
  listActiveBookingsByUnits,
  listRulesByUnits,
  listUnitsForAvailability
} from "@/features/booking/server/availabilityRepository";
import { buildAvailabilityOptions, buildOpenBlocks } from "@/features/booking/server/slotEngine";
import { getWeekday, parseTimeLabel } from "@/features/shared/server/dateTime";

export async function searchAvailability(input: {
  city: string;
  date: string;
  durationMinutes: number;
  endTime?: string;
  startTime?: string;
  venueQuery?: string;
}) {
  const units = await listUnitsForAvailability({
    city: input.city,
    venueQuery: input.venueQuery
  });
  const unitIds = units.map((unit) => unit.unitId);
  const weekday = getWeekday(input.date);
  const [rulesMap, bookingsMap] = await Promise.all([
    listRulesByUnits({ unitIds, weekday }),
    listActiveBookingsByUnits({
      bookingDate: input.date,
      unitIds
    })
  ]);

  return units
    .map((unit) => {
      const rules = rulesMap.get(unit.unitId) || [];
      const bookings = bookingsMap.get(unit.unitId) || [];
      const blocks = buildOpenBlocks({ bookings, rules });
      const options = buildAvailabilityOptions({
        blocks,
        durationMinutes: input.durationMinutes,
        endFilter: toMinutes(input.endTime),
        startFilter: toMinutes(input.startTime)
      });

      if (!options.length) {
        return null;
      }

      return {
        address: unit.address,
        city: unit.city,
        kind: unit.kind,
        options,
        unitId: unit.unitId,
        unitTitle: unit.unitTitle,
        venueTitle: unit.venueTitle
      } satisfies AvailabilityResult;
    })
    .filter(Boolean) as AvailabilityResult[];
}

export async function ensureUnitCanBeBooked(input: {
  date: string;
  durationMinutes: number;
  startTime: string;
  unitId: string;
}) {
  const unit = await findUnit(input.unitId);

  if (!unit) {
    throw new Error("Unit not found");
  }

  const endTime = addMinutes(input.startTime, input.durationMinutes);
  const items = await searchAvailability({
    city: unit.city,
    date: input.date,
    durationMinutes: input.durationMinutes
  });
  const match = items.find((item) => item.unitId === input.unitId);
  const exists = match?.options.some((option) => {
    return option.startTime === input.startTime && option.endTime === endTime;
  });

  if (!exists) {
    throw new Error("Selected slot is unavailable");
  }
}

function toMinutes(value?: string) {
  return value ? parseTimeLabel(value) : undefined;
}

function addMinutes(time: string, minutes: number): string {
  const total = parseTimeLabel(time) + minutes;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}
