import type { AvailabilityRule } from "@/features/catalog/server/catalogTypes";
import { formatMinutes, isHalfHourAligned } from "@/features/shared/server/dateTime";

type TimeRange = {
  endMinutes: number;
  startMinutes: number;
};

export function buildAvailabilityOptions(input: {
  blocks: TimeRange[];
  durationMinutes: number;
  endFilter?: number;
  startFilter?: number;
}) {
  const options = new Map<string, { endTime: string; startTime: string }>();
  for (const block of input.blocks) appendOptions(options, block, input);
  return [...options.values()];
}

export function buildOpenBlocks(input: {
  bookings: TimeRange[];
  rules: AvailabilityRule[];
}) {
  const rules = mergeRanges(input.rules.map(toRange).filter(isValidBlock));
  const bookings = mergeRanges(input.bookings.filter(isValidBlock));
  return rules.flatMap((rule) => subtractBookings(rule, bookings));
}

export function isBookingWindowValid(input: {
  durationMinutes: number;
  endMinutes: number;
  startMinutes: number;
}) {
  return input.endMinutes - input.startMinutes === input.durationMinutes && isRangeValid(input);
}

export function isRangeValid(range: TimeRange) {
  return range.startMinutes < range.endMinutes
    && range.startMinutes >= 0
    && range.endMinutes <= 1440
    && isHalfHourAligned(range.startMinutes)
    && isHalfHourAligned(range.endMinutes);
}

function appendOptions(
  options: Map<string, { endTime: string; startTime: string }>,
  block: TimeRange,
  input: { durationMinutes: number; endFilter?: number; startFilter?: number }
) {
  const maxStart = block.endMinutes - input.durationMinutes;
  for (let start = block.startMinutes; start <= maxStart; start += 30) {
    const end = start + input.durationMinutes;
    if (!matchesFilters(start, end, input)) continue;
    const startTime = formatMinutes(start);
    options.set(startTime, { endTime: formatMinutes(end), startTime });
  }
}

function matchesFilters(
  start: number,
  end: number,
  filters: { endFilter?: number; startFilter?: number }
) {
  if (filters.startFilter !== undefined && start < filters.startFilter) return false;
  if (filters.endFilter !== undefined && end > filters.endFilter) return false;
  return true;
}

function subtractBookings(rule: TimeRange, bookings: TimeRange[]) {
  const blocks: TimeRange[] = [];
  let cursor = rule.startMinutes;
  for (const booking of bookings.filter((item) => overlaps(item, rule))) {
    if (booking.startMinutes > cursor) blocks.push({ startMinutes: cursor, endMinutes: booking.startMinutes });
    cursor = Math.max(cursor, booking.endMinutes);
  }
  if (cursor < rule.endMinutes) blocks.push({ startMinutes: cursor, endMinutes: rule.endMinutes });
  return blocks.filter(isValidBlock);
}

function mergeRanges(ranges: TimeRange[]) {
  const sorted = [...ranges].sort((a, b) => a.startMinutes - b.startMinutes);
  const result: TimeRange[] = [];
  for (const range of sorted) mergeInto(result, range);
  return result;
}

function mergeInto(result: TimeRange[], range: TimeRange) {
  const last = result.at(-1);
  if (!last || range.startMinutes > last.endMinutes) {
    result.push({ ...range });
    return;
  }
  last.endMinutes = Math.max(last.endMinutes, range.endMinutes);
}

function overlaps(left: TimeRange, right: TimeRange) {
  return left.endMinutes > right.startMinutes && left.startMinutes < right.endMinutes;
}

function isValidBlock(block: TimeRange) {
  return block.endMinutes - block.startMinutes >= 30;
}

function toRange(rule: AvailabilityRule): TimeRange {
  return { endMinutes: rule.endMinutes, startMinutes: rule.startMinutes };
}
