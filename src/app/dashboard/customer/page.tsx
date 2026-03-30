import { requireUser } from "@/features/auth/server/requireUser";
import { getCityOptions } from "@/features/catalog/server/catalogService";
import {
  getCustomerBookingList,
  searchAvailability
} from "@/features/booking/server/bookingService";
import { AvailabilityList } from "@/features/booking/ui/AvailabilityList";
import { BookingList } from "@/features/booking/ui/BookingList";
import { CustomerSearchForm } from "@/features/booking/ui/CustomerSearchForm";
import { getTomorrowIso } from "@/features/shared/server/dateTime";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerDashboardPage(props: PageProps) {
  const user = await requireUser("customer");
  const searchParams = await props.searchParams;
  const values = getValues(searchParams);
  const [cities, bookings, availability] = await Promise.all([
    getCityOptions(),
    getCustomerBookingList(user.id),
    getAvailability(values)
  ]);

  return (
    <div className="stack-large">
      <section className="panel intro-panel">
        <p className="eyebrow">Customer workspace</p>
        <h1>Кабинет клиента</h1>
        <p className="lead">
          Ищите свободные корты по городу, площадке и времени, затем сразу подтверждайте бронь.
        </p>
      </section>
      <StatusBanner error={values.error} success={values.success} />
      <CustomerSearchForm cities={cities} values={values} />
      <AvailabilityList
        date={values.date}
        durationMinutes={Number(values.durationMinutes)}
        items={availability}
      />
      <BookingList items={bookings} role="customer" />
    </div>
  );
}

async function getAvailability(values: ReturnType<typeof getValues>) {
  if (!values.city) {
    return [];
  }

  return searchAvailability({
    city: values.city,
    date: values.date,
    durationMinutes: Number(values.durationMinutes),
    endTime: values.endTime,
    startTime: values.startTime,
    venueQuery: values.venueQuery
  });
}

function getValues(input: Record<string, string | string[] | undefined>) {
  return {
    city: pickValue(input.city),
    date: pickValue(input.date) || getTomorrowIso(),
    durationMinutes: pickValue(input.durationMinutes) || "60",
    endTime: pickValue(input.endTime),
    error: pickValue(input.error),
    startTime: pickValue(input.startTime),
    success: pickValue(input.success),
    venueQuery: pickValue(input.venueQuery)
  };
}

function pickValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
