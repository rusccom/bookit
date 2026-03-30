import type { Row, Sql } from "postgres";

export type DbExecutor = Pick<Sql<Record<string, never>>, "unsafe">;

export type RuleRow = Row & {
  end_minutes: number;
  id: string;
  start_minutes: number;
  unit_id: string;
  weekday: number;
};

export type BookingRow = Row & {
  address: string;
  booking_date: string;
  city: string;
  end_minutes: number;
  id: string;
  note: string;
  source: string;
  start_minutes: number;
  status: string;
  unit_id: string;
  unit_title: string;
  venue_title: string;
};

export type UnitRow = Row & {
  address: string;
  city: string;
  kind: string;
  unit_id: string;
  unit_title: string;
  venue_title: string;
};

export type CreateBookingInput = {
  bookingDate: string;
  createdByUserId?: string;
  customerUserId?: string;
  endMinutes: number;
  expiresAt?: string;
  note?: string;
  source: string;
  sql?: DbExecutor;
  startMinutes: number;
  status: string;
  telegramChatId?: number;
  unitId: string;
};
