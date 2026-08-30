"use client";

import { useState } from "react";

import { formatBelarusPhone } from "@/features/shared/server/phone";

type BelarusPhoneInputProps = {
  className?: string;
  defaultValue?: string | null;
  required?: boolean;
};

export function BelarusPhoneInput(props: BelarusPhoneInputProps) {
  const [value, setValue] = useState(formatBelarusPhone(props.defaultValue || ""));
  return <input autoComplete="tel" className={props.className} inputMode="tel" maxLength={19} name="phone" onChange={(event) => setValue(formatInput(event.target.value))} pattern="\+375 (25|29|33|44) [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+375 29 123 45 67" required={props.required} title="Формат: +375 XX XXX XX XX. Коды: 25, 29, 33, 44" value={value} />;
}

function formatInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const local = (digits.startsWith("375") ? digits.slice(3) : digits).slice(0, 9);
  const parts = [local.slice(0, 2), local.slice(2, 5), local.slice(5, 7), local.slice(7, 9)];
  return `+375 ${parts.filter(Boolean).join(" ")}`;
}
