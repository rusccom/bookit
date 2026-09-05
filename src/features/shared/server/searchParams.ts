export type SearchParam = string | string[] | undefined;
export type SearchParams = Record<string, SearchParam>;

export function getSearchParam(value: SearchParam) {
  return (Array.isArray(value) ? value[0] : value) || "";
}
