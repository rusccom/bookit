import type { BookingRecord } from "@/features/booking/server/bookingTypes";
import { formatBelarusPhone } from "@/features/shared/phone";

export type OwnerBookingTab = "upcoming" | "past" | "cancelled";

export function formatBookingSource(source: string) {
  if (source === "owner_manual") return "Вручную";
  if (source === "telegram_llm") return "Telegram";
  return "Онлайн";
}

export function formatBookingCustomer(item: BookingRecord) {
  if (!item.customerName) return "Закрыто владельцем без клиента";
  const phone = formatBelarusPhone(item.customerPhone);
  return phone ? `${item.customerName} · ${phone}` : item.customerName;
}
