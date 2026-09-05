import Link from "next/link";
import type { NavItem } from "./dashboardNavigation";
import styles from "./dashboardHeader.module.css";

type Props = { items: NavItem[]; logoutAction: () => Promise<void> };

export function DesktopDashboardNav(props: Props) {
  return <nav className={styles.desktopNav}>
    {props.items.map((item) => <Link key={item.href} className={styles.navLink} href={item.href}>{item.label}</Link>)}
    <form action={props.logoutAction}><button className="ghost-button" type="submit">Выйти</button></form>
  </nav>;
}
