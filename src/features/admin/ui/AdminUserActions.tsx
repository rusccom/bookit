import type { AdminUserRecord } from "../server/adminTypes";
import { BlockUserButton } from "./BlockUserButton";
import { DeleteUserButton } from "./DeleteUserButton";
import { EditUserButton } from "./EditUserButton";
import { AdminActions } from "./shared/AdminActions";
import { AdminLink } from "./shared/AdminLink";

type AdminUserActionsProps = { user: AdminUserRecord; search: string; showDetails?: boolean };

export function AdminUserActions({ user, search, showDetails = true }: AdminUserActionsProps) {
  return <AdminActions>
    {showDetails && <AdminLink button href={`/adminpanel/users/${user.id}`}>Карточка</AdminLink>}
    <EditUserButton search={search} user={user} />
    <BlockUserButton blocked={user.isBlocked} search={search} userId={user.id} />
    <DeleteUserButton bookingsCount={user.bookingsCount} search={search} unitsCount={user.unitsCount} userId={user.id} />
  </AdminActions>;
}
