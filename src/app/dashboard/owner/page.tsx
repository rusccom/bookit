import { getOwnerUnits } from "@/features/catalog/server/catalogService";
import { OwnerUnitForm } from "@/features/catalog/ui/OwnerUnitForm";
import { OwnerUnitList } from "@/features/catalog/ui/OwnerUnitList";
import { requireUser } from "@/features/auth/server/requireUser";
import { getOwnerBookingList } from "@/features/booking/server/bookingService";
import { OwnerManualBookingForm } from "@/features/booking/ui/OwnerManualBookingForm";
import { BookingList } from "@/features/booking/ui/BookingList";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OwnerDashboardPage(props: PageProps) {
  const owner = await requireUser("owner");
  const searchParams = await props.searchParams;
  const [units, bookings] = await Promise.all([
    getOwnerUnits(owner.id),
    getOwnerBookingList(owner.id)
  ]);
  const error = pickValue(searchParams.error);
  const success = pickValue(searchParams.success);

  return (
    <div className="stack-large">
      <section className="panel intro-panel">
        <p className="eyebrow">Owner workspace</p>
        <h1>Кабинет арендодателя</h1>
        <p className="lead">
          Здесь вы добавляете объекты, задаете график работы и вручную блокируете уже занятые слоты.
        </p>
      </section>
      <StatusBanner error={error} success={success} />
      <div className="dashboard-grid">
        <OwnerUnitForm />
        <OwnerManualBookingForm units={units} />
      </div>
      <OwnerUnitList units={units} />
      <BookingList items={bookings} role="owner" />
    </div>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
