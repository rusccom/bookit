"use client";

import { useState } from "react";
import s from "./landingFaq.module.css";

export function FaqItem(props: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return <div className={`${s.item} ${open ? s.itemOpen : ""}`}>
    <button className={s.question} type="button" onClick={() => setOpen(!open)}>
      <span>{props.q}</span><span className={s.icon}>{open ? "−" : "+"}</span>
    </button>
    {open && <p className={s.answer}>{props.a}</p>}
  </div>;
}
