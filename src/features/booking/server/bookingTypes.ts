export type BookingRecord = {
  address: string;
  bookingId: string;
  city: string;
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
  kind: string;
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
  kind: string;
  options: AvailabilityOption[];
  unitId: string;
  unitTitle: string;
  venueTitle: string;
};
