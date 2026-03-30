import type { Metadata } from "next";

import { AudienceSection } from "@/features/marketing/ui/AudienceSection";
import { CapabilitySection } from "@/features/marketing/ui/CapabilitySection";
import { HomeCta } from "@/features/marketing/ui/HomeCta";
import { HomeHero } from "@/features/marketing/ui/HomeHero";
import { HowItWorksSection } from "@/features/marketing/ui/HowItWorksSection";
import { ShowcaseSection } from "@/features/marketing/ui/ShowcaseSection";

export const metadata: Metadata = {
  title: "Бронирование пространств онлайн",
  description:
    "Bookit помогает сдавать пространства в аренду и быстро находить свободные слоты для бронирования."
};

export default function HomePage() {
  return (
    <div className="marketing-page">
      <HomeHero />
      <CapabilitySection />
      <ShowcaseSection />
      <HowItWorksSection />
      <AudienceSection />
      <HomeCta />
    </div>
  );
}
