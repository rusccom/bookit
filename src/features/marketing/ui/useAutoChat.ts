"use client";

import { useEffect, useRef, useState } from "react";
import { CHAT_MESSAGES } from "./botChatData";

type ChatState = {
  setTyping: (value: boolean) => void;
  setVisible: (value: number) => void;
  timers: number[];
};

export function useAutoChat() {
  const [visible, setVisible] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => observeChat(sectionRef.current, { setTyping: setShowTyping, setVisible, timers: [] }), []);
  return { visible, showTyping, sectionRef };
}

function observeChat(element: HTMLElement | null, state: ChatState) {
  if (!element) return;
  let started = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || started) return;
    started = true;
    schedule(state, () => showNext(state, 0), 600);
  }, { threshold: 0.25 });
  observer.observe(element);
  return () => {
    observer.disconnect();
    state.timers.forEach(clearTimeout);
  };
}

function showNext(state: ChatState, index: number) {
  if (index >= CHAT_MESSAGES.length) return;
  const message = CHAT_MESSAGES[index];
  if (message.from === "bot") {
    state.setTyping(true);
    schedule(state, () => revealBotMessage(state, index), 1400);
    return;
  }
  state.setVisible(index + 1);
  schedule(state, () => showNext(state, index + 1), 900);
}

function revealBotMessage(state: ChatState, index: number) {
  state.setTyping(false);
  state.setVisible(index + 1);
  schedule(state, () => showNext(state, index + 1), 1200);
}

function schedule(state: ChatState, action: () => void, delay: number) {
  state.timers.push(window.setTimeout(action, delay));
}
