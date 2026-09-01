"use client";

import { useState } from "react";

import type { AvailabilityOption } from "@/features/booking/server/bookingTypes";
import { CustomerBookingForm } from "@/features/booking/ui/CustomerBookingForm";
import styles from "./availability.module.css";

type Props = {
  date: string;
  durationMinutes: number;
  options: AvailabilityOption[];
  pricePerHour: number;
  returnTo: string;
  unitId: string;
};

const PERIODS = [
  { from: 0, label: "Утро", to: 12 },
  { from: 12, label: "День", to: 18 },
  { from: 18, label: "Вечер", to: 24 }
];

export function SlotTimeline(props: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const match = props.options.find((item) => item.startTime === selected);
  return <div className={styles.timeline}>
    <div className={styles.slotCount}>{props.options.length} свободных вариантов</div>
    {PERIODS.map((period) => renderPeriod(period, props.options, selected, setSelected))}
    {match && <CustomerBookingForm {...props} option={match} />}
  </div>;
}

function renderPeriod(
  period: { from: number; label: string; to: number },
  options: AvailabilityOption[],
  selected: string | null,
  select: (value: string | null) => void
) {
  const items = options.filter((item) => inPeriod(item.startTime, period));
  if (!items.length) return null;
  return <section className={styles.period} key={period.label}><h4>{period.label}</h4><div className={styles.slotGrid}>{items.map((item) => {
    const active = item.startTime === selected;
    return <button aria-pressed={active} className={active ? `${styles.slot} ${styles.selectedSlot}` : styles.slot} key={item.startTime} onClick={() => select(active ? null : item.startTime)} type="button"><strong>{item.startTime}</strong><span>до {item.endTime}</span></button>;
  })}</div></section>;
}

function inPeriod(time: string, period: { from: number; to: number }) {
  const hour = Number(time.slice(0, 2));
  return hour >= period.from && hour < period.to;
}
