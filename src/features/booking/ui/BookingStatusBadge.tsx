import s from "./customer.module.css";

const statusMap: Record<string, { cls: string; label: string }> = {
  confirmed: { cls: s.badgeConfirmed, label: "Подтверждено" },
  pending_confirmation: { cls: s.badgePending, label: "Ожидает" },
  cancelled: { cls: s.badgeCancelled, label: "Отменено" },
};

export function BookingStatusBadge({ status }: { status: string }) {
  const info = statusMap[status] || { cls: "", label: status };
  return <span className={`${s.badge} ${info.cls}`}>{info.label}</span>;
}
