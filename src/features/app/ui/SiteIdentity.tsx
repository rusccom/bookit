import Link from "next/link";
import type { UserRole } from "@/features/auth/server/authTypes";
import styles from "./dashboardHeader.module.css";

type Props = { dashboardPath: string; greeting: string | null; role?: UserRole };

export function SiteIdentity(props: Props) {
  return <div className={styles.identity}>
    <Link aria-label="BookCort" className={styles.logo} href={props.dashboardPath}>
      <span className={styles.logoMark}>B</span>
    </Link>
    {props.greeting && <div className={styles.greeting}>
      <p className={styles.greetingEyebrow}>{props.role === "owner" ? "Панель владельца" : "Личный кабинет"}</p>
      <p className={styles.greetingText}>{props.greeting}</p>
    </div>}
  </div>;
}
