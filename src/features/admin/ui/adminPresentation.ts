import type { AdminBadgeTone } from "./shared/AdminBadge";

export const adminBookingStatuses: Record<string, { label: string; tone: AdminBadgeTone }> = {
  pending_confirmation: { label: "Ожидает подтверждения", tone: "warning" },
  confirmed: { label: "Подтверждено", tone: "success" },
  cancelled: { label: "Отменено", tone: "danger" }
};

export function getAdminBookingStatus(status: string) {
  return adminBookingStatuses[status] || { label: status, tone: "neutral" as const };
}

export function formatAdminDate(value: string, withTime = false) {
  const options: Intl.DateTimeFormatOptions = withTime
    ? { dateStyle: "short", timeStyle: "short" } : { dateStyle: "medium" };
  return new Intl.DateTimeFormat("ru-BY", options).format(new Date(value));
}

export function getAdminRoleLabel(role: string) {
  return role === "owner" ? "Владелец" : "Клиент";
}
