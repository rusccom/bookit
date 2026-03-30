type AuthFrameProps = {
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  footer?: React.ReactNode;
  highlights: string[];
  sideTitle: string;
  title: string;
};

export function AuthFrame(props: AuthFrameProps) {
  return (
    <div className="auth-layout">
      <section className="panel auth-side">
        <p className="eyebrow">{props.eyebrow}</p>
        <h1>{props.title}</h1>
        <p className="lead">{props.description}</p>
        <div className="auth-note">
          <h2>{props.sideTitle}</h2>
          <ul className="feature-list">{props.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        {props.footer}
      </section>
      <div className="stack">{props.children}</div>
    </div>
  );
}
