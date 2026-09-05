import { requireUser } from "@/features/auth/server/requireUser";
import { searchAvailabilityForView } from "@/features/booking/server/bookingService";
import { CustomerAvailabilityResults } from "@/features/booking/ui/CustomerAvailabilityResults";
import { CustomerSearchForm } from "@/features/booking/ui/CustomerSearchForm";
import { getCityOptions } from "@/features/catalog/server/catalogService";
import { getTodayIso } from "@/features/shared/server/dateTime";
import { StatusBanner } from "@/features/shared/ui/StatusBanner";
import { getSearchParam, type SearchParams } from "@/features/shared/server/searchParams";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function CustomerSearchPage(props: PageProps) {
  await requireUser("customer");
  const sp = await props.searchParams;
  const values = getValues(sp);

  const [cities, result] = await Promise.all([
    getCityOptions(),
    values.city ? searchAvailabilityForView(toSearchInput(values)) : Promise.resolve({ error: "", items: [] })
  ]);
  return <>
      <StatusBanner error={values.error || result.error} success={values.success} />
      <CustomerSearchForm cities={cities} values={values} />
      <CustomerAvailabilityResults date={values.date} durationMinutes={Number(values.durationMinutes)} items={result.items} returnTo={buildReturnTo(values)} searchedCity={values.city} />
    </>;
}
function toSearchInput(values: ReturnType<typeof getValues>) {
  return {
    city: values.city, date: values.date, durationMinutes: Number(values.durationMinutes),
    endTime: values.endTime || undefined, startTime: values.startTime || undefined,
    venueQuery: values.venueQuery || undefined
  };
}

function getValues(input: SearchParams) {
  return {
    city: getSearchParam(input.city),
    date: getSearchParam(input.date) || getTodayIso(),
    durationMinutes: getSearchParam(input.durationMinutes) || "60",
    endTime: getSearchParam(input.endTime),
    error: getSearchParam(input.error),
    startTime: getSearchParam(input.startTime),
    success: getSearchParam(input.success),
    venueQuery: getSearchParam(input.venueQuery)
  };
}

function buildReturnTo(values: ReturnType<typeof getValues>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value && key !== "error" && key !== "success") params.set(key, value);
  }
  return `/dashboard/customer/search?${params.toString()}`;
}
