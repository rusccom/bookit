import { listAdminBookings } from "@/features/admin/server/adminBookingRepository";
import { listUsers } from "@/features/admin/server/adminRepository";
import { formatBelarusPhone } from "@/features/shared/server/phone";

export async function createUsersCsv() {
  const users = await listUsers("");
  return toCsv([
    ["ID", "Имя", "Email", "Телефон", "Роль", "Статус", "Регистрация", "Личные бронирования", "Корты"],
    ...users.map((user) => [user.id, user.fullName, user.email || "", formatBelarusPhone(user.phone), user.role, user.isBlocked ? "Заблокирован" : "Активен", user.createdAt, user.bookingsCount, user.unitsCount])
  ]);
}

export async function createBookingsCsv() {
  const bookings = await listAdminBookings({ date: "", limit: 10000, search: "", status: "" });
  return toCsv([
    ["ID", "Дата", "Время", "Клиент", "Телефон", "Объект", "Корт", "Владелец", "Статус", "Источник"],
    ...bookings.map((item) => [item.bookingId, item.date, item.time, item.customerName, formatBelarusPhone(item.customerPhone), item.venueTitle, item.unitTitle, item.ownerName, item.status, item.source])
  ]);
}

export function createCsvResponse(csv: string, filename: string) {
  return new Response(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "text/csv; charset=utf-8"
    }
  });
}

function toCsv(rows: (string | number)[][]) {
  return `\uFEFF${rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n")}`;
}

function escapeCsv(value: string | number) {
  let text = String(value).replace(/"/g, '""');
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text}"`;
}
