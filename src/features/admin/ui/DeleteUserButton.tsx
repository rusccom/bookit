"use client";

import type { FormEvent } from "react";

import { deleteUserAction } from "@/features/admin/server/adminActions";

import styles from "./adminPanel.module.css";

type DeleteUserButtonProps = {
  search: string;
  userId: string;
};

export function DeleteUserButton(props: DeleteUserButtonProps) {
  return (
    <form action={deleteUserAction} onSubmit={confirmDeletion}>
      <input name="userId" type="hidden" value={props.userId} />
      <input name="search" type="hidden" value={props.search} />
      <button className={styles.deleteButton} type="submit">Удалить</button>
    </form>
  );
}

function confirmDeletion(event: FormEvent<HTMLFormElement>) {
  if (!window.confirm("Удалить пользователя? Объекты владельца также будут удалены.")) {
    event.preventDefault();
  }
}
