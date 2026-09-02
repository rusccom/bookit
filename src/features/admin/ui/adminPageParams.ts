export type AdminPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export function getAdminParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) || "";
}
