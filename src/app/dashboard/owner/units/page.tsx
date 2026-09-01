import { requireUser } from "@/features/auth/server/requireUser";
import { getOwnerUnits } from "@/features/catalog/server/catalogService";
import { OwnerCourtGrid } from "@/features/catalog/ui/OwnerCourtGrid";
import { OwnerUnitForm } from "@/features/catalog/ui/OwnerUnitForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import styles from "@/features/catalog/ui/courtManagement.module.css";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OwnerUnitsPage(props: PageProps) {
  const owner = await requireUser("owner");
  const sp = await props.searchParams;
  const error = pickValue(sp.error);
  const success = pickValue(sp.success);

  const units = await getOwnerUnits(owner.id);

  return (
    <>
      <StatusBanner error={error} success={success} />
      <header className={styles.pageIntro}>
        <div><p className="eyebrow">Управление доступностью</p><h1>Корты и расписание</h1><p>Настройте данные корта и часы работы — свободные слоты появятся у клиентов автоматически.</p></div>
        <span className={styles.countBadge}>{units.length} {pluralizeCourts(units.length)}</span>
      </header>
      <OwnerCourtGrid units={units} />
      <OwnerUnitForm openByDefault={!units.length} />
    </>
  );
}

function pluralizeCourts(value: number) {
  if (value % 10 === 1 && value % 100 !== 11) return "корт";
  if ([2, 3, 4].includes(value % 10) && ![12, 13, 14].includes(value % 100)) return "корта";
  return "кортов";
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
