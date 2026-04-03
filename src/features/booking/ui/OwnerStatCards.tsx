import s from "./owner.module.css";

type OwnerStatCardsProps = {
  todayCount: number;
  totalUnits: number;
  nextBookingLabel: string | null;
};

export function OwnerStatCards(props: OwnerStatCardsProps) {
  return (
    <div className={s.statsRow}>
      <div className={`${s.statCard} ${s.statHighlight}`}>
        <span className={s.statValue}>{props.todayCount}</span>
        <span className={s.statLabel}>Бронирований сегодня</span>
      </div>
      <div className={s.statCard}>
        <span className={s.statValue}>
          {props.nextBookingLabel ?? "—"}
        </span>
        <span className={s.statLabel}>Ближайшая бронь</span>
      </div>
      <div className={s.statCard}>
        <span className={s.statValue}>{props.totalUnits}</span>
        <span className={s.statLabel}>Всего объектов</span>
      </div>
    </div>
  );
}
