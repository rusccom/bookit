import type { Metadata } from "next";

import { ModernSiteHeader } from "@/features/app/ui/ModernSiteHeader";
import { LandingHero } from "@/features/marketing/ui/LandingHero";
import { LandingFeatures } from "@/features/marketing/ui/LandingFeatures";
import { LandingAI } from "@/features/marketing/ui/LandingAI";
import { LandingFooter } from "@/features/marketing/ui/LandingFooter";
import styles from "@/features/marketing/ui/landing.module.css";

export const metadata: Metadata = {
  title: "BookCort — онлайн-бронирование кортов",
  description: "Находите и бронируйте корты за пару кликов. Без звонков и ожидания.",
};

export default function HomePage() {
  return (
    <main className={styles.page}>
      <ModernSiteHeader />
      <div className={styles.shell}>
        <LandingHero />
        <LandingFeatures />
        <LandingAI />
        <LandingFooter />
      </div>
    </main>
  );
}
