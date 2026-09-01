import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { createOwnerManualBookingAction } from "@/features/booking/server/bookingActions";
import { getTodayIso } from "@/features/shared/server/dateTime";

type OwnerManualBookingFormProps = {
  units: OwnerUnit[];
};

export function OwnerManualBookingForm(props: OwnerManualBookingFormProps) {
  const units = props.units.filter((unit) => unit.isActive && unit.isVenueActive && unit.rules.length);
  const today = getTodayIso();
  return (
    <form action={createOwnerManualBookingAction} className="panel form-grid">
      <div><p className="eyebrow">Служебный резерв</p><h2>Закрыть время вручную</h2><p>Используйте для офлайн-брони, турнира или технического перерыва.</p></div>
      <label>
        <span>Корт</span>
        <select disabled={!units.length} name="unitId" required>
          {units.map((unit) => (
            <option key={unit.unitId} value={unit.unitId}>
              {unit.venueTitle} / {unit.unitTitle}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Дата</span>
        <input defaultValue={today} min={today} name="date" required type="date" />
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
      <button className="primary-button" disabled={!units.length} type="submit">
        Заблокировать время
      </button>
      {!units.length && <p className="muted">Сначала создайте активный корт с расписанием.</p>}
    </form>
  );
}
