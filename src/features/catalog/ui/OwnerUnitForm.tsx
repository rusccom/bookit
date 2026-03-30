import { createOwnerUnitAction } from "@/features/catalog/server/catalogActions";

const weekdayOptions = [
  { label: "Вс", value: 0 },
  { label: "Пн", value: 1 },
  { label: "Вт", value: 2 },
  { label: "Ср", value: 3 },
  { label: "Чт", value: 4 },
  { label: "Пт", value: 5 },
  { label: "Сб", value: 6 }
];

export function OwnerUnitForm() {
  return (
    <form action={createOwnerUnitAction} className="panel form-grid">
      <h2>Добавить объект</h2>
      <label>
        <span>Город</span>
        <input name="city" placeholder="Минск" required />
      </label>
      <label>
        <span>Площадка</span>
        <input name="venueTitle" placeholder="Olympic Club" required />
      </label>
      <label>
        <span>Адрес</span>
        <input name="address" placeholder="пр-т Победителей, 10" required />
      </label>
      <label>
        <span>Название корта</span>
        <input name="title" placeholder="Корт 1" required />
      </label>
      <label>
        <span>Тип</span>
        <input defaultValue="tennis_court" name="kind" required />
      </label>
      <div className="time-row">
        <label>
          <span>Открытие</span>
          <input defaultValue="12:00" name="startTime" required step="1800" type="time" />
        </label>
        <label>
          <span>Закрытие</span>
          <input defaultValue="16:00" name="endTime" required step="1800" type="time" />
        </label>
      </div>
      <fieldset className="weekday-grid">
        <legend>Рабочие дни</legend>
        {weekdayOptions.map((item) => (
          <label key={item.value} className="weekday-option">
            <input defaultChecked name="days" type="checkbox" value={item.value} />
            <span>{item.label}</span>
          </label>
        ))}
      </fieldset>
      <button className="primary-button" type="submit">
        Сохранить объект
      </button>
    </form>
  );
}
