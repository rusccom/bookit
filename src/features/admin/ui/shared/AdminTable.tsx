import type { Key, ReactNode } from "react";

import { AdminEmptyState } from "./AdminEmptyState";
import styles from "./adminUi.module.css";

export type AdminColumn<T> = { key: string; label: string; render: (item: T) => ReactNode };
type AdminTableProps<T> = {
  items: T[];
  columns: AdminColumn<T>[];
  rowKey: (item: T) => Key;
  emptyMessage: string;
  caption: string;
};

export function AdminTable<T>({ items, columns, rowKey, emptyMessage, caption }: AdminTableProps<T>) {
  if (!items.length) return <AdminEmptyState>{emptyMessage}</AdminEmptyState>;
  return <div className={styles.tableFrame} tabIndex={0} role="region" aria-label={caption}>
    <table className={styles.table}>
      <caption className={styles.visuallyHidden}>{caption}</caption>
      <thead><tr>{columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead>
      <tbody>{items.map((item) => <tr key={rowKey(item)}>
        {columns.map((column) => <td key={column.key}>{column.render(item)}</td>)}
      </tr>)}</tbody>
    </table>
  </div>;
}
