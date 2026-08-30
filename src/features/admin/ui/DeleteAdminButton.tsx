"use client";

import type { FormEvent } from "react";

import { removeAdminAction } from "@/features/admin/server/adminSecurityActions";

import styles from "./adminSecurity.module.css";

type DeleteAdminButtonProps = { adminId: string };

export function DeleteAdminButton({ adminId }: DeleteAdminButtonProps) {
  return <form action={removeAdminAction} onSubmit={confirmDelete}><input name="adminId" type="hidden" value={adminId} /><button className={styles.dangerButton} type="submit">Удалить</button></form>;
}

function confirmDelete(event: FormEvent<HTMLFormElement>) {
  if (!window.confirm("Удалить администратора и завершить все его сессии?")) event.preventDefault();
}
