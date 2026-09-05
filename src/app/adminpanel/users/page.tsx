import { getAdminUsers } from "@/features/admin/server/adminService";
import type { AdminPageProps } from "@/features/admin/ui/adminPageParams";
import { AdminUsersTable } from "@/features/admin/ui/AdminUsersTable";
import { AdminFilters } from "@/features/admin/ui/shared/AdminFilters";
import { AdminLink } from "@/features/admin/ui/shared/AdminLink";
import { AdminPage } from "@/features/admin/ui/shared/AdminPage";
import { getSearchParam as pick } from "@/features/shared/server/searchParams";

export default async function AdminUsersPage(props: AdminPageProps) {
  const params = await props.searchParams;
  const search = pick(params.q);
  const users = await getAdminUsers(search);
  return <AdminPage eyebrow="Управление платформой" title="Пользователи" description={"Найдено: " + users.length} error={pick(params.error)} success={pick(params.success)}>
    <AdminFilters search={search} placeholder="Имя, email или телефон" />
    <AdminLink download href="/adminpanel/export/users">Выгрузить пользователей в CSV</AdminLink>
    <AdminUsersTable search={search} users={users} />
  </AdminPage>;
}
