import Link from "next/link";

import s from "./landingCta.module.css";

export function LandingCta() {
  return (
    <section className={s.banner}>
      <h2 className={s.title}>Готовы забронировать корт?</h2>
      <p className={s.text}>
        Присоединяйтесь к тысячам игроков, которые уже бронируют
        корты без звонков и ожидания.
      </p>
      <Link className={s.button} href="/register">
        Начать бронирование
      </Link>
    </section>
  );
}
