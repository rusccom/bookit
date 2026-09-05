import type { ReactNode } from "react";

import { ModernSiteHeader } from "@/features/app/ui/ModernSiteHeader";
import { AuthIntro } from "@/features/auth/ui/AuthIntro";

import styles from "./auth.module.css";

type ModernAuthLayoutProps = {
  children: ReactNode;
  description?: string;
  eyebrow?: string;
  highlights?: string[];
  large?: boolean;
  title?: string;
};

export function ModernAuthLayout(props: ModernAuthLayoutProps) {
  const highlights = props.highlights ?? [];
  const hasIntro = Boolean(props.title && highlights.length);
  const cls = props.large
    ? `${styles.layout} ${styles.layoutLarge}`
      : hasIntro
      ? styles.layout
      : styles.layoutCentered;

  return <main className={styles.page}>
      <ModernSiteHeader />
      <div className={styles.shell}>
        <section className={cls}>
          {hasIntro && <AuthIntro description={props.description} eyebrow={props.eyebrow} highlights={highlights} title={props.title!} />}
          <div className={styles.content}>{props.children}</div>
        </section>
      </div>
    </main>;
}
