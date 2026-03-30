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
  const options: { endTime: string; startTime: string }[] = [];

  for (const block of input.blocks) {
    const maxStart = block.endMinutes - input.durationMinutes;

    for (let start = block.startMinutes; start <= maxStart; start += 30) {
      const end = start + input.durationMinutes;

      if (input.startFilter && end <= input.startFilter) {
        continue;
      }

      if (input.endFilter && start >= input.endFilter) {
        continue;
      }

      options.push({
        endTime: formatMinutes(end),
        startTime: formatMinutes(start)
      });
    }
  }

  return options;
}

export function buildOpenBlocks(input: {
  bookings: TimeRange[];
  rules: AvailabilityRule[];
}) {
  const blocks: TimeRange[] = [];

  for (const rule of input.rules) {
    let cursor = rule.startMinutes;
    const related = input.bookings.filter(inRule(rule));

    for (const booking of related) {
      if (booking.startMinutes > cursor) {
        blocks.push({ endMinutes: booking.startMinutes, startMinutes: cursor });
      }

      cursor = Math.max(cursor, booking.endMinutes);
    }

    if (cursor < rule.endMinutes) {
      blocks.push({ endMinutes: rule.endMinutes, startMinutes: cursor });
    }
  }

  return blocks.filter(isValidBlock);
}

export function isBookingWindowValid(input: {
  durationMinutes: number;
  endMinutes: number;
  startMinutes: number;
}) {
  const size = input.endMinutes - input.startMinutes;
  return size === input.durationMinutes && isRangeValid(input);
}

export function isRangeValid(range: TimeRange) {
  return (
    range.startMinutes < range.endMinutes &&
    isHalfHourAligned(range.startMinutes) &&
    isHalfHourAligned(range.endMinutes)
  );
}

function inRule(rule: AvailabilityRule) {
  return (booking: TimeRange) =>
    booking.endMinutes > rule.startMinutes &&
    booking.startMinutes < rule.endMinutes;
}

function isValidBlock(block: TimeRange) {
  return block.endMinutes - block.startMinutes >= 30;
}
