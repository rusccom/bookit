import s from "./landingBot.module.css";

export function TelegramInput() {
  return <div className={s.tgInput}>
    <svg className={s.tgClip} viewBox="0 0 24 24" fill="none">
      <path d="M21.44 11.05l-9.19 9.19a5.64 5.64 0 01-7.98-7.98l9.19-9.19a3.76 3.76 0 015.32 5.32L9.6 17.57a1.88 1.88 0 01-2.66-2.66l8.38-8.39" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className={s.tgPlaceholder}>Сообщение</span>
    <svg className={s.tgMic} viewBox="0 0 24 24" fill="none">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>;
}
