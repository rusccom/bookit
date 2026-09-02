import { deleteUserAction } from "@/features/admin/server/adminActions";
import { AdminActionForm } from "./shared/AdminActionForm";

type DeleteUserButtonProps = { bookingsCount: number; search: string; unitsCount: number; userId: string };

export function DeleteUserButton({ bookingsCount, search, unitsCount, userId }: DeleteUserButtonProps) {
  const impact = unitsCount + " кортов и " + bookingsCount + " связанных бронирований";
  return <AdminActionForm action={deleteUserAction} values={{ userId, search }} variant="danger"
    confirmation={"Удалить пользователя безвозвратно? Будут затронуты: " + impact + "."}>
    Удалить
  </AdminActionForm>;
}
