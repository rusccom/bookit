export const SLOT_OPTIONS = [
  { value: 30, label: "30 минут" },
  { value: 60, label: "1 час" },
  { value: 120, label: "2 часа" }
] as const;

export type SlotMinutes = typeof SLOT_OPTIONS[number]["value"];

export function formatSlotMinutes(value: number) {
  return SLOT_OPTIONS.find((option) => option.value === value)?.label || `${value} мин`;
}
