import { deleteUserAction } from "@/features/admin/server/adminActions";
import { AdminActionForm } from "./shared/AdminActionForm";

type DeleteUserButtonProps = { bookingsCount: number; role: "owner" | "customer"; search: string; unitsCount: number; userId: string };

export function DeleteUserButton({ bookingsCount, role, search, unitsCount, userId }: DeleteUserButtonProps) {
  const impact = role === "owner"
    ? `Будут удалены корты (${unitsCount}) и все их бронирования.`
    : `Личные бронирования (${bookingsCount}) останутся без привязки к клиенту.`;
  return <AdminActionForm action={deleteUserAction} values={{ userId, search }} variant="danger"
    confirmation={`Удалить пользователя и внутренние заметки безвозвратно? ${impact}`}>
    Удалить
  </AdminActionForm>;
}
