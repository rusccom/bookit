"use client";

import { useFormStatus } from "react-dom";

import { AdminButton, type AdminButtonProps } from "./AdminButton";

export function AdminSubmitButton({ disabled, ...props }: AdminButtonProps) {
  const { pending } = useFormStatus();
  return <AdminButton {...props} aria-busy={pending} disabled={disabled || pending} type="submit" />;
}
