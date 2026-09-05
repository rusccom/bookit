import type { AvailabilityRule } from "@/features/catalog/server/catalogTypes";
import type { SlotMinutes } from "@/features/catalog/slotOptions";
import { formatMinutes } from "@/features/shared/server/dateTime";

type TimeRange = {
  endMinutes: number;
  startMinutes: number;
};

type OpenBlock = TimeRange & { anchorMinutes: number };
type SlotFilters = { durationMinutes: number; endFilter?: number; slotMinutes: SlotMinutes; startFilter?: number };

export function buildAvailabilityOptions(input: SlotFilters & { blocks: OpenBlock[] }) {
  if (input.durationMinutes <= 0 || input.durationMinutes % input.slotMinutes !== 0) return [];
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
  return rules.flatMap((rule) => subtractBookings(rule, bookings).map((block) => ({ ...block, anchorMinutes: rule.startMinutes })));
}

function appendOptions(
  options: Map<string, { endTime: string; startTime: string }>,
  block: OpenBlock,
  input: SlotFilters
) {
  const maxStart = block.endMinutes - input.durationMinutes;
  const firstStart = block.anchorMinutes + Math.ceil((block.startMinutes - block.anchorMinutes) / input.slotMinutes) * input.slotMinutes;
  for (let start = firstStart; start <= maxStart; start += input.slotMinutes) {
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
