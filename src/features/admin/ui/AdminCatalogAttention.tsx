import { AdminCard } from "./shared/AdminCard";
import { AdminLink } from "./shared/AdminLink";
import { AdminStats } from "./shared/AdminStats";

type Props = { counts: { noSchedule: number; noPrice: number } };

export function AdminCatalogAttention({ counts }: Props) {
  return <AdminCard title="Требуют внимания" description="Проверка включённых кортов. Отсутствие цены допустимо для записи по договорённости; отсутствие рабочего расписания не даст клиентам записаться.">
    <AdminStats items={[
      { label: "Без доступного расписания", value: <AdminLink href="/adminpanel/catalog?status=no_schedule">{counts.noSchedule} — проверить</AdminLink> },
      { label: "Цена по запросу", value: <AdminLink href="/adminpanel/catalog?status=no_price">{counts.noPrice} — проверить</AdminLink> }
    ]} />
  </AdminCard>;
}
