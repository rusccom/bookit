import Link from "next/link";

import { HeroPanel } from "@/features/marketing/ui/HeroPanel";

const steps = [
  "Арендодатель регистрируется и заводит площадку, адрес, корт и часы работы.",
  "Система автоматически режет доступность на слоты по 30 минут.",
  "Клиент ищет свободное время через web или Telegram-бота.",
  "LLM может уточнять город, дату, корт и собирать подтверждение в чате."
];

const integrations = [
  "PostgreSQL для хранения пользователей, площадок, расписаний и броней.",
  "Telegram webhook для живого диалога и inline-кнопок подтверждения.",
  "SMS OTP-поток для регистрации клиента в боте по номеру телефона.",
  "LLM-оркестратор, который умеет искать доступность и создавать pending-бронь."
];

export default function HomePage() {
  return (
    <div className="stack-large">
      <HeroPanel />
      <section className="panel split-layout">
        <div>
          <p className="eyebrow">Flow</p>
          <h2>Как это будет работать</h2>
          <ol className="ordered-list">
            {steps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <div>
          <p className="eyebrow">Infrastructure</p>
          <h2>Что подготовлено под прод</h2>
          <ul className="feature-list">
            {integrations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link className="primary-link" href="/login">
            Перейти к кабинету
          </Link>
        </div>
      </section>
    </div>
  );
}
