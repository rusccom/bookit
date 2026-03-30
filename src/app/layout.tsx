import type { Metadata } from "next";
import { Inter, Manrope, Rubik, Space_Grotesk } from "next/font/google";

import { rootMetadata } from "@/features/app/server/metadata";

import "./globals.css";
import "./public.css";

const dashboardSansFont = Inter({
  display: "swap",
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans"
});

const dashboardDisplayFont = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display"
});

const publicSansFont = Manrope({
  display: "swap",
  subsets: ["latin", "cyrillic"],
  variable: "--font-public-sans"
});

const publicDisplayFont = Rubik({
  display: "swap",
  subsets: ["latin", "cyrillic"],
  variable: "--font-public-display"
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout(props: { children: React.ReactNode }) {
  const className = [
    dashboardSansFont.variable,
    dashboardDisplayFont.variable,
    publicSansFont.variable,
    publicDisplayFont.variable
  ].join(" ");

  return (
    <html className={className} lang="ru">
      <body>{props.children}</body>
    </html>
  );
}
