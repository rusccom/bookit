import Link from "next/link";
import styles from "./ownerOccupancy.module.css";

export function OwnerOccupancyFilters({ date }: { date: string }) {
  return <form action="/dashboard/owner/occupancy" className={styles.filters}>
    <label><span>Любая дата нужной недели</span><input defaultValue={date} min="2000-01-01" max="2100-12-31" name="date" required type="date" /></label>
    <button className="primary-button" type="submit">Показать неделю</button>
    <Link className="ghost-button" href="/dashboard/owner/occupancy">Эта неделя</Link>
  </form>;
}
