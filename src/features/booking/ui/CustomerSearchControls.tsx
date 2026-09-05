import { BOOKING_DURATION_OPTIONS } from "@/features/booking/bookingDurationOptions";

import type { CustomerSearchValues } from "./customerSearchTypes";
import s from "./customerSearchForm.module.css";

type Props = { cities: string[]; today: string; values: CustomerSearchValues };

export function CustomerSearchControls(props: Props) {
  return <div className={s.controls}>
    <label className={s.field}><span>Город</span><select className={s.control} defaultValue={props.values.city || ""} name="city" required>
      <option value="">Выберите город</option>{props.cities.map((city) => <option key={city} value={city}>{city}</option>)}
    </select></label>
    <label className={s.field}><span>Дата</span><input className={s.control} defaultValue={props.values.date} min={props.today} name="date" required type="date" /></label>
    <label className={s.field}><span>Длительность</span><select className={s.control} defaultValue={props.values.durationMinutes || "60"} name="durationMinutes">
      {BOOKING_DURATION_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
    </select></label>
    <label className={s.field}><span>После</span><input className={s.control} defaultValue={props.values.startTime} name="startTime" step="1800" type="time" /></label>
    <label className={s.field}><span>До</span><input className={s.control} defaultValue={props.values.endTime} name="endTime" step="1800" type="time" /></label>
    <label className={s.field}><span>Площадка или корт</span><input className={s.control} defaultValue={props.values.venueQuery} name="venueQuery" placeholder="Например, Olympic" /></label>
    <button className={`primary-button ${s.submit}`} type="submit">Найти свободное время</button>
  </div>;
}
