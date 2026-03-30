import {
  listCustomerBookings,
  listOwnerBookings
} from "@/features/booking/server/bookingQueryRepository";

export async function getOwnerBookingList(ownerUserId: string) {
  return listOwnerBookings(ownerUserId);
}

export async function getCustomerBookingList(customerUserId: string) {
  return listCustomerBookings(customerUserId);
}
