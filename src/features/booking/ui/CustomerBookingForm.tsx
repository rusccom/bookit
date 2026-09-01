import { createCustomerBookingAction } from "@/features/booking/server/bookingActions";
import type { AvailabilityOption } from "@/features/booking/server/bookingTypes";
import { BookingSubmitButton } from "@/features/booking/ui/BookingSubmitButton";
import styles from "./availability.module.css";

type Props = {
  date: string;
  durationMinutes: number;
  option: AvailabilityOption;
  pricePerHour: number;
  returnTo: string;
  unitId: string;
};

export function CustomerBookingForm(props: Props) {
  const total = props.pricePerHour * props.durationMinutes / 60;
  const label = `Забронировать ${props.option.startTime}–${props.option.endTime}`;
  return <form action={createCustomerBookingAction} className={styles.bookingConfirm}>
    <input name="date" type="hidden" value={props.date} />
    <input name="durationMinutes" type="hidden" value={props.durationMinutes} />
    <input name="returnTo" type="hidden" value={props.returnTo} />
    <input name="unitId" type="hidden" value={props.unitId} />
    <input name="startTime" type="hidden" value={props.option.startTime} />
    <div><strong>{props.option.startTime}–{props.option.endTime}</strong><span>{formatTotal(total)}</span></div>
    <label><span>Комментарий владельцу</span><input maxLength={500} name="note" placeholder="Например, нужен прокат ракеток" /></label>
    <BookingSubmitButton label={label} />
  </form>;
}

function formatTotal(total: number) {
  return total > 0 ? `Ориентировочно ${total.toFixed(2)} BYN` : "Стоимость уточнит владелец";
}
