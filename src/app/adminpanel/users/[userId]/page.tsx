import { notFound } from "next/navigation";

import { getAdminUserDetails } from "@/features/admin/server/adminService";
import { AdminUserDetailsView } from "@/features/admin/ui/AdminUserDetailsView";
import { requireAdmin } from "@/features/admin/server/requireAdmin";
import type { AdminPageProps } from "@/features/admin/ui/adminPageParams";
import { getSearchParam } from "@/features/shared/server/searchParams";

type AdminUserDetailsPageProps = AdminPageProps & {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserDetailsPage(props: AdminUserDetailsPageProps) {
  await requireAdmin();
  const { userId } = await props.params;
  const params = await props.searchParams;
  const details = await getAdminUserDetails(userId);
  if (!details) notFound();
  return <AdminUserDetailsView details={details} error={getSearchParam(params.error)} success={getSearchParam(params.success)} />;
}
