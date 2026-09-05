import styles from "./auth.module.css";

type Props = { description?: string; eyebrow?: string; highlights: string[]; title: string };

export function AuthIntro(props: Props) {
  return <article className={styles.intro}>
    {props.eyebrow && <p className={styles.eyebrow}>{props.eyebrow}</p>}
    <h1>{props.title}</h1>
    {props.description && <p className={styles.description}>{props.description}</p>}
    <ul className={styles.highlightList}>
      {props.highlights.map((item) => <li key={item} className={styles.highlightItem}>{item}</li>)}
    </ul>
  </article>;
}
