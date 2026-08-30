"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./adminPanel.module.css";

const ITEMS = [
  { href: "/adminpanel", icon: "О", label: "Обзор" },
  { href: "/adminpanel/users", icon: "П", label: "Пользователи" },
  { href: "/adminpanel/bookings", icon: "Б", label: "Бронирования" },
  { href: "/adminpanel/catalog", icon: "К", label: "Объекты и корты" },
  { href: "/adminpanel/audit", icon: "Ж", label: "Журнал действий" },
  { href: "/adminpanel/admins", icon: "А", label: "Администраторы" }
];

export function AdminNavigation() {
  const pathname = usePathname();
  return <nav className={styles.sidebarNav} aria-label="Панель администратора">
    {ITEMS.map((item) => <Link className={isActive(pathname, item.href) ? styles.activeNavItem : styles.navItem} href={item.href} key={item.href}><span className={styles.navIcon}>{item.icon}</span>{item.label}</Link>)}
  </nav>;
}

function isActive(pathname: string, href: string) {
  return href === "/adminpanel" ? pathname === href : pathname.startsWith(href);
}
