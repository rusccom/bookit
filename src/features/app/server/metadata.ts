import type { Metadata } from "next";

const NO_INDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true
  }
};

export const rootMetadata: Metadata = {
  title: {
    default: "Bookit",
    template: "%s | Bookit"
  },
  description:
    "Bookit помогает управлять арендой пространств и находить свободные слоты для быстрого бронирования.",
  openGraph: {
    description:
      "Платформа для владельцев пространств и гостей: расписание, брони и понятный маршрут от главной до кабинета.",
    locale: "ru_BY",
    siteName: "Bookit",
    title: "Bookit",
    type: "website"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export function createNoIndexMetadata(
  title: string,
  description: string
): Metadata {
  return {
    title,
    description,
    robots: NO_INDEX_ROBOTS
  };
}
