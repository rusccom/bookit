import type { Metadata } from "next";

import { createNoIndexMetadata } from "@/features/app/server/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Регистрация",
  "Регистрация клиентов и владельцев пространств в Bookit."
);

export default function RegisterLayout(props: { children: React.ReactNode }) {
  return props.children;
}
