"use client";

import { useState } from "react";

import s from "./landingFaq.module.css";
import shared from "./landing.module.css";

const QUESTIONS = [
  {
    q: "Нужна ли регистрация для бронирования?",
    a: "Да, потребуется быстрая регистрация — email и пароль. Это занимает меньше минуты и позволяет управлять бронями.",
  },
  {
    q: "Как отменить или перенести бронь?",
    a: "В личном кабинете можно отменить или изменить бронирование до начала сеанса. Ограничения зависят от правил площадки.",
  },
  {
    q: "Какие виды оплаты поддерживаются?",
    a: "Оплата происходит напрямую на площадке. Платформа помогает найти и забронировать корт, а расчёт — между вами и владельцем.",
  },
  {
    q: "Можно ли бронировать через Telegram?",
    a: "Да! Напишите нашему AI-боту в Telegram, и он поможет подобрать свободный слот и оформить бронь прямо в чате.",
  },
  {
    q: "Как добавить свою площадку на платформу?",
    a: "Зарегистрируйтесь как владелец, добавьте корты, настройте расписание и цены — клиенты начнут бронировать сразу.",
  },
];

function FaqItem(props: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${s.item} ${open ? s.itemOpen : ""}`}>
      <button
        className={s.question}
        type="button"
        onClick={() => setOpen(!open)}
      >
        <span>{props.q}</span>
        <span className={s.icon}>{open ? "−" : "+"}</span>
      </button>
      {open && <p className={s.answer}>{props.a}</p>}
    </div>
  );
}

export function LandingFaq() {
  return (
    <section className={shared.section}>
      <div className={`${shared.sectionHeader} ${shared.sectionHeaderCentered}`}>
        <h2>Частые вопросы</h2>
        <p>Ответы на популярные вопросы о платформе.</p>
      </div>
      <div className={s.list}>
        {QUESTIONS.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>
    </section>
  );
}
