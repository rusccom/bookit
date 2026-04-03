import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { formatMinutes } from "@/features/shared/server/dateTime";
import s from "./owner.module.css";

const weekdayLabels = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

type OwnerUnitCardsProps = {
  units: OwnerUnit[];
};

export function OwnerUnitCards(props: OwnerUnitCardsProps) {
  if (props.units.length === 0) {
    return (
      <div className={s.emptyCard}>
        <p>Объекты пока не добавлены</p>
      </div>
    );
  }

  return (
    <div className={s.unitGrid}>
      {props.units.map((unit) => (
        <div key={unit.unitId} className={s.unitCard}>
          <h3>{unit.venueTitle} / {unit.unitTitle}</h3>
          <p className={s.unitMeta}>
            {unit.city}, {unit.address} &middot; {unit.kind}
          </p>
          <div className={s.unitSchedule}>
            {unit.rules.map((rule) => (
              <span key={rule.id} className={s.dayChip}>
                {weekdayLabels[rule.weekday]}{" "}
                {formatMinutes(rule.startMinutes)}&ndash;{formatMinutes(rule.endMinutes)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
