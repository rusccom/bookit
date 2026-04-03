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
    default: "BookCort",
    template: "%s | BookCort"
  },
  description: "BookCort — онлайн-бронирование кортов. Находите и бронируйте корты за пару кликов.",
  openGraph: {
    description: "Платформа для онлайн-бронирования кортов: быстрый поиск, моментальное подтверждение, удобное управление.",
    locale: "ru_BY",
    siteName: "BookCort",
    title: "BookCort",
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

export function createNoIndexMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: NO_INDEX_ROBOTS
  };
}
