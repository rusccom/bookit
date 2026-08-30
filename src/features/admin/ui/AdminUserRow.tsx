import Link from "next/link";

import type { AdminUserRecord } from "@/features/admin/server/adminTypes";
import { BlockUserButton } from "@/features/admin/ui/BlockUserButton";
import { DeleteUserButton } from "@/features/admin/ui/DeleteUserButton";
import { EditUserButton } from "@/features/admin/ui/EditUserButton";
import { formatBelarusPhone } from "@/features/shared/server/phone";

import styles from "./adminPanel.module.css";
import userStyles from "./adminUserTable.module.css";

type AdminUserRowProps = {
  search: string;
  user: AdminUserRecord;
};

export function AdminUserRow({ search, user }: AdminUserRowProps) {
  return (
    <tr>
      <td><strong>{user.fullName}</strong><span className={styles.userId}>{user.id}</span></td>
      <td>{user.email || "—"}<span className={styles.phone}>{formatBelarusPhone(user.phone) || "Телефон не указан"}</span></td>
      <td><span className={styles.roleBadge}>{user.role === "owner" ? "Владелец" : "Клиент"}</span></td>
      <td><span className={user.isBlocked ? userStyles.blockedBadge : userStyles.activeBadge}>{user.isBlocked ? "Заблокирован" : "Активен"}</span></td>
      <td>{formatDate(user.createdAt)}</td>
      <td>
        <div className={styles.userActions}>
          <Link className={userStyles.detailsButton} href={`/adminpanel/users/${user.id}`}>Карточка</Link>
          <EditUserButton search={search} user={user} />
          <BlockUserButton blocked={user.isBlocked} search={search} userId={user.id} />
          <DeleteUserButton bookingsCount={user.bookingsCount} search={search} unitsCount={user.unitsCount} userId={user.id} />
        </div>
      </td>
    </tr>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-BY", { dateStyle: "medium" })
    .format(new Date(value));
}
