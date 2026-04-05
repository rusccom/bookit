"use client";

import { useEffect, useRef, useState } from "react";

import s from "./landingStats.module.css";
import shared from "./landing.module.css";

const STATS = [
  { value: 1200, suffix: "+", label: "Бронирований" },
  { value: 85, suffix: "", label: "Площадок" },
  { value: 12, suffix: "", label: "Городов" },
  { value: 3500, suffix: "+", label: "Пользователей" },
];

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame: number;
    const duration = 1600;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * ease));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);

  return count;
}

function StatItem(props: { value: number; suffix: string; label: string; active: boolean }) {
  const count = useCountUp(props.value, props.active);

  return (
    <div className={s.stat}>
      <span className={s.value}>
        {count.toLocaleString("ru-RU")}
        {props.suffix}
      </span>
      <span className={s.label}>{props.label}</span>
    </div>
  );
}

export function LandingStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={shared.section}>
      <div className={`${shared.sectionHeader} ${shared.sectionHeaderCentered}`}>
        <h2>Платформа в цифрах</h2>
        <p>Нам доверяют игроки и владельцы площадок по всей стране.</p>
      </div>
      <div ref={ref} className={s.grid}>
        {STATS.map((item) => (
          <StatItem key={item.label} active={visible} {...item} />
        ))}
      </div>
    </section>
  );
}
