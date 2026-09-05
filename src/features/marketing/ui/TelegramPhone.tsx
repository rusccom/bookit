import { TelegramChatBody } from "./TelegramChatBody";
import { TelegramHeader } from "./TelegramHeader";
import { TelegramInput } from "./TelegramInput";
import s from "./landingBot.module.css";

type Props = { showTyping: boolean; visible: number };

export function TelegramPhone(props: Props) {
  return <div className={s.phone}>
    <div className={s.phoneNotch} />
    <TelegramHeader showTyping={props.showTyping} />
    <TelegramChatBody showTyping={props.showTyping} visible={props.visible} />
    <TelegramInput />
  </div>;
}
