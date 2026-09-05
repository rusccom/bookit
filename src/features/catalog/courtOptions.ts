export const COURT_KIND_OPTIONS = [
  { label: "Теннис", value: "tennis_court" },
  { label: "Падел", value: "padel_court" },
  { label: "Сквош", value: "squash_court" },
  { label: "Бадминтон", value: "badminton_court" }
] as const;

export const COURT_SURFACE_OPTIONS = [
  { label: "Хард", value: "hard" },
  { label: "Грунт", value: "clay" },
  { label: "Трава", value: "grass" },
  { label: "Искусственная трава", value: "artificial_grass" },
  { label: "Паркет", value: "parquet" },
  { label: "Резина", value: "rubber" },
  { label: "Другое", value: "other" }
] as const;

export function formatCourtKind(value: string) {
  return formatCourtOption(COURT_KIND_OPTIONS, value);
}

export function formatCourtSurface(value: string) {
  return formatCourtOption(COURT_SURFACE_OPTIONS, value);
}

export function formatHourlyPrice(value: number, fallback: string) {
  return value > 0 ? `${value.toFixed(2)} BYN/ч` : fallback;
}

function formatCourtOption(options: ReadonlyArray<{ label: string; value: string }>, value: string) {
  return options.find((item) => item.value === value)?.label || value;
}
