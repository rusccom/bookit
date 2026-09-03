import { notFound } from "next/navigation";

import { getAdminUserDetails } from "@/features/admin/server/adminService";
import { AdminUserDetailsView } from "@/features/admin/ui/AdminUserDetailsView";
import { requireAdmin } from "@/features/admin/server/requireAdmin";
import { getAdminParam, type AdminPageProps } from "@/features/admin/ui/adminPageParams";

type AdminUserDetailsPageProps = AdminPageProps & {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserDetailsPage(props: AdminUserDetailsPageProps) {
  await requireAdmin();
  const { userId } = await props.params;
  const params = await props.searchParams;
  const details = await getAdminUserDetails(userId);
  if (!details) notFound();
  return <AdminUserDetailsView details={details} error={getAdminParam(params.error)} success={getAdminParam(params.success)} />;
}
