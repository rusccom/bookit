import type { Metadata } from "next";

import { ModernSiteHeader } from "@/features/app/ui/ModernSiteHeader";
import { ModernAudience } from "@/features/marketing/ui/ModernAudience";
import { ModernCta } from "@/features/marketing/ui/ModernCta";
import { ModernFeatures } from "@/features/marketing/ui/ModernFeatures";
import { ModernFlow } from "@/features/marketing/ui/ModernFlow";
import { ModernHero } from "@/features/marketing/ui/ModernHero";
import styles from "@/features/marketing/ui/landing.module.css";

export const metadata: Metadata = {
  title: "Bookit — бронирование пространств для гостей и владельцев",
  description: "Современный публичный интерфейс Bookit: лендинг, регистрация и вход для гостей и владельцев площадок."
};

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <ModernSiteHeader />
        <ModernHero />
        <ModernAudience />
        <ModernFeatures />
        <ModernFlow />
        <ModernCta />
      </div>
    </main>
  );
}
