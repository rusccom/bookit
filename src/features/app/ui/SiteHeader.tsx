import { logoutUserAction } from "@/features/auth/server/authActions";
import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import { getDashboardPath } from "@/features/auth/server/requireUser";

import { DesktopDashboardNav } from "./DesktopDashboardNav";
import { MobileNav } from "./MobileNav";
import { SiteIdentity } from "./SiteIdentity";
import { getDashboardNavigation } from "./dashboardNavigation";
import { PublicDashboardNav } from "./PublicDashboardNav";
import styles from "./dashboardHeader.module.css";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const dashboardPath = user ? getDashboardPath(user.role) : "/";
  const navItems = user ? getDashboardNavigation(user.role) : [];
  const greeting = user ? `Привет, ${getFirstName(user.fullName)}` : null;
  return <header className={styles.header}>
    <SiteIdentity dashboardPath={dashboardPath} greeting={greeting} role={user?.role} />
      {user ? (
        <>
          <DesktopDashboardNav items={navItems} logoutAction={logoutUserAction} />
          <div className={styles.mobileNav}><MobileNav items={navItems} logoutAction={logoutUserAction} /></div>
        </>
      ) : <PublicDashboardNav />}
    </header>;
}

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "друг";
}
