import { showcaseCards } from "@/features/marketing/content/homeContent";

export function ShowcaseSection() {
  return (
    <section className="panel section-block" id="scenarios">
      <div className="section-heading">
        <p className="eyebrow">Примеры</p>
        <h2>Что можно вести через Bookit</h2>
      </div>
      <div className="showcase-grid">
        {showcaseCards.map((card) => <article key={card.title} className="story-card"><h3>{card.title}</h3><p>{card.description}</p></article>)}
      </div>
    </section>
  );
}
