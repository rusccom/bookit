import { getAdminBookings } from "@/features/admin/server/adminBookingService";
import { getAdminParam as pick, type AdminPageProps } from "@/features/admin/ui/adminPageParams";
import { adminBookingStatuses } from "@/features/admin/ui/adminPresentation";
import { AdminBookingsTable } from "@/features/admin/ui/AdminBookingsTable";
import { AdminField } from "@/features/admin/ui/shared/AdminField";
import { AdminFilters } from "@/features/admin/ui/shared/AdminFilters";
import { AdminLink } from "@/features/admin/ui/shared/AdminLink";
import { AdminPage } from "@/features/admin/ui/shared/AdminPage";

export default async function AdminBookingsPage(props: AdminPageProps) {
  const params = await props.searchParams;
  const filters = { date: pick(params.date), search: pick(params.q), status: pick(params.status) };
  const bookings = await getAdminBookings(filters);
  return <AdminPage eyebrow="Операции" title="Бронирования" description={"Найдено: " + bookings.length} error={pick(params.error)} success={pick(params.success)}>
    <AdminFilters search={filters.search} placeholder="Клиент, владелец, объект">
      <AdminField label="Дата"><input defaultValue={filters.date} name="date" type="date" /></AdminField>
      <AdminField label="Статус"><select defaultValue={filters.status} name="status">
        <option value="">Все статусы</option>
        {Object.entries(adminBookingStatuses).map(([value, { label }]) => <option key={value} value={value}>{label}</option>)}
      </select></AdminField>
    </AdminFilters>
    <AdminLink download href="/adminpanel/export/bookings">Выгрузить бронирования в CSV</AdminLink>
    <AdminBookingsTable bookings={bookings} {...filters} />
  </AdminPage>;
}
