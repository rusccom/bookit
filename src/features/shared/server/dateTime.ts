const HALF_HOUR_MINUTES = 30;
type MinskDateTime = {
  date: string;
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

export function getWeekday(dateIso: string): number {
  return new Date(`${dateIso}T00:00:00`).getDay();
}

export function formatMinuteRange(start: number, end: number) {
  return `${formatMinutes(start)}–${formatMinutes(end)}`;
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function toIsoDateLabel(value: Date | string): string {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value.slice(0, 10);
}

export function getTodayIso(): string {
  return getMinskDateTime(new Date()).date;
}

export function getMinimumBookingMinutes(date: string): number | undefined {
  const now = getMinskDateTime(new Date());
  if (date !== now.date) return undefined;
  return Math.ceil((now.minutes + 1) / HALF_HOUR_MINUTES) * HALF_HOUR_MINUTES;
}

export function isFutureBookingStart(date: string, startMinutes: number): boolean {
  const now = getMinskDateTime(new Date());
  if (date > now.date) return true;
  return date === now.date && startMinutes > now.minutes;
}

function padTime(value: number): string {
  return value.toString().padStart(2, "0");
}

function getMinskDateTime(date: Date): MinskDateTime {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", hour: "2-digit", hourCycle: "h23", minute: "2-digit",
    month: "2-digit", timeZone: "Europe/Minsk", year: "numeric"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute)
  };
}
