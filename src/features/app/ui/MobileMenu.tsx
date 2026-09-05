import Link from "next/link";
import type { NavItem } from "./dashboardNavigation";
import styles from "./dashboardHeader.module.css";

type Props = { close: () => void; id: string; items: NavItem[]; logoutAction: () => Promise<void> };

export function MobileMenu(props: Props) {
  return <nav className={styles.mobileMenu} id={props.id}>
    {props.items.map((item) => (
      <Link key={item.href} className={styles.mobileLink} href={item.href} onClick={props.close}>{item.label}</Link>
    ))}
    <form action={props.logoutAction}>
      <button className={`${styles.mobileLink} ${styles.mobileLogout}`} type="submit">Выйти</button>
    </form>
  </nav>;
}
