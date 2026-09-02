import { getAdminBookingStatus } from "./adminPresentation";
import { AdminBadge } from "./shared/AdminBadge";

export function AdminBookingBadge({ status }: { status: string }) {
  const { label, tone } = getAdminBookingStatus(status);
  return <AdminBadge tone={tone}>{label}</AdminBadge>;
}
