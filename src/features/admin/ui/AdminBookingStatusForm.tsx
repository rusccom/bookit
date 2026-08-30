"use client";

import type { FormEvent } from "react";

import { updateAdminBookingStatusAction } from "@/features/admin/server/adminBookingActions";

import styles from "./adminDataTable.module.css";

type AdminBookingStatusFormProps = {
  bookingId: string;
  filterDate: string;
  filterStatus: string;
  nextStatus: string;
  search: string;
};

export function AdminBookingStatusForm(props: AdminBookingStatusFormProps) {
  return <form action={updateAdminBookingStatusAction} onSubmit={(event) => confirmStatus(event, props.nextStatus)}><input name="bookingId" type="hidden" value={props.bookingId} /><input name="search" type="hidden" value={props.search} /><input name="filterDate" type="hidden" value={props.filterDate} /><input name="filterStatus" type="hidden" value={props.filterStatus} /><input name="status" type="hidden" value={props.nextStatus} /><button className={props.nextStatus === "cancelled" ? styles.dangerButton : styles.actionButton} type="submit">{props.nextStatus === "cancelled" ? "Отменить" : "Подтвердить"}</button></form>;
}

function confirmStatus(event: FormEvent<HTMLFormElement>, status: string) {
  if (status === "cancelled" && !window.confirm("Отменить это бронирование?")) event.preventDefault();
}
