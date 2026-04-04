import s from "./customerSearchForm.module.css";

type CustomerSearchFormProps = {
  cities: string[];
  values: {
    city?: string;
    date?: string;
    durationMinutes?: string;
    endTime?: string;
    startTime?: string;
    venueQuery?: string;
  };
};

const durationOptions = [
  { label: "30 минут", value: "30" },
  { label: "1 час", value: "60" },
  { label: "1.5 часа", value: "90" },
  { label: "2 часа", value: "120" }
];

export function CustomerSearchForm(props: CustomerSearchFormProps) {
  return (
    <form className={`panel form-grid ${s.searchForm}`} method="GET">
      <h2>Найти свободное время</h2>
      <label className={s.field}>
        <span>Город</span>
        <select className={s.control} defaultValue={props.values.city || ""} name="city" required>
          <option value="">Выберите город</option>
          {props.cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>
      <label className={s.field}>
        <span>Дата</span>
        <input className={s.control} defaultValue={props.values.date} name="date" required type="date" />
      </label>
      <label className={s.field}>
        <span>Длительность</span>
        <select
          className={s.control}
          defaultValue={props.values.durationMinutes || "60"}
          name="durationMinutes"
        >
          {durationOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className={s.field}>
        <span>После</span>
        <input
          className={s.control}
          defaultValue={props.values.startTime}
          name="startTime"
          step="1800"
          type="time"
        />
      </label>
      <label className={s.field}>
        <span>До</span>
        <input
          className={s.control}
          defaultValue={props.values.endTime}
          name="endTime"
          step="1800"
          type="time"
        />
      </label>
      <label className={s.field}>
        <span>Площадка или корт</span>
        <input
          className={s.control}
          defaultValue={props.values.venueQuery}
          name="venueQuery"
          placeholder="Например, Olympic"
        />
      </label>
      <button className={`primary-button ${s.submit}`} type="submit">
        Показать доступность
      </button>
    </form>
  );
}
