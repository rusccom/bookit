import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { formatSlotMinutes } from "@/features/catalog/slotOptions";

export function OwnerManualBookingFields({ units, today }: { units: OwnerUnit[]; today: string }) {
  return <>
    <label><span>Корт</span><select disabled={!units.length} name="unitId" required>
      {units.map((unit) => <option key={unit.unitId} value={unit.unitId}>{unit.venueTitle} / {unit.unitTitle} — шаг {formatSlotMinutes(unit.slotMinutes)}</option>)}
    </select></label>
    <label><span>Дата</span><input defaultValue={today} min={today} name="date" required type="date" /></label>
    <div className="time-row">
      <label><span>С</span><input name="startTime" required step="1800" type="time" /></label>
      <label><span>До</span><input name="endTime" required step="1800" type="time" /></label>
    </div>
  </>;
}
