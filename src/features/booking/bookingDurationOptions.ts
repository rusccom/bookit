export const BOOKING_DURATION_OPTIONS = [
  { label: "30 минут", value: 30 },
  { label: "1 час", value: 60 },
  { label: "1.5 часа", value: 90 },
  { label: "2 часа", value: 120 }
] as const;

export type BookingDurationMinutes = typeof BOOKING_DURATION_OPTIONS[number]["value"];

export function isBookingDurationMinutes(value: number): value is BookingDurationMinutes {
  return BOOKING_DURATION_OPTIONS.some((option) => option.value === value);
}
