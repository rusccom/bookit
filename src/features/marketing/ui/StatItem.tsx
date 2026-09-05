"use client";

import { useEffect, useState } from "react";
import s from "./landingStats.module.css";

type Props = { value: number; suffix: string; label: string; active: boolean };

export function StatItem(props: Props) {
  const count = useCountUp(props.value, props.active);
  return <div className={s.stat}>
    <span className={s.value}>{count.toLocaleString("ru-RU")}{props.suffix}</span>
    <span className={s.label}>{props.label}</span>
  </div>;
}

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => startCounter(target, active, setCount), [target, active]);
  return count;
}

function startCounter(target: number, active: boolean, setCount: (value: number) => void) {
  if (!active) return;
  let frame = 0;
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min((now - start) / 1600, 1);
    setCount(Math.round(target * (1 - Math.pow(1 - progress, 3))));
    if (progress < 1) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}
