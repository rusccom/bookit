import Link from "next/link";

export function AudienceSection() {
  return (
    <section className="panel section-block" id="audience">
      <div className="section-heading">
        <p className="eyebrow">Для кого</p>
        <h2>Два сценария внутри одного продукта</h2>
      </div>
      <div className="audience-grid">
        <article className="audience-card">
          <h3>Гость</h3>
          <p>Если вы хотите снять корт, зал, студию или другое пространство, Bookit помогает дойти от выбора до брони без лишнего трения.</p>
          <Link className="secondary-link" href="/register/guest">Создать аккаунт гостя</Link>
        </article>
        <article className="audience-card">
          <h3>Владелец пространства</h3>
          <p>Если у вас есть объект под аренду, Bookit собирает расписание, брони и рабочий кабинет в одной системе.</p>
          <Link className="primary-link" href="/register/host">Открыть кабинет владельца</Link>
        </article>
      </div>
    </section>
  );
}
