"use client";

import type { FormEvent } from "react";

import { blockUserAction } from "@/features/admin/server/adminActions";

import styles from "./adminUserTable.module.css";

type BlockUserButtonProps = {
  blocked: boolean;
  search: string;
  userId: string;
};

export function BlockUserButton(props: BlockUserButtonProps) {
  return <form action={blockUserAction} onSubmit={(event) => confirmChange(event, props.blocked)}>
    <input name="userId" type="hidden" value={props.userId} />
    <input name="search" type="hidden" value={props.search} />
    <input name="blocked" type="hidden" value={String(!props.blocked)} />
    <button className={styles.blockButton} type="submit">{props.blocked ? "Разблокировать" : "Блокировать"}</button>
  </form>;
}

function confirmChange(event: FormEvent<HTMLFormElement>, blocked: boolean) {
  const message = blocked ? "Разблокировать пользователя?" : "Заблокировать вход пользователя? Его данные сохранятся.";
  if (!window.confirm(message)) event.preventDefault();
}
