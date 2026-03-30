const HALF_HOUR_MINUTES = 30;
const MINUTES_PER_DAY = 24 * 60;

type TimeParts = {
  hours: number;
  minutes: number;
};

export function parseTimeLabel(value: string): number {
  const [hourText, minuteText] = value.split(":");
  const hours = Number(hourText);
  const minutes = Number(minuteText);
  return hours * 60 + minutes;
}

export function formatMinutes(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${padTime(hours)}:${padTime(minutes)}`;
}

export function isHalfHourAligned(value: number): boolean {
  return value % HALF_HOUR_MINUTES === 0;
}

export function buildHalfHourSlots(range: TimeParts): string[] {
  const start = range.hours * 60 + range.minutes;
  const end = MINUTES_PER_DAY;
  return buildTimeRange({ start, end });
}

export function buildTimeRange(range: {
  start: number;
  end: number;
}): string[] {
  const items: string[] = [];

  for (let value = range.start; value <= range.end; value += HALF_HOUR_MINUTES) {
    items.push(formatMinutes(value));
  }

  return items;
}

export function getWeekday(dateIso: string): number {
  return new Date(`${dateIso}T00:00:00`).getDay();
}

export function toIsoDateLabel(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function mergeDateAndTime(input: {
  date: string;
  time: string;
}): Date {
  return new Date(`${input.date}T${input.time}:00`);
}

export function toUtcIso(value: Date): string {
  return value.toISOString();
}

export function getTomorrowIso(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toIsoDateLabel(date);
}

function padTime(value: number): string {
  return value.toString().padStart(2, "0");
}
