import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { createOwnerManualBookingAction } from "@/features/booking/server/bookingActions";

type OwnerManualBookingFormProps = {
  units: OwnerUnit[];
};

export function OwnerManualBookingForm(props: OwnerManualBookingFormProps) {
  return (
    <form action={createOwnerManualBookingAction} className="panel form-grid">
      <h2>Ручное бронирование</h2>
      <label>
        <span>Корт</span>
        <select name="unitId" required>
          {props.units.map((unit) => (
            <option key={unit.unitId} value={unit.unitId}>
              {unit.venueTitle} / {unit.unitTitle}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Дата</span>
        <input name="date" required type="date" />
      </label>
      <div className="time-row">
        <label>
          <span>С</span>
          <input name="startTime" required step="1800" type="time" />
        </label>
        <label>
          <span>До</span>
          <input name="endTime" required step="1800" type="time" />
        </label>
      </div>
      <label>
        <span>Комментарий</span>
        <input name="note" placeholder="Турнир / офлайн-резерв" />
      </label>
      <button className="primary-button" type="submit">
        Заблокировать время
      </button>
    </form>
  );
}
