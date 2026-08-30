"use client";

import { useState } from "react";

import type { AdminCatalogRecord } from "@/features/admin/server/adminTypes";
import { EditCatalogModal } from "@/features/admin/ui/EditCatalogModal";

import styles from "./adminDataTable.module.css";

type EditCatalogButtonProps = { city: string; item: AdminCatalogRecord; search: string; status: string };

export function EditCatalogButton(props: EditCatalogButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  return <><button className={styles.actionButton} onClick={() => setIsOpen(true)} type="button">Изменить</button>{isOpen && <EditCatalogModal {...props} onClose={() => setIsOpen(false)} />}</>;
}
