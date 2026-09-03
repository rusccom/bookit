import { getOwnerUnits } from "@/features/catalog/server/catalogService";
import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { listActiveBookingsByUnits } from "@/features/booking/server/availabilityRepository";
import { buildAvailabilityOptions, buildOpenBlocks } from "@/features/booking/server/slotEngine";
import type { OccupancyDay, OccupancyTotals, OwnerOccupancyItem } from "@/features/booking/server/ownerOccupancyTypes";
import { getWeekday } from "@/features/shared/server/dateTime";

type BookingRanges = { startMinutes: number; endMinutes: number }[];

export async function getOwnerOccupancy(ownerUserId: string, days: string[]) {
  const units = (await getOwnerUnits(ownerUserId)).filter((unit) => unit.isActive && unit.isVenueActive);
  const maps = await Promise.all(days.map((bookingDate) => listActiveBookingsByUnits({ bookingDate, unitIds: units.map((unit) => unit.unitId) })));
  const items: OwnerOccupancyItem[] = units.map((unit) => ({
    unitId: unit.unitId, unitTitle: unit.unitTitle, venueTitle: unit.venueTitle, slotMinutes: unit.slotMinutes,
    days: days.map((date, index) => getDayOccupancy(unit, date, maps[index].get(unit.unitId) || []))
  }));
  return { items, totals: summarizeOccupancy(items.flatMap((item) => item.days)) };
}

export function getDayOccupancy(unit: OwnerUnit, date: string, bookings: BookingRanges): OccupancyDay {
  const total = countSlots(unit, date, []);
  const free = countSlots(unit, date, bookings);
  return { date, total, occupied: total - free };
}

export function summarizeOccupancy(days: OccupancyDay[]): OccupancyTotals {
  const total = days.reduce((sum, day) => sum + day.total, 0);
  const occupied = days.reduce((sum, day) => sum + day.occupied, 0);
  return { total, occupied, free: total - occupied, percent: total ? Math.round(occupied * 100 / total) : 0 };
}

function countSlots(unit: OwnerUnit, date: string, bookings: BookingRanges) {
  const rules = unit.rules.filter((rule) => rule.weekday === getWeekday(date));
  const blocks = buildOpenBlocks({ rules, bookings });
  return buildAvailabilityOptions({ blocks, durationMinutes: unit.slotMinutes, slotMinutes: unit.slotMinutes }).length;
}
