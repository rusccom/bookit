import type { UserRole } from "@/features/auth/server/authTypes";
import type { SlotMinutes } from "@/features/catalog/slotOptions";
import type { AdminUserNote } from "@/features/admin/server/adminUserNotesTypes";

export type AdminAccount = {
  id: string;
  login: string;
};

export type AdminUserRecord = {
  bookingsCount: number;
  createdAt: string;
  email: string | null;
  fullName: string;
  id: string;
  isBlocked: boolean;
  phone: string | null;
  role: UserRole;
  unitsCount: number;
};

export type AdminUserBooking = {
  bookingId: string;
  date: string;
  status: string;
  time: string;
  unitTitle: string;
  venueTitle: string;
};

export type AdminUserCatalogItem = {
  city: string;
  isActive: boolean;
  unitId: string;
  unitTitle: string;
  venueTitle: string;
};

export type AdminUserDetails = {
  bookings: AdminUserBooking[];
  catalog: AdminUserCatalogItem[];
  notes: AdminUserNote[];
  user: AdminUserRecord;
};

export type AdminOverviewStats = {
  bookingsToday: number;
  cancelledBookings: number;
  owners: number;
  upcomingBookings: number;
  units: number;
  users: number;
  venues: number;
};

export type AdminBookingRecord = {
  bookingId: string;
  customerName: string;
  customerPhone: string | null;
  date: string;
  ownerName: string;
  source: string;
  status: string;
  time: string;
  unitTitle: string;
  venueTitle: string;
};

export type AdminCatalogRecord = {
  address: string;
  city: string;
  isUnitActive: boolean;
  isVenueActive: boolean;
  ownerName: string;
  ownerId: string;
  pricePerHour: number;
  scheduledDays: number;
  slotMinutes: SlotMinutes;
  unitId: string;
  unitTitle: string;
  venueId: string;
  venueTitle: string;
};

export type AdminAuditRecord = {
  action: string;
  adminLogin: string;
  createdAt: string;
  details: Record<string, string | number | boolean | null>;
  entityId: string;
  entityType: string;
  id: string;
};

export type ManagedAdmin = AdminAccount & {
  createdAt: string;
  isLocked: boolean;
  twoFactorEnabled: boolean;
};

export type AdminSessionRecord = {
  createdAt: string;
  expiresAt: string;
  id: string;
  isCurrent: boolean;
  lastSeenAt: string;
  userAgent: string;
};

export type AdminSecurityData = {
  admins: ManagedAdmin[];
  currentAdminId: string;
  sessions: AdminSessionRecord[];
  twoFactorEnabled: boolean;
  twoFactorSetup: { secret: string; uri: string } | null;
};
