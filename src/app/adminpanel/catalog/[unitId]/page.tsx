import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/features/admin/server/requireAdmin";
import { findAdminCourtDetails } from "@/features/admin/server/adminCatalogRepository";
import { AdminCourtEditor } from "@/features/admin/ui/AdminCourtEditor";
import { getAdminParam as pick, type AdminPageProps } from "@/features/admin/ui/adminPageParams";
import { AdminPage } from "@/features/admin/ui/shared/AdminPage";
import { AdminCard } from "@/features/admin/ui/shared/AdminCard";
import { AdminLink } from "@/features/admin/ui/shared/AdminLink";

type Props = AdminPageProps & { params: Promise<{ unitId: string }> };

export default async function AdminCourtPage(props: Props) {
  await requireAdmin();
  const [{ unitId }, params] = await Promise.all([props.params, props.searchParams]);
  if (!z.string().uuid().safeParse(unitId).success) notFound();
  const details = await findAdminCourtDetails(unitId);
  if (!details) notFound();
  const filters = { city: pick(params.city), search: pick(params.q), status: pick(params.status) };
  const back = new URLSearchParams({ city: filters.city, q: filters.search, status: filters.status });
  return <AdminPage eyebrow="Каталог / Редактирование" title={details.unit.unitTitle} description={`Владелец: ${details.ownerName}. Изменения применяются к новым записям, существующие брони сохраняются.`} error={pick(params.error)} success={pick(params.success)}>
    <AdminLink href={`/adminpanel/catalog?${back}`}>← Назад к кортам</AdminLink>
    <AdminCard title="Данные корта и расписание"><AdminCourtEditor unit={details.unit} {...filters} /></AdminCard>
  </AdminPage>;
}
