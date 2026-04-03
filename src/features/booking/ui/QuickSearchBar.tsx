import { getTomorrowIso } from "@/features/shared/server/dateTime";
import s from "./customer.module.css";

type Props = { cities: string[] };

export function QuickSearchBar({ cities }: Props) {
  const tomorrow = getTomorrowIso();

  return (
    <form action="/dashboard/customer/search" className={s.quickSearch} method="GET">
      <label>
        <span>Город</span>
        <select name="city" required>
          <option value="">Выберите город</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Дата</span>
        <input defaultValue={tomorrow} name="date" required type="date" />
      </label>
      <button className="primary-button" type="submit">Найти корт</button>
    </form>
  );
}
