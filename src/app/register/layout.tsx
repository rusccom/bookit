import type { Metadata } from "next";

import { createNoIndexMetadata } from "@/features/app/server/metadata";

export const metadata: Metadata = createNoIndexMetadata(
  "Регистрация",
  "Регистрация гостей и владельцев площадок в Bookit."
);

export default function RegisterLayout(props: { children: React.ReactNode }) {
  return props.children;
}
