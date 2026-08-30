"use client";

import type { FormEvent } from "react";

import { deleteUserAction } from "@/features/admin/server/adminActions";

import styles from "./adminPanel.module.css";

type DeleteUserButtonProps = {
  bookingsCount: number;
  search: string;
  unitsCount: number;
  userId: string;
};

export function DeleteUserButton(props: DeleteUserButtonProps) {
  return (
    <form action={deleteUserAction} onSubmit={(event) => confirmDeletion(event, props)}>
      <input name="userId" type="hidden" value={props.userId} />
      <input name="search" type="hidden" value={props.search} />
      <button className={styles.deleteButton} type="submit">Удалить</button>
    </form>
  );
}

function confirmDeletion(event: FormEvent<HTMLFormElement>, props: DeleteUserButtonProps) {
  const impact = `${props.unitsCount} кортов и ${props.bookingsCount} связанных бронирований`;
  if (!window.confirm(`Удалить пользователя безвозвратно? Будут затронуты: ${impact}.`)) {
    event.preventDefault();
  }
}
