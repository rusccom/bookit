"use client";

import { useEffect, useRef } from "react";
import { CHAT_MESSAGES } from "./botChatData";
import { TelegramMessage } from "./TelegramMessage";
import { TelegramTypingDots } from "./TelegramTypingDots";
import s from "./landingBot.module.css";

type Props = { showTyping: boolean; visible: number };

export function TelegramChatBody(props: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [props.visible, props.showTyping]);
  return <div ref={bodyRef} className={s.tgBody}>
    {CHAT_MESSAGES.slice(0, props.visible).map((message, index) => <TelegramMessage key={index} message={message} />)}
    {props.showTyping && <TelegramTypingDots />}
  </div>;
}
