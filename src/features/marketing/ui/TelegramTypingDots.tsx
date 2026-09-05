import s from "./landingBot.module.css";

export function TelegramTypingDots() {
  return <div className={s.rowBot}>
    <span className={s.msgAvatar}>B</span>
    <div className={`${s.bubbleBot} ${s.typing}`}><span className={s.dot} /><span className={s.dot} /><span className={s.dot} /></div>
  </div>;
}
