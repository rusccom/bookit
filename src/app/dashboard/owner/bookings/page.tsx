import { requireUser } from "@/features/auth/server/requireUser";
import {
  getOwnerBookingList,
} from "@/features/booking/server/bookingService";
import { getOwnerUnits } from "@/features/catalog/server/catalogService";
import { OwnerBookingList } from "@/features/booking/ui/OwnerBookingList";
import { OwnerManualBookingForm } from "@/features/booking/ui/OwnerManualBookingForm";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import { getSearchParam, type SearchParams } from "@/features/shared/server/searchParams";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function OwnerBookingsPage(props: PageProps) {
  const owner = await requireUser("owner");
  const sp = await props.searchParams;
  const [units, bookings] = await Promise.all([
    getOwnerUnits(owner.id),
    getOwnerBookingList(owner.id)
  ]);
  return <>
      <StatusBanner error={getSearchParam(sp.error)} success={getSearchParam(sp.success)} />
      <OwnerBookingList items={bookings} />
      <OwnerManualBookingForm units={units} />
    </>;
}
