import s from "./landingBot.module.css";

export function TelegramHeader({ showTyping }: { showTyping: boolean }) {
  return <div className={s.tgHeader}>
    <svg className={s.tgBack} viewBox="0 0 24 24" fill="none">
      <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className={s.tgAvatar}>B</span>
    <div className={s.tgInfo}>
      <span className={s.tgName}>BookCort Bot</span><span className={s.tgStatus}>{showTyping ? "печатает..." : "bot"}</span>
    </div>
    <svg className={s.tgDots} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="6" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  </div>;
}
