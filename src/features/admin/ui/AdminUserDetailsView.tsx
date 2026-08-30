import Link from "next/link";

import type { AdminUserDetails } from "@/features/admin/server/adminTypes";
import { AdminUserBookingTable } from "@/features/admin/ui/AdminUserBookingTable";
import { AdminUserCatalogList } from "@/features/admin/ui/AdminUserCatalogList";
import { BlockUserButton } from "@/features/admin/ui/BlockUserButton";
import { DeleteUserButton } from "@/features/admin/ui/DeleteUserButton";
import { EditUserButton } from "@/features/admin/ui/EditUserButton";
import { formatBelarusPhone } from "@/features/shared/server/phone";

import styles from "./adminUserDetails.module.css";

type AdminUserDetailsViewProps = { details: AdminUserDetails };

export function AdminUserDetailsView({ details }: AdminUserDetailsViewProps) {
  const { user } = details;
  return <section className={styles.page}>
    <Link className={styles.backLink} href="/adminpanel/users">← Все пользователи</Link>
    <header className={styles.profile}><div><span>{user.role === "owner" ? "Владелец" : "Клиент"}</span><h1>{user.fullName}</h1><p>{user.email || "Email не указан"} · {formatBelarusPhone(user.phone) || "Телефон не указан"}</p></div><b className={user.isBlocked ? styles.inactive : styles.active}>{user.isBlocked ? "Заблокирован" : "Активен"}</b></header>
    <div className={styles.actions}><EditUserButton search="" user={user} /><BlockUserButton blocked={user.isBlocked} search="" userId={user.id} /><DeleteUserButton bookingsCount={user.bookingsCount} search="" unitsCount={user.unitsCount} userId={user.id} /></div>
    <div className={styles.metrics}><article><span>Регистрация</span><strong>{formatDate(user.createdAt)}</strong></article><article><span>Бронирования</span><strong>{user.bookingsCount}</strong></article><article><span>Корты</span><strong>{user.unitsCount}</strong></article></div>
    <div><h2>История бронирований</h2><AdminUserBookingTable bookings={details.bookings} /></div>
    {user.role === "owner" && <div><h2>Объекты и корты</h2><AdminUserCatalogList catalog={details.catalog} /></div>}
  </section>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-BY", { dateStyle: "long" }).format(new Date(value));
}
