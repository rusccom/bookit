"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = { href: string; label: string };

type MobileNavProps = {
  items: NavItem[];
  logoutAction: (formData: FormData) => Promise<void>;
};

export function MobileNav({ items, logoutAction }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Меню"
        className="burger"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className={open ? "burger-line burger-open" : "burger-line"} />
        <span className={open ? "burger-line burger-open" : "burger-line"} />
        <span className={open ? "burger-line burger-open" : "burger-line"} />
      </button>
      {open && (
        <nav className="mobile-menu" onClick={() => setOpen(false)}>
          {items.map((item) => (
            <Link key={item.href} className="mobile-link" href={item.href}>
              {item.label}
            </Link>
          ))}
          <form action={logoutAction}>
            <button className="mobile-link mobile-logout" type="submit">
              Выйти
            </button>
          </form>
        </nav>
      )}
    </>
  );
}
