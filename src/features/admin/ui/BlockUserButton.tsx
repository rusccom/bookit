import { blockUserAction } from "@/features/admin/server/adminActions";
import { AdminActionForm } from "./shared/AdminActionForm";

type BlockUserButtonProps = { blocked: boolean; search: string; userId: string };

export function BlockUserButton({ blocked, search, userId }: BlockUserButtonProps) {
  const confirmation = blocked ? "Разблокировать пользователя?" : "Заблокировать вход пользователя? Его данные сохранятся.";
  return <AdminActionForm action={blockUserAction} values={{ userId, search, blocked: String(!blocked) }} confirmation={confirmation}>
    {blocked ? "Разблокировать" : "Блокировать"}
  </AdminActionForm>;
}
