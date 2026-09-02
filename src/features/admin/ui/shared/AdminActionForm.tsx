"use client";

import type { ReactNode } from "react";

import type { AdminButtonProps } from "./AdminButton";
import { AdminHiddenFields } from "./AdminHiddenFields";
import { AdminSubmitButton } from "./AdminSubmitButton";

type AdminActionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  values: Record<string, string>;
  confirmation?: string;
  variant?: AdminButtonProps["variant"];
  children: ReactNode;
};

export function AdminActionForm({ action, values, confirmation, variant = "secondary", children }: AdminActionFormProps) {
  return <form action={action} onSubmit={(event) => {
    if (confirmation && !window.confirm(confirmation)) event.preventDefault();
  }}>
    <AdminHiddenFields values={values} />
    <AdminSubmitButton size="compact" variant={variant}>{children}</AdminSubmitButton>
  </form>;
}
