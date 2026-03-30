import { workflowSteps } from "@/features/marketing/content/homeContent";

export function HowItWorksSection() {
  return (
    <section className="panel section-block" id="how-it-works">
      <div className="section-heading">
        <p className="eyebrow">Как это работает</p>
        <h2>Прямой маршрут от интереса до бронирования</h2>
      </div>
      <ol className="ordered-list timeline-list">
        {workflowSteps.map((step) => <li key={step}>{step}</li>)}
      </ol>
    </section>
  );
}
