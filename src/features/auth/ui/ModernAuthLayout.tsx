import type { ReactNode } from "react";

import { ModernSiteHeader } from "@/features/app/ui/ModernSiteHeader";

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

  return (
    <main className={styles.page}>
      <ModernSiteHeader />
      <div className={styles.shell}>
        <section className={cls}>
          {hasIntro && (
            <article className={styles.intro}>
              {props.eyebrow && <p className={styles.eyebrow}>{props.eyebrow}</p>}
              <h1>{props.title}</h1>
              {props.description && <p className={styles.description}>{props.description}</p>}
              <ul className={styles.highlightList}>
                {highlights.map(renderHighlight)}
              </ul>
            </article>
          )}
          <div className={styles.content}>{props.children}</div>
        </section>
      </div>
    </main>
  );
}

function renderHighlight(item: string) {
  return (
    <li key={item} className={styles.highlightItem}>
      {item}
    </li>
  );
}
