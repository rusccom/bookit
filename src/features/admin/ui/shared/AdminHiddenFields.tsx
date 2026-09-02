export function AdminHiddenFields({ values }: { values: Record<string, string> }) {
  return <>{Object.entries(values).map(([name, value]) => <input key={name} name={name} type="hidden" value={value} />)}</>;
}
