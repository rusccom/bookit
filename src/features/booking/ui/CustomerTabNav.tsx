"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import s from "./customer.module.css";

const tabs = [
  { href: "/dashboard/customer", label: "Главная" },
  { href: "/dashboard/customer/search", label: "Поиск корта" },
  { href: "/dashboard/customer/bookings", label: "Мои бронирования" },
];

export function CustomerTabNav() {
  const pathname = usePathname();

  return (
    <nav className={s.tabNav}>
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const cls = active ? `${s.tabLink} ${s.tabLinkActive}` : s.tabLink;
        return (
          <Link key={tab.href} className={cls} href={tab.href}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
