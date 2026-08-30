"use client";

import { useState } from "react";

import type { AdminUserRecord } from "@/features/admin/server/adminTypes";
import { EditUserModal } from "@/features/admin/ui/EditUserModal";

import styles from "./editUserModal.module.css";

type EditUserButtonProps = {
  search: string;
  user: AdminUserRecord;
};

export function EditUserButton({ search, user }: EditUserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  return <>
    <button className={styles.editButton} onClick={() => setIsOpen(true)} type="button">Изменить</button>
    {isOpen && <EditUserModal onClose={() => setIsOpen(false)} search={search} user={user} />}
  </>;
}
