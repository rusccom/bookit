"use client";

import { useState } from "react";

import { MobileMenu } from "./MobileMenu";
import type { NavItem } from "./dashboardNavigation";
import styles from "./dashboardHeader.module.css";

type MobileNavProps = {
  items: NavItem[];
  logoutAction: () => Promise<void>;
};

export function MobileNav({ items, logoutAction }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const menuId = "dashboard-mobile-menu";
  const lineClass = open ? `${styles.burgerLine} ${styles.burgerLineOpen}` : styles.burgerLine;
  return <div className={styles.mobileNavShell}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-label="Меню"
        className={styles.burger}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className={lineClass} /><span className={lineClass} /><span className={lineClass} />
      </button>
      {open && <MobileMenu close={() => setOpen(false)} id={menuId} items={items} logoutAction={logoutAction} />}
    </div>;
}
