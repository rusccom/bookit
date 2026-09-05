"use client";

import { useEffect, useRef, useState } from "react";

export function useVisibility() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => observeVisibility(ref.current, setVisible), []);
  return { ref, visible };
}

function observeVisibility(element: HTMLDivElement | null, setVisible: (value: boolean) => void) {
  if (!element) return;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) setVisible(true);
  }, { threshold: 0.3 });
  observer.observe(element);
  return () => observer.disconnect();
}
