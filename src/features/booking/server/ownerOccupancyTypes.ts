export type OccupancyDay = { date: string; occupied: number; total: number };

export type OwnerOccupancyItem = {
  unitId: string;
  unitTitle: string;
  venueTitle: string;
  slotMinutes: number;
  days: OccupancyDay[];
};

export type OccupancyTotals = { occupied: number; total: number; free: number; percent: number };
