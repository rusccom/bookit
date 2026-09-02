"use client";

import { useState } from "react";

import { AdminButton } from "./AdminButton";
import { AdminModal, type AdminModalProps } from "./AdminModal";

export function AdminEditDialog(props: Omit<AdminModalProps, "onClose">) {
  const [isOpen, setIsOpen] = useState(false);
  return <>
    <AdminButton size="compact" variant="secondary" onClick={() => setIsOpen(true)}>Изменить</AdminButton>
    {isOpen && <AdminModal {...props} onClose={() => setIsOpen(false)} />}
  </>;
}
