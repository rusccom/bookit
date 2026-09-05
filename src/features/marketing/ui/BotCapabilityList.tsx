import { CAPABILITIES } from "./botChatData";
import s from "./landingBot.module.css";

export function BotCapabilityList() {
  return <ul className={s.capabilities}>
    {CAPABILITIES.map((item) => <li key={item.title} className={s.capItem}>
      <span className={s.capIcon}>{item.icon}</span>
      <div className={s.capContent}>
        <strong className={s.capTitle}>{item.title}</strong><span className={s.capText}>{item.text}</span>
      </div>
    </li>)}
  </ul>;
}
