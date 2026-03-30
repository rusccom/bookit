import type { ReactNode } from "react";

import { ModernSiteHeader } from "@/features/app/ui/ModernSiteHeader";

import styles from "./auth.module.css";

type ModernAuthLayoutProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  highlights: string[];
  large?: boolean;
  title: string;
};

export function ModernAuthLayout(props: ModernAuthLayoutProps) {
  const containerClass = props.large ? `${styles.layout} ${styles.layoutLarge}` : styles.layout;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <ModernSiteHeader />
        <section className={containerClass}>
          <article className={styles.intro}>
            <p className={styles.eyebrow}>{props.eyebrow}</p>
            <h1>{props.title}</h1>
            <p className={styles.description}>{props.description}</p>
            <ul className={styles.highlightList}>{props.highlights.map(renderHighlight)}</ul>
          </article>
          <div className={styles.content}>{props.children}</div>
        </section>
      </div>
    </main>
  );
}

function renderHighlight(item: string) {
  return <li key={item} className={styles.highlightItem}>{item}</li>;
}
