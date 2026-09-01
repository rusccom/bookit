import type { WeeklyScheduleEntry } from "@/features/catalog/server/catalogTypes";

export function readCourtFormData(formData: FormData) {
  return {
    address: read(formData, "address"),
    city: read(formData, "city"),
    description: read(formData, "description"),
    kind: read(formData, "kind"),
    pricePerHour: Number(read(formData, "pricePerHour")),
    schedule: readSchedule(formData),
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
