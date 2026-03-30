import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { rootMetadata } from "@/features/app/server/metadata";
import { SiteHeader } from "@/features/app/ui/SiteHeader";

import "./globals.css";
import "./public.css";

const sansFont = Inter({
  display: "swap",
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans"
});

const displayFont = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = rootMetadata;

export default async function RootLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${sansFont.variable} ${displayFont.variable}`} lang="ru">
      <body>
        {props.children}
      </body>
    </html>
  );
}
