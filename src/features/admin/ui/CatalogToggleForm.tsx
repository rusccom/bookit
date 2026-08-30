"use client";

import type { FormEvent } from "react";

import { toggleAdminCatalogAction } from "@/features/admin/server/adminCatalogActions";

import styles from "./adminDataTable.module.css";

type CatalogToggleFormProps = {
  active: boolean;
  city: string;
  entityId: string;
  entityType: "unit" | "venue";
  search: string;
  status: string;
};

export function CatalogToggleForm(props: CatalogToggleFormProps) {
  const label = props.active ? "Отключить" : "Включить";
  return <form action={toggleAdminCatalogAction} onSubmit={(event) => confirmToggle(event, label)}><input name="entityId" type="hidden" value={props.entityId} /><input name="entityType" type="hidden" value={props.entityType} /><input name="active" type="hidden" value={String(!props.active)} /><input name="search" type="hidden" value={props.search} /><input name="filterCity" type="hidden" value={props.city} /><input name="filterStatus" type="hidden" value={props.status} /><button className={styles.actionButton} type="submit">{label} {props.entityType === "unit" ? "корт" : "объект"}</button></form>;
}

function confirmToggle(event: FormEvent<HTMLFormElement>, label: string) {
  if (!window.confirm(`${label} выбранную позицию?`)) event.preventDefault();
}
