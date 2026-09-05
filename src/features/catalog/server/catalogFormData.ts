import type { WeeklyScheduleEntry } from "@/features/catalog/server/catalogTypes";
import { readFormFlag, readFormNumber, readFormText } from "@/features/shared/server/formData";

export function readCourtFormData(formData: FormData) {
  return {
    address: readFormText(formData, "address"),
    city: readFormText(formData, "city"),
    description: readFormText(formData, "description"),
    kind: readFormText(formData, "kind"),
    pricePerHour: readFormNumber(formData, "pricePerHour"),
    schedule: readSchedule(formData),
    slotMinutes: readFormNumber(formData, "slotMinutes"),
    surface: readFormText(formData, "surface"),
    title: readFormText(formData, "title"),
    venueTitle: readFormText(formData, "venueTitle")
  };
}

function readSchedule(formData: FormData): WeeklyScheduleEntry[] {
  const schedule: WeeklyScheduleEntry[] = [];
  for (let weekday = 0; weekday < 7; weekday += 1) {
    if (!readFormFlag(formData, `day-${weekday}-enabled`)) continue;
    schedule.push({
      endTime: readFormText(formData, `day-${weekday}-end`),
      startTime: readFormText(formData, `day-${weekday}-start`),
      weekday
    });
  }
  return schedule;
}
