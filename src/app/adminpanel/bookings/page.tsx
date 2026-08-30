import { getAdminBookings } from "@/features/admin/server/adminBookingService";
import { AdminBookingsTable } from "@/features/admin/ui/AdminBookingsTable";
import styles from "@/features/admin/ui/adminDataTable.module.css";
import workspace from "@/features/admin/ui/adminWorkspace.module.css";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type AdminBookingsPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminBookingsPage(props: AdminBookingsPageProps) {
  const params = await props.searchParams;
  const filters = { date: pick(params.date), search: pick(params.q), status: pick(params.status) };
  const bookings = await getAdminBookings(filters);
  return <section className={workspace.page}>
    <StatusBanner error={pick(params.error)} success={pick(params.success)} />
    <header className={workspace.pageHeader}><p>Операции</p><h1>Бронирования</h1><span>Найдено: {bookings.length}</span></header>
    <form className={styles.filters} method="get"><input defaultValue={filters.search} name="q" placeholder="Клиент, владелец, объект" type="search" /><input defaultValue={filters.date} name="date" type="date" /><select defaultValue={filters.status} name="status"><option value="">Все статусы</option><option value="pending_confirmation">Ожидает</option><option value="confirmed">Подтверждено</option><option value="cancelled">Отменено</option></select><button type="submit">Применить</button></form>
    <a className={styles.exportLink} href="/adminpanel/export/bookings">Выгрузить бронирования в CSV</a>
    <AdminBookingsTable bookings={bookings} date={filters.date} search={filters.search} status={filters.status} />
  </section>;
}

function pick(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) || "";
}
