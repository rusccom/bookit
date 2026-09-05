"use client";

import { useState } from "react";

import {
  BELARUS_PHONE_CODES,
  BELARUS_PHONE_EXAMPLE,
  BELARUS_PHONE_FORMAT,
  BELARUS_PHONE_INPUT_PATTERN,
  formatBelarusPhone,
  formatBelarusPhoneInput
} from "@/features/shared/phone";

type BelarusPhoneInputProps = {
  className?: string;
  defaultValue?: string | null;
  required?: boolean;
};

export function BelarusPhoneInput(props: BelarusPhoneInputProps) {
  const [value, setValue] = useState(formatBelarusPhone(props.defaultValue || ""));
  const title = `Формат: ${BELARUS_PHONE_FORMAT}. Коды: ${BELARUS_PHONE_CODES}`;
  return <input autoComplete="tel" className={props.className} inputMode="tel" maxLength={19} name="phone" onChange={(event) => setValue(formatBelarusPhoneInput(event.target.value))} pattern={BELARUS_PHONE_INPUT_PATTERN} placeholder={BELARUS_PHONE_EXAMPLE} required={props.required} title={title} value={value} />;
}
