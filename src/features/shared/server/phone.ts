const BELARUS_PHONE = /^\+375(25|29|33|44)\d{7}$/;

export function normalizeBelarusPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

export function isBelarusPhoneValid(value: string): boolean {
  return BELARUS_PHONE.test(value);
}

export function formatBelarusPhone(value: string | null): string {
  if (!value) return "";
  const normalized = normalizeBelarusPhone(value);
  if (!isBelarusPhoneValid(normalized)) return value;
  return `${normalized.slice(0, 4)} ${normalized.slice(4, 6)} ${normalized.slice(6, 9)} ${normalized.slice(9, 11)} ${normalized.slice(11)}`;
}
