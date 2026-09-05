export function readFormText(formData: FormData, name: string) {
  return String(formData.get(name) || "");
}

export function readFormNumber(formData: FormData, name: string) {
  const value = readFormText(formData, name).trim();
  return value ? Number(value) : Number.NaN;
}

export function readFormFlag(formData: FormData, name: string) {
  return formData.get(name) === "true";
}

export function createFormParams(formData: FormData, fields: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [param, field] of Object.entries(fields)) {
    params.set(param, readFormText(formData, field));
  }
  return params;
}
