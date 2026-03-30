import Link from "next/link";

export function HomeCta() {
  return (
    <section className="cta-band">
      <div>
        <p className="eyebrow">Старт</p>
        <h2>Если нужен современный вход в аренду, он уже готов к росту</h2>
        <p>Начните с выбора роли: искать свободные пространства или открывать своё расписание для гостей.</p>
      </div>
      <div className="hero-actions">
        <Link className="primary-link" href="/register">Выбрать сценарий регистрации</Link>
        <Link className="secondary-link" href="/login">У меня уже есть аккаунт</Link>
      </div>
    </section>
  );
}
