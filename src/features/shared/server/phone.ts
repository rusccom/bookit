export function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

export function isPhoneValid(value: string): boolean {
  return /^\+?\d{10,15}$/.test(value);
}
