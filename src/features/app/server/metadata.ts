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
  description: "Bookit помогает владельцам пространств и гостям работать с бронированиями через понятный публичный интерфейс и отдельные кабинеты.",
  openGraph: {
    description: "Платформа для площадок, студий, залов и гостей: публичный вход, регистрация, логин и дальнейшая работа с бронированиями.",
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

export function createNoIndexMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: NO_INDEX_ROBOTS
  };
}
