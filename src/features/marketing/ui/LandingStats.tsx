"use client";

import s from "./landingStats.module.css";
import shared from "./landing.module.css";
import { StatItem } from "./StatItem";
import { useVisibility } from "./useVisibility";

const STATS = [
  { value: 1200, suffix: "+", label: "Бронирований" },
  { value: 85, suffix: "", label: "Площадок" },
  { value: 12, suffix: "", label: "Городов" },
  { value: 3500, suffix: "+", label: "Пользователей" },
];

export function LandingStats() {
  const { ref, visible } = useVisibility();
  return <section className={shared.section}>
      <div className={`${shared.sectionHeader} ${shared.sectionHeaderCentered}`}>
        <h2>Платформа в цифрах</h2>
        <p>Нам доверяют игроки и владельцы площадок по всей стране.</p>
      </div>
      <div ref={ref} className={s.grid}>
        {STATS.map((item) => <StatItem key={item.label} active={visible} {...item} />)}
      </div>
    </section>;
}
