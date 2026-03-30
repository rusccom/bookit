import type { Metadata } from "next";
import styles from "@/features/marketing/ui/landing.module.css";

import { ModernHero } from "@/features/marketing/ui/ModernHero";
import { ModernFeatures } from "@/features/marketing/ui/ModernFeatures";
import { ModernCta } from "@/features/marketing/ui/ModernCta";
import { ModernSiteHeader } from "@/features/app/ui/ModernSiteHeader";

export const metadata: Metadata = {
  title: "Bookit — Бронирование и управление пространствами",
  description:
    "Платформа №1 для удобной аренды залов, кортов, студий и управления вашим расписанием."
};

export default function HomePage() {
  return (
    <main className={styles.landingPage}>
      <ModernSiteHeader />
      <div className={styles.container}>
        <ModernHero />
        <ModernFeatures />
        <ModernCta />
      </div>
    </main>
  );
}
