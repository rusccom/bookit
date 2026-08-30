import { createAdminAudit } from "@/features/admin/server/adminAuditRepository";
import {
  createCsvResponse,
  createUsersCsv
} from "@/features/admin/server/adminExportService";
import { getCurrentAdmin } from "@/features/admin/server/requireAdmin";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return new Response("Unauthorized", { status: 401 });
  const csv = await createUsersCsv();
  await createAdminAudit({ action: "export", admin, entityId: "users", entityType: "user" });
  return createCsvResponse(csv, "bookit-users.csv");
}
