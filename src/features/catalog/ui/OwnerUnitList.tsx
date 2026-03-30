import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { formatMinutes } from "@/features/shared/server/dateTime";

const weekdayLabels = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

type OwnerUnitListProps = {
  units: OwnerUnit[];
};

export function OwnerUnitList(props: OwnerUnitListProps) {
  return (
    <section className="panel stack">
      <h2>Ваши объекты</h2>
      {props.units.length ? (
        props.units.map((unit) => (
          <article key={unit.unitId} className="item-card">
            <h3>
              {unit.venueTitle} / {unit.unitTitle}
            </h3>
            <p>
              {unit.city}, {unit.address}
            </p>
            <p>{unit.kind}</p>
            <ul className="rule-list">
              {unit.rules.map((rule) => (
                <li key={rule.id}>
                  {weekdayLabels[rule.weekday]} {formatMinutes(rule.startMinutes)} -{" "}
                  {formatMinutes(rule.endMinutes)}
                </li>
              ))}
            </ul>
          </article>
        ))
      ) : (
        <p className="muted">Объекты пока не добавлены.</p>
      )}
    </section>
  );
}
