"use client";

import { useState } from "react";

import type { AvailabilityOption } from "@/features/booking/server/bookingTypes";
import { CustomerBookingForm } from "@/features/booking/ui/CustomerBookingForm";
import { SlotPeriod } from "@/features/booking/ui/SlotPeriod";
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
    {PERIODS.map((period) => <SlotPeriod key={period.label} options={props.options} period={period} select={setSelected} selected={selected} />)}
    {match && <CustomerBookingForm {...props} option={match} />}
  </div>;
}
