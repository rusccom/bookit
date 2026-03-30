import { createCustomerBookingAction } from "@/features/booking/server/bookingActions";
import type { AvailabilityResult } from "@/features/booking/server/bookingTypes";

type AvailabilityListProps = {
  date: string;
  durationMinutes: number;
  items: AvailabilityResult[];
};

export function AvailabilityList(props: AvailabilityListProps) {
  return (
    <section className="panel stack">
      <h2>Доступные корты</h2>
      {props.items.length ? (
        props.items.map((item) => (
          <article key={item.unitId} className="item-card">
            <h3>
              {item.venueTitle} / {item.unitTitle}
            </h3>
            <p>
              {item.city}, {item.address}
            </p>
            <p>{item.kind}</p>
            <form action={createCustomerBookingAction} className="inline-form">
              <input name="date" type="hidden" value={props.date} />
              <input name="durationMinutes" type="hidden" value={props.durationMinutes} />
              <input name="unitId" type="hidden" value={item.unitId} />
              <label>
                <span>Слот</span>
                <select name="startTime">
                  {item.options.map((option) => (
                    <option key={option.startTime} value={option.startTime}>
                      {option.startTime} - {option.endTime}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Комментарий</span>
                <input name="note" placeholder="Опционально" />
              </label>
              <button className="primary-button" type="submit">
                Забронировать
              </button>
            </form>
          </article>
        ))
      ) : (
        <p className="muted">По выбранным фильтрам свободных слотов нет.</p>
      )}
    </section>
  );
}
