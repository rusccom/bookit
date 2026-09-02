import type { WeeklyScheduleEntry } from "@/features/catalog/server/catalogTypes";

export function readCourtFormData(formData: FormData) {
  return {
    address: read(formData, "address"),
    city: read(formData, "city"),
    description: read(formData, "description"),
    kind: read(formData, "kind"),
    pricePerHour: readNumber(formData, "pricePerHour"),
    schedule: readSchedule(formData),
    slotMinutes: readNumber(formData, "slotMinutes"),
    surface: read(formData, "surface"),
    title: read(formData, "title"),
    venueTitle: read(formData, "venueTitle")
  };
}

function readSchedule(formData: FormData): WeeklyScheduleEntry[] {
  const schedule: WeeklyScheduleEntry[] = [];
  for (let weekday = 0; weekday < 7; weekday += 1) {
    if (formData.get(`day-${weekday}-enabled`) !== "true") continue;
    schedule.push({
      endTime: read(formData, `day-${weekday}-end`),
      startTime: read(formData, `day-${weekday}-start`),
      weekday
    });
  }
  return schedule;
}

function read(formData: FormData, name: string) {
  return String(formData.get(name) || "");
}

function readNumber(formData: FormData, name: string) {
  const value = read(formData, name).trim();
  return value ? Number(value) : Number.NaN;
}
