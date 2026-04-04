import { requireUser } from "@/features/auth/server/requireUser";
import { getOwnerUnits } from "@/features/catalog/server/catalogService";
import { OwnerUnitForm } from "@/features/catalog/ui/OwnerUnitForm";
import { OwnerUnitCards } from "@/features/booking/ui/OwnerUnitCards";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

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

      <OwnerUnitCards units={units} />

      <OwnerUnitForm />
    </>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
