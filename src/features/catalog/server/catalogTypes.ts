export type AvailabilityRule = {
  endMinutes: number;
  id: string;
  startMinutes: number;
  weekday: number;
};

export type WeeklyScheduleEntry = {
  endTime: string;
  startTime: string;
  weekday: number;
};

export type OwnerUnit = {
  address: string;
  city: string;
  description: string;
  isActive: boolean;
  isVenueActive: boolean;
  kind: string;
  pricePerHour: number;
  rules: AvailabilityRule[];
  surface: string;
  unitId: string;
  unitTitle: string;
  venueTitle: string;
};

export type SearchUnit = {
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
