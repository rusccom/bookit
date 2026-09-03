import { getTodayIso, isIsoDate } from "@/features/shared/server/dateTime";

export function getOccupancyWeek(value?: string) {
  const valid = Boolean(value && isIsoDate(value) && value >= "2000-01-01" && value <= "2100-12-31");
  const selected = valid ? value! : getTodayIso();
  const weekday = new Date(`${selected}T00:00:00Z`).getUTCDay();
  const start = shiftDate(selected, -((weekday + 6) % 7));
  const days = Array.from({ length: 7 }, (_, index) => shiftDate(start, index));
  return { days, selected, start, end: days[6], error: value && !valid ? "Выберите корректную дату между 2000 и 2100 годами" : "" };
}

function shiftDate(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
