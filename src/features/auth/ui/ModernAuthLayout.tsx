import React from "react";
import styles from "./auth.module.css";
import { ModernSiteHeader } from "@/features/app/ui/ModernSiteHeader";

type ModernAuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  large?: boolean;
};

export function ModernAuthLayout({ children, title, description, large }: ModernAuthLayoutProps) {
  return (
    <main className={styles.authPage}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <ModernSiteHeader />
      </div>
      <div className={`${styles.authContainer} ${large ? styles.authContainerLarge : ""}`}>
        <div className={styles.glassPanel}>
          <header className={styles.header}>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          {children}
        </div>
      </div>
    </main>
  );
}
