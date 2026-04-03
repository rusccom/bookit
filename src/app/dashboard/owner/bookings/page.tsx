import { requireUser } from "@/features/auth/server/requireUser";
import {
  getOwnerBookingList,
} from "@/features/booking/server/bookingService";
import { getOwnerUnits } from "@/features/catalog/server/catalogService";
import { OwnerBookingList } from "@/features/booking/ui/OwnerBookingList";
import { OwnerManualBookingForm } from "@/features/booking/ui/OwnerManualBookingForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OwnerBookingsPage(props: PageProps) {
  const owner = await requireUser("owner");
  const sp = await props.searchParams;
  const error = pickValue(sp.error);
  const success = pickValue(sp.success);

  const [units, bookings] = await Promise.all([
    getOwnerUnits(owner.id),
    getOwnerBookingList(owner.id),
  ]);

  return (
    <>
      <StatusBanner error={error} success={success} />

      <section className="panel">
        <p className="eyebrow">Бронирования</p>
        <h2>Все бронирования</h2>
      </section>

      <OwnerBookingList items={bookings} />

      <OwnerManualBookingForm units={units} />
    </>
  );
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
