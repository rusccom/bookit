import type { SearchUnit } from "@/features/catalog/server/catalogTypes";

export type BookingRecord = {
  address: string;
  bookingId: string;
  city: string;
  customerName: string | null;
  customerPhone: string | null;
  dateLabel: string;
  endTime: string;
  note: string;
  source: string;
  startTime: string;
  status: string;
  unitId: string;
  unitTitle: string;
  venueTitle: string;
};

export type UnitOption = SearchUnit;

export type AvailabilityOption = {
  endTime: string;
  startTime: string;
};

export type AvailabilityResult = UnitOption & {
  options: AvailabilityOption[];
};
