import type { ChatMsg } from "./botChatData";
import { TelegramChecks } from "./TelegramChecks";
import s from "./landingBot.module.css";

export function TelegramMessage({ message }: { message: ChatMsg }) {
  const user = message.from === "user";
  return <div className={`${user ? s.rowUser : s.rowBot} ${s.msgAppear}`}>
    {!user && <span className={s.msgAvatar}>B</span>}
    <div className={user ? s.bubbleUser : s.bubbleBot}>
      <span className={s.bubbleText}>{message.text}</span>
      <span className={s.meta}><span className={s.time}>{message.time}</span>{user && <TelegramChecks />}</span>
    </div>
  </div>;
}
