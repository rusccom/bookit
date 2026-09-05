import type { UserRole } from "@/features/auth/server/authTypes";

export type NavItem = { href: string; label: string };

const CUSTOMER_NAV: NavItem[] = [
  { href: "/dashboard/customer", label: "Главная" },
  { href: "/dashboard/customer/search", label: "Поиск корта" },
  { href: "/dashboard/customer/bookings", label: "Мои брони" }
];

const OWNER_NAV: NavItem[] = [
  { href: "/dashboard/owner", label: "Обзор" },
  { href: "/dashboard/owner/units", label: "Корты" },
  { href: "/dashboard/owner/bookings", label: "Бронирования" },
  { href: "/dashboard/owner/occupancy", label: "Загрузка" }
];

export function getDashboardNavigation(role: UserRole) {
  return role === "owner" ? OWNER_NAV : CUSTOMER_NAV;
}
