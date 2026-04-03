"use client";

import { useState } from "react";

import { createCustomerBookingAction } from "@/features/booking/server/bookingActions";
import type { AvailabilityOption } from "@/features/booking/server/bookingTypes";
import s from "./customer.module.css";

type Props = {
  date: string;
  durationMinutes: number;
  options: AvailabilityOption[];
  unitId: string;
};

export function SlotTimeline({ date, durationMinutes, options, unitId }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const match = options.find((o) => o.startTime === selected);

  return (
    <div>
      <div className={s.slotGrid}>
        {options.map((opt) => {
          const active = opt.startTime === selected;
          const cls = active ? `${s.slotChip} ${s.slotChipSelected}` : s.slotChip;
          return (
            <button
              key={opt.startTime}
              className={cls}
              onClick={() => setSelected(active ? null : opt.startTime)}
              type="button"
            >
              {opt.startTime} &ndash; {opt.endTime}
            </button>
          );
        })}
      </div>
      {match && (
        <form action={createCustomerBookingAction} className={s.bookingConfirm}>
          <input name="date" type="hidden" value={date} />
          <input name="durationMinutes" type="hidden" value={durationMinutes} />
          <input name="unitId" type="hidden" value={unitId} />
          <input name="startTime" type="hidden" value={match.startTime} />
          <label>
            <span>Комментарий</span>
            <input name="note" placeholder="Опционально" />
          </label>
          <button className="primary-button" type="submit">
            Забронировать {match.startTime} &ndash; {match.endTime}
          </button>
        </form>
      )}
    </div>
  );
}
