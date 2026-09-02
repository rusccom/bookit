import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { createOwnerManualBookingAction } from "@/features/booking/server/bookingActions";
import { getTodayIso } from "@/features/shared/server/dateTime";
import { OwnerManualBookingFields } from "./OwnerManualBookingFields";

export function OwnerManualBookingForm({ units: allUnits }: { units: OwnerUnit[] }) {
  const units = allUnits.filter((unit) => unit.isActive && unit.isVenueActive && unit.rules.length);
  return <form action={createOwnerManualBookingAction} className="panel form-grid">
    <div><p className="eyebrow">Служебный резерв</p><h2>Закрыть время вручную</h2><p>Используйте для офлайн-брони, турнира или технического перерыва. Время и длительность должны соответствовать шагу корта.</p></div>
    <OwnerManualBookingFields units={units} today={getTodayIso()} />
    <label><span>Комментарий</span><input maxLength={500} name="note" placeholder="Турнир / офлайн-резерв" /></label>
    <button className="primary-button" disabled={!units.length} type="submit">Заблокировать время</button>
    {!units.length && <p className="muted">Сначала создайте активный корт с расписанием.</p>}
  </form>;
}
