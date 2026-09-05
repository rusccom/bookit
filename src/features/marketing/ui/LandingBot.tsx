"use client";

import s from "./landingBot.module.css";
import shared from "./landing.module.css";
import { BotCapabilityList } from "./BotCapabilityList";
import { TelegramPhone } from "./TelegramPhone";
import { useAutoChat } from "./useAutoChat";

export function LandingBot() {
  const { visible, showTyping, sectionRef } = useAutoChat();
  return <section ref={sectionRef} className={shared.section}>
      <div className={`${shared.sectionHeader} ${shared.sectionHeaderCentered}`}>
        <h2>Всё через Telegram. Сайт не нужен.</h2>
        <p>Регистрация, поиск свободного времени и подтверждение брони — прямо в мессенджере.</p>
      </div>
      <div className={s.layout}>
        <BotCapabilityList /><TelegramPhone showTyping={showTyping} visible={visible} />
      </div>
    </section>;
}
