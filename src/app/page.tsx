import type { Metadata } from "next";

import { ModernSiteHeader } from "@/features/app/ui/ModernSiteHeader";
import { LandingHero } from "@/features/marketing/ui/LandingHero";
import { LandingHowItWorks } from "@/features/marketing/ui/LandingHowItWorks";
import { LandingFeatures } from "@/features/marketing/ui/LandingFeatures";
import { LandingStats } from "@/features/marketing/ui/LandingStats";
import { LandingBot } from "@/features/marketing/ui/LandingBot";
import { LandingBotFlow } from "@/features/marketing/ui/LandingBotFlow";
import { LandingForOwners } from "@/features/marketing/ui/LandingForOwners";
import { LandingTestimonials } from "@/features/marketing/ui/LandingTestimonials";
import { LandingFaq } from "@/features/marketing/ui/LandingFaq";
import { LandingCta } from "@/features/marketing/ui/LandingCta";
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
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingStats />
        <LandingBot />
        <LandingBotFlow />
        <LandingForOwners />
        <LandingTestimonials />
        <LandingFaq />
        <LandingCta />
        <LandingFooter />
      </div>
    </main>
  );
}
