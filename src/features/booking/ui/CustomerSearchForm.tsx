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
    <form className="panel form-grid" method="GET">
      <h2>Найти свободное время</h2>
      <label>
        <span>Город</span>
        <select defaultValue={props.values.city || ""} name="city" required>
          <option value="">Выберите город</option>
          {props.cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Дата</span>
        <input defaultValue={props.values.date} name="date" required type="date" />
      </label>
      <label>
        <span>Длительность</span>
        <select defaultValue={props.values.durationMinutes || "60"} name="durationMinutes">
          {durationOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>После</span>
        <input defaultValue={props.values.startTime} name="startTime" step="1800" type="time" />
      </label>
      <label>
        <span>До</span>
        <input defaultValue={props.values.endTime} name="endTime" step="1800" type="time" />
      </label>
      <label>
        <span>Площадка или корт</span>
        <input
          defaultValue={props.values.venueQuery}
          name="venueQuery"
          placeholder="Например, Olympic"
        />
      </label>
      <button className="primary-button" type="submit">
        Показать доступность
      </button>
    </form>
  );
}
