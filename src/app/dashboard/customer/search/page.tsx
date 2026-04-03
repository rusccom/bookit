import { requireUser } from "@/features/auth/server/requireUser";
import { searchAvailability } from "@/features/booking/server/bookingService";
import { CustomerSearchForm } from "@/features/booking/ui/CustomerSearchForm";
import { SlotTimeline } from "@/features/booking/ui/SlotTimeline";
import s from "@/features/booking/ui/customer.module.css";
import { getCityOptions } from "@/features/catalog/server/catalogService";
import { getTomorrowIso } from "@/features/shared/server/dateTime";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerSearchPage(props: PageProps) {
  await requireUser("customer");
  const sp = await props.searchParams;
  const values = getValues(sp);

  const [cities, availability] = await Promise.all([
    getCityOptions(),
    values.city ? searchAvailability({
      city: values.city,
      date: values.date,
      durationMinutes: Number(values.durationMinutes),
      endTime: values.endTime,
      startTime: values.startTime,
      venueQuery: values.venueQuery
    }) : Promise.resolve([])
  ]);

  return (
    <>
      <StatusBanner error={values.error} success={values.success} />
      <CustomerSearchForm cities={cities} values={values} />

      <section className="panel stack">
        <h2>Доступные корты</h2>
        {availability.length ? (
          <div className={s.searchResults}>
            {availability.map((item) => (
              <div key={item.unitId} className={s.courtCard}>
                <div className={s.courtHeader}>
                  <h3>{item.venueTitle} / {item.unitTitle}</h3>
                  <p>{item.city}, {item.address}</p>
                </div>
                <SlotTimeline
                  date={values.date}
                  durationMinutes={Number(values.durationMinutes)}
                  options={item.options}
                  unitId={item.unitId}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">
            {values.city
              ? "По выбранным фильтрам свободных слотов нет."
              : "Выберите город и дату, чтобы увидеть свободные корты."}
          </p>
        )}
      </section>
    </>
  );
}

function getValues(input: Record<string, string | string[] | undefined>) {
  return {
    city: pick(input.city),
    date: pick(input.date) || getTomorrowIso(),
    durationMinutes: pick(input.durationMinutes) || "60",
    endTime: pick(input.endTime),
    error: pick(input.error),
    startTime: pick(input.startTime),
    success: pick(input.success),
    venueQuery: pick(input.venueQuery)
  };
}

function pick(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
