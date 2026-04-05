"use client";

import { useEffect, useRef, useState } from "react";

import { CAPABILITIES, CHAT_MESSAGES } from "./botChatData";
import s from "./landingBot.module.css";
import shared from "./landing.module.css";

function Checks() {
  return (
    <svg className={s.checks} viewBox="0 0 16 11" fill="none">
      <path d="M11.5 .5l-5 7.5L4 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 .5l-5 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TypingDots() {
  return (
    <div className={s.rowBot}>
      <span className={s.msgAvatar}>B</span>
      <div className={`${s.bubbleBot} ${s.typing}`}>
        <span className={s.dot} />
        <span className={s.dot} />
        <span className={s.dot} />
      </div>
    </div>
  );
}

function useAutoChat() {
  const [visible, setVisible] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          runSequence();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  });

  function runSequence() {
    let i = 0;
    function next() {
      if (i >= CHAT_MESSAGES.length) {
        setTimeout(() => {
          setVisible(0);
          setShowTyping(false);
          startedRef.current = false;
        }, 4000);
        return;
      }
      const msg = CHAT_MESSAGES[i];
      const isBot = msg.from === "bot";

      if (isBot) {
        setShowTyping(true);
        setTimeout(() => {
          setShowTyping(false);
          i++;
          setVisible(i);
          setTimeout(next, 1200);
        }, 1400);
      } else {
        i++;
        setVisible(i);
        setTimeout(next, 900);
      }
    }
    setTimeout(next, 600);
  }

  return { visible, showTyping, sectionRef };
}

export function LandingBot() {
  const { visible, showTyping, sectionRef } = useAutoChat();
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visible, showTyping]);

  return (
    <section ref={sectionRef} className={shared.section}>
      <div className={`${shared.sectionHeader} ${shared.sectionHeaderCentered}`}>
        <h2>Всё через Telegram. Сайт не нужен.</h2>
        <p>
          Бот — полноценная замена платформы. Регистрация, поиск,
          бронирование и напоминания — прямо в мессенджере.
        </p>
      </div>

      <div className={s.layout}>
        <ul className={s.capabilities}>
          {CAPABILITIES.map((item) => (
            <li key={item.title} className={s.capItem}>
              <span className={s.capIcon}>{item.icon}</span>
              <div className={s.capContent}>
                <strong className={s.capTitle}>{item.title}</strong>
                <span className={s.capText}>{item.text}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className={s.phone}>
          <div className={s.phoneNotch} />
          <div className={s.tgHeader}>
            <svg className={s.tgBack} viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={s.tgAvatar}>B</span>
            <div className={s.tgInfo}>
              <span className={s.tgName}>BookCort Bot</span>
              <span className={s.tgStatus}>
                {showTyping ? "печатает..." : "bot"}
              </span>
            </div>
            <svg className={s.tgDots} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="6" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="18" r="1.5" fill="currentColor" />
            </svg>
          </div>

          <div ref={bodyRef} className={s.tgBody}>
            {CHAT_MESSAGES.slice(0, visible).map((msg, i) => (
              <div
                key={i}
                className={`${msg.from === "user" ? s.rowUser : s.rowBot} ${s.msgAppear}`}
              >
                {msg.from === "bot" && <span className={s.msgAvatar}>B</span>}
                <div className={msg.from === "user" ? s.bubbleUser : s.bubbleBot}>
                  <span className={s.bubbleText}>{msg.text}</span>
                  <span className={s.meta}>
                    <span className={s.time}>{msg.time}</span>
                    {msg.from === "user" && <Checks />}
                  </span>
                </div>
              </div>
            ))}
            {showTyping && <TypingDots />}
          </div>

          <div className={s.tgInput}>
            <svg className={s.tgClip} viewBox="0 0 24 24" fill="none">
              <path d="M21.44 11.05l-9.19 9.19a5.64 5.64 0 01-7.98-7.98l9.19-9.19a3.76 3.76 0 015.32 5.32L9.6 17.57a1.88 1.88 0 01-2.66-2.66l8.38-8.39" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={s.tgPlaceholder}>Сообщение</span>
            <svg className={s.tgMic} viewBox="0 0 24 24" fill="none">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
