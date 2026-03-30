import Link from "next/link";

import { heroStats } from "@/features/marketing/content/homeContent";

export function HomeHero() {
  return (
    <section className="hero-surface">
      <div className="hero-copy">
        <p className="eyebrow">Bookit</p>
        <h1>Бронирование пространств, которое выглядит современно и работает без хаоса</h1>
        <p className="lead">Bookit соединяет владельцев арендуемых пространств и гостей в одном понятном веб-потоке: от первой страницы до кабинета, расписания и подтверждения.</p>
        <div className="hero-actions">
          <Link className="primary-link" href="/register">Открыть аккаунт</Link>
          <Link className="secondary-link" href="/login">Войти в кабинет</Link>
        </div>
      </div>
      <div className="hero-stat-grid">
        {heroStats.map((item) => <article key={item.value} className="metric-card"><strong>{item.value}</strong><span>{item.label}</span></article>)}
      </div>
    </section>
  );
}
