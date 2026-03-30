import Link from "next/link";

const cards = [
  {
    badge: "Для гостей",
    cta: "Хочу бронировать",
    description:
      "Подходит тем, кто хочет быстро находить корты, студии, залы и другие пространства под аренду.",
    href: "/register/guest",
    title: "Ищу свободное место под тренировку, встречу или событие"
  },
  {
    badge: "Для владельцев",
    cta: "Сдаю пространство",
    description:
      "Подходит тем, у кого уже есть площадка или объект и нужен понятный поток бронирований.",
    href: "/register/host",
    title: "Открываю своё пространство для гостей и расписания"
  }
];

export function RegisterChoiceGrid() {
  return (
    <div className="auth-choice-grid">
      {cards.map((card) => (
        <Link key={card.href} className="role-card" href={card.href}>
          <span className="role-card-badge">{card.badge}</span>
          <h2>{card.title}</h2>
          <p>{card.description}</p>
          <span className="role-card-cta">{card.cta}</span>
        </Link>
      ))}
    </div>
  );
}
