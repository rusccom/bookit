import type { AvailabilityResult } from "@/features/booking/server/bookingTypes";
import { CourtAvailabilityCard } from "./CourtAvailabilityCard";
import { EmptyAvailabilityResults } from "./EmptyAvailabilityResults";
import styles from "./availability.module.css";

type Props = { date: string; durationMinutes: number; items: AvailabilityResult[]; returnTo: string; searchedCity: string };

export function CustomerAvailabilityResults(props: Props) {
  return <>
    <header className={styles.resultsHeader}>
      <div><p className="eyebrow">Онлайн-запись</p><h1>Свободные корты</h1><p>{props.searchedCity ? `${props.searchedCity} · ${props.date}` : "Выберите город и дату"}</p></div>
      {props.searchedCity && <span className={styles.resultsCount}>{props.items.length} найдено</span>}
    </header>
    {props.items.length ? <div className={styles.results}>
      {props.items.map((item) => <CourtAvailabilityCard date={props.date} durationMinutes={props.durationMinutes} item={item} key={item.unitId} returnTo={props.returnTo} />)}
    </div> : <EmptyAvailabilityResults searched={Boolean(props.searchedCity)} />}
  </>;
}
