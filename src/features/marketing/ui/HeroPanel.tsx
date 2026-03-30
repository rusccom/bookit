import Link from "next/link";

export function HeroPanel() {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <p className="eyebrow">Universal rental booking</p>
        <h1>Платформа бронирования кортов и других арендуемых объектов</h1>
        <p className="lead">
          Лендинг пока работает как заглушка, но архитектура уже готова под две
          роли, PostgreSQL, Telegram-бота, SMS-подтверждение и LLM-слой.
        </p>
        <div className="hero-actions">
          <Link className="primary-link" href="/register?role=customer">
            Я хочу бронировать
          </Link>
          <Link className="secondary-link" href="/register?role=owner">
            Я арендодатель
          </Link>
        </div>
      </div>
      <div className="hero-card">
        <h2>Что уже заложено</h2>
        <ul className="feature-list">
          <li>2 типа регистрации: клиент и арендодатель</li>
          <li>Слоты только по 30 минут</li>
          <li>Кабинет арендодателя с ручной блокировкой времени</li>
          <li>Кабинет клиента с поиском доступности</li>
          <li>Подготовка под Telegram webhook и LLM</li>
        </ul>
      </div>
    </section>
  );
}
