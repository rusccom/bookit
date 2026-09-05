const OPERATOR_CODES = ["25", "29", "33", "44"] as const;
const OPERATOR_GROUP = `(${OPERATOR_CODES.join("|")})`;
const BELARUS_PHONE = new RegExp(`^\\+375${OPERATOR_GROUP}\\d{7}$`);

export const BELARUS_PHONE_CODES = `${OPERATOR_CODES.slice(0, -1).join(", ")} или ${OPERATOR_CODES.at(-1)}`;
export const BELARUS_PHONE_EXAMPLE = "+375 29 123 45 67";
export const BELARUS_PHONE_FORMAT = "+375 XX XXX XX XX";
export const BELARUS_PHONE_INPUT_PATTERN = `\\+375 ${OPERATOR_GROUP} [0-9]{3} [0-9]{2} [0-9]{2}`;
export const BELARUS_PHONE_VALIDATION_MESSAGE = `Телефон должен быть в формате ${BELARUS_PHONE_FORMAT} с кодом ${BELARUS_PHONE_CODES}`;

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
  return formatLocalDigits(normalized.slice(4));
}

export function formatBelarusPhoneInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const local = (digits.startsWith("375") ? digits.slice(3) : digits).slice(0, 9);
  return formatLocalDigits(local);
}

function formatLocalDigits(local: string) {
  const parts = [local.slice(0, 2), local.slice(2, 5), local.slice(5, 7), local.slice(7, 9)];
  return `+375 ${parts.filter(Boolean).join(" ")}`;
}
