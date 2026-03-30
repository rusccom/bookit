import { capabilityCards } from "@/features/marketing/content/homeContent";

export function CapabilitySection() {
  return (
    <section className="panel section-block" id="benefits">
      <div className="section-heading">
        <p className="eyebrow">Преимущества</p>
        <h2>Платформа, которая одинаково понятна гостю и владельцу</h2>
      </div>
      <div className="feature-card-grid">
        {capabilityCards.map((card) => <article key={card.title} className="feature-card"><h3>{card.title}</h3><p>{card.description}</p></article>)}
      </div>
    </section>
  );
}
