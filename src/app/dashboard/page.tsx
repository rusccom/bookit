import { redirect } from "next/navigation";

import { requireUser } from "@/features/auth/server/requireUser";

export default async function DashboardPage() {
  const user = await requireUser();
  redirect(user.role === "owner" ? "/dashboard/owner" : "/dashboard/customer");
}
