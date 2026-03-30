import React from "react";
import styles from "./auth.module.css";

type ModernAuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  large?: boolean;
};

export function ModernAuthLayout({ children, title, description, large }: ModernAuthLayoutProps) {
  return (
    <main className={styles.authPage}>
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
