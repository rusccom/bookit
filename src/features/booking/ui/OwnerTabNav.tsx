"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import s from "./owner.module.css";

const tabs = [
  { href: "/dashboard/owner", label: "Обзор" },
  { href: "/dashboard/owner/units", label: "Объекты" },
  { href: "/dashboard/owner/bookings", label: "Бронирования" },
];

export function OwnerTabNav() {
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
