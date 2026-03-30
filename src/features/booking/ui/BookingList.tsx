import {
  cancelCustomerBookingAction,
  cancelOwnerBookingAction
} from "@/features/booking/server/bookingActions";
import type { BookingRecord } from "@/features/booking/server/bookingTypes";

type BookingListProps = {
  items: BookingRecord[];
  role: "customer" | "owner";
};

export function BookingList(props: BookingListProps) {
  const action =
    props.role === "owner" ? cancelOwnerBookingAction : cancelCustomerBookingAction;

  return (
    <section className="panel stack">
      <h2>{props.role === "owner" ? "Последние бронирования" : "Мои бронирования"}</h2>
      {props.items.length ? (
        props.items.map((item) => (
          <article key={item.bookingId} className="item-card split-card">
            <div>
              <h3>
                {item.venueTitle} / {item.unitTitle}
              </h3>
              <p>
                {item.dateLabel}, {item.startTime} - {item.endTime}
              </p>
              <p>
                {item.city}, {item.address}
              </p>
              <p>
                {item.status} / {item.source}
              </p>
              {item.note ? <p>{item.note}</p> : null}
            </div>
            {item.status !== "cancelled" ? (
              <form action={action}>
                <input name="bookingId" type="hidden" value={item.bookingId} />
                <button className="ghost-button" type="submit">
                  Отменить
                </button>
              </form>
            ) : null}
          </article>
        ))
      ) : (
        <p className="muted">Бронирований пока нет.</p>
      )}
    </section>
  );
}
