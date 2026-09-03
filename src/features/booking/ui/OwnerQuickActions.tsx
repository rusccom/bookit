import Link from "next/link";
import styles from "./owner.module.css";

export function OwnerQuickActions() {
  return <div className={styles.quickActions}>
    <Link className="secondary-link" href="/dashboard/owner/occupancy">Загрузка кортов</Link>
    <Link className="primary-link" href="/dashboard/owner/units">Добавить корт</Link>
    <Link className="secondary-link" href="/dashboard/owner/bookings">Создать бронь</Link>
  </div>;
}
