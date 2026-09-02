import { updateAdminBookingStatusAction } from "@/features/admin/server/adminBookingActions";
import { AdminActionForm } from "./shared/AdminActionForm";

type AdminBookingStatusFormProps = {
  bookingId: string;
  filterDate: string;
  filterStatus: string;
  nextStatus: string;
  search: string;
};

export function AdminBookingStatusForm({ nextStatus, ...filters }: AdminBookingStatusFormProps) {
  const cancelled = nextStatus === "cancelled";
  return <AdminActionForm action={updateAdminBookingStatusAction} values={{ ...filters, status: nextStatus }}
    variant={cancelled ? "danger" : "secondary"} confirmation={cancelled ? "Отменить это бронирование?" : undefined}>
    {cancelled ? "Отменить" : "Подтвердить"}
  </AdminActionForm>;
}
