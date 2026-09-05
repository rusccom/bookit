import s from "./landingBot.module.css";

export function TelegramChecks() {
  return <svg className={s.checks} viewBox="0 0 16 11" fill="none">
    <path d="M11.5 .5l-5 7.5L4 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.5 .5l-5 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
