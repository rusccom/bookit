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

export type UnitOption = {
  address: string;
  city: string;
  description: string;
  kind: string;
  pricePerHour: number;
  surface: string;
  unitId: string;
  unitTitle: string;
  venueTitle: string;
};

export type AvailabilityOption = {
  endTime: string;
  startTime: string;
};

export type AvailabilityResult = {
  address: string;
  city: string;
  description: string;
  kind: string;
  options: AvailabilityOption[];
  pricePerHour: number;
  surface: string;
  unitId: string;
  unitTitle: string;
  venueTitle: string;
};
