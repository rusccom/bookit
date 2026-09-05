import Link from "next/link";
import styles from "./auth.module.css";

type Props = { option: { href: string; label: string; points: string[]; text: string; title: string } };

export function RegisterChoiceCard({ option }: Props) {
  return <Link className={styles.choiceCard} href={option.href}>
    <span className={styles.choiceBadge}>{option.label}</span>
    <h2>{option.title}</h2><p>{option.text}</p>
    <ul className={styles.choiceList}>{option.points.map((point) => <li key={point}>{point}</li>)}</ul>
    <span className={styles.choiceAction}>Открыть форму</span>
  </Link>;
}
