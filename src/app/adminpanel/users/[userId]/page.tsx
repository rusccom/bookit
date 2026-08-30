import { notFound } from "next/navigation";

import { getAdminUserDetails } from "@/features/admin/server/adminService";
import { AdminUserDetailsView } from "@/features/admin/ui/AdminUserDetailsView";

type AdminUserDetailsPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserDetailsPage(props: AdminUserDetailsPageProps) {
  const { userId } = await props.params;
  const details = await getAdminUserDetails(userId);
  if (!details) notFound();
  return <AdminUserDetailsView details={details} />;
}
