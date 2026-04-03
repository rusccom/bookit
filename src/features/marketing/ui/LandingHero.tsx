import Image from "next/image";
import Link from "next/link";

import s from "./landing.module.css";

export function LandingHero() {
  return (
    <section className={s.hero}>
      <div className={s.heroCopy}>
        <h1 className={s.heroTitle}>
          Онлайн-бронирование кортов
        </h1>
        <p className={s.heroText}>
          Находите и бронируйте корты за пару кликов.
          Без звонков, без ожидания — только удобное расписание
          и моментальное подтверждение.
        </p>
        <Link className={s.heroAction} href="/register">
          Забронировать
        </Link>
      </div>
      <div className={s.heroImage}>
        <Image
          alt="Бронирование кортов"
          className={s.heroImageDesktop}
          fill
          priority
          sizes="(max-width: 860px) 100vw, 50vw"
          src="/images/hero/desktop.jpg"
        />
        <Image
          alt="Бронирование кортов"
          className={s.heroImageMobile}
          fill
          priority
          sizes="100vw"
          src="/images/hero/mobile.jpg"
        />
      </div>
    </section>
  );
}
