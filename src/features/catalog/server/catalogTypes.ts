export type AvailabilityRule = {
  endMinutes: number;
  id: string;
  startMinutes: number;
  weekday: number;
};

export type OwnerUnit = {
  address: string;
  city: string;
  kind: string;
  rules: AvailabilityRule[];
  unitId: string;
  unitTitle: string;
  venueTitle: string;
};

export type SearchUnit = {
  address: string;
  city: string;
  kind: string;
  unitId: string;
  unitTitle: string;
  venueTitle: string;
};
