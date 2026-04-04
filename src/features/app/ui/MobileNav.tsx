"use client";

import Link from "next/link";
import { useState } from "react";

import styles from "./dashboardHeader.module.css";

type NavItem = { href: string; label: string };

type MobileNavProps = {
  items: NavItem[];
  logoutAction: (formData: FormData) => Promise<void>;
};

export function MobileNav({ items, logoutAction }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const menuId = "dashboard-mobile-menu";

  return (
    <div className={styles.mobileNavShell}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-label="Меню"
        className={styles.burger}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className={open ? `${styles.burgerLine} ${styles.burgerLineOpen}` : styles.burgerLine} />
        <span className={open ? `${styles.burgerLine} ${styles.burgerLineOpen}` : styles.burgerLine} />
        <span className={open ? `${styles.burgerLine} ${styles.burgerLineOpen}` : styles.burgerLine} />
      </button>
      {open && (
        <nav className={styles.mobileMenu} id={menuId}>
          {items.map((item) => (
            <Link
              key={item.href}
              className={styles.mobileLink}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <form action={logoutAction}>
            <button
              className={`${styles.mobileLink} ${styles.mobileLogout}`}
              onClick={() => setOpen(false)}
              type="submit"
            >
              Выйти
            </button>
          </form>
        </nav>
      )}
    </div>
  );
}
