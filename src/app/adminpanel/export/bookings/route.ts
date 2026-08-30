import { createAdminAudit } from "@/features/admin/server/adminAuditRepository";
import {
  createBookingsCsv,
  createCsvResponse
} from "@/features/admin/server/adminExportService";
import { getCurrentAdmin } from "@/features/admin/server/requireAdmin";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return new Response("Unauthorized", { status: 401 });
  const csv = await createBookingsCsv();
  await createAdminAudit({ action: "export", admin, entityId: "bookings", entityType: "booking" });
  return createCsvResponse(csv, "bookit-bookings.csv");
}
