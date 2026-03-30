import type { Metadata } from "next";

import { SiteHeader } from "@/features/app/ui/SiteHeader";

import "./globals.css";

export const metadata: Metadata = {
  description: "Universal booking system for sports courts and rental objects.",
  title: "Bookit"
};

export default async function RootLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <div className="page-shell">
          <SiteHeader />
          <main className="page-content">{props.children}</main>
        </div>
      </body>
    </html>
  );
}
