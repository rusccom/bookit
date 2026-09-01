import {
  getOwnerStats as queryOwnerStats,
  listCustomerBookings,
  listOwnerBookings,
  listOwnerTodayBookings,
  listUpcomingCustomerBooking
} from "@/features/booking/server/bookingQueryRepository";
import { getMinimumBookingMinutes, getTodayIso } from "@/features/shared/server/dateTime";

export async function getOwnerBookingList(ownerUserId: string) {
  return listOwnerBookings(ownerUserId);
}

export async function getOwnerTodayBookings(ownerUserId: string, date: string) {
  return listOwnerTodayBookings(ownerUserId, date);
}

export async function getOwnerDashboardStats(ownerUserId: string, today: string) {
  return queryOwnerStats(ownerUserId, today);
}

export async function getCustomerBookingList(customerUserId: string) {
  return listCustomerBookings(customerUserId);
}

export async function getUpcomingCustomerBooking(customerUserId: string) {
  const today = getTodayIso();
  return listUpcomingCustomerBooking({
    customerUserId,
    minimumStart: getMinimumBookingMinutes(today) || 0,
    today
  });
}
