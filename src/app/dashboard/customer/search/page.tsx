import { requireUser } from "@/features/auth/server/requireUser";
import { searchAvailabilityForView } from "@/features/booking/server/bookingService";
import { CourtAvailabilityCard } from "@/features/booking/ui/CourtAvailabilityCard";
import { CustomerSearchForm } from "@/features/booking/ui/CustomerSearchForm";
import { EmptyAvailabilityResults } from "@/features/booking/ui/EmptyAvailabilityResults";
import styles from "@/features/booking/ui/availability.module.css";
import { getCityOptions } from "@/features/catalog/server/catalogService";
import { getTodayIso } from "@/features/shared/server/dateTime";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomerSearchPage(props: PageProps) {
  await requireUser("customer");
  const sp = await props.searchParams;
  const values = getValues(sp);

  const [cities, result] = await Promise.all([
    getCityOptions(),
    values.city ? searchAvailabilityForView({
      city: values.city,
      date: values.date,
      durationMinutes: Number(values.durationMinutes),
      endTime: values.endTime,
      startTime: values.startTime,
      venueQuery: values.venueQuery
    }) : Promise.resolve({ error: "", items: [] })
  ]);
  const returnTo = buildReturnTo(values);

  return (
    <>
      <StatusBanner error={values.error || result.error} success={values.success} />
      <CustomerSearchForm cities={cities} values={values} />
      <header className={styles.resultsHeader}><div><p className="eyebrow">Онлайн-запись</p><h1>Свободные корты</h1><p>{values.city ? `${values.city} · ${values.date}` : "Выберите город и дату"}</p></div>{values.city && <span className={styles.resultsCount}>{result.items.length} найдено</span>}</header>
      {result.items.length ? <div className={styles.results}>{result.items.map((item) => <CourtAvailabilityCard date={values.date} durationMinutes={Number(values.durationMinutes)} item={item} key={item.unitId} returnTo={returnTo} />)}</div> : <EmptyAvailabilityResults searched={Boolean(values.city)} />}
    </>
  );
}

function getValues(input: Record<string, string | string[] | undefined>) {
  return {
    city: pick(input.city),
    date: pick(input.date) || getTodayIso(),
    durationMinutes: pick(input.durationMinutes) || "60",
    endTime: pick(input.endTime),
    error: pick(input.error),
    startTime: pick(input.startTime),
    success: pick(input.success),
    venueQuery: pick(input.venueQuery)
  };
}

function buildReturnTo(values: ReturnType<typeof getValues>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value && key !== "error" && key !== "success") params.set(key, value);
  }
  return `/dashboard/customer/search?${params.toString()}`;
}

function pick(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
