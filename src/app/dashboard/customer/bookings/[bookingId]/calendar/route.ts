import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import { getCustomerBookingCalendar } from "@/features/booking/server/bookingCalendarService";

type Context = { params: Promise<{ bookingId: string }> };

export async function GET(_request: Request, context: Context) {
  const user = await getCurrentUser();
  if (!user || user.role !== "customer") return unavailable(user ? 403 : 401);
  const { bookingId } = await context.params;
  const calendar = await getCustomerBookingCalendar({ bookingId, customerUserId: user.id });
  if (!calendar) return unavailable(404);
  return new Response(calendar, { headers: {
    "Content-Type": "text/calendar; charset=utf-8",
    "Content-Disposition": `attachment; filename="booking-${bookingId}.ics"`,
    "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff"
  } });
}

function unavailable(status: number) {
  return new Response("Бронирование недоступно", { status, headers: { "Cache-Control": "private, no-store" } });
}
