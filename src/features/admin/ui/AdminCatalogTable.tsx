import type { AdminCatalogRecord } from "@/features/admin/server/adminTypes";
import { CatalogToggleForm } from "@/features/admin/ui/CatalogToggleForm";
import { EditCatalogButton } from "@/features/admin/ui/EditCatalogButton";

import styles from "./adminDataTable.module.css";

type AdminCatalogTableProps = { city: string; items: AdminCatalogRecord[]; search: string; status: string };

export function AdminCatalogTable(props: AdminCatalogTableProps) {
  if (!props.items.length) return <div className={styles.empty}>Объекты и корты не найдены.</div>;
  return <div className={styles.tableFrame}><table><thead><tr><th>Объект</th><th>Корт</th><th>Владелец</th><th>Статус</th><th>Управление</th></tr></thead><tbody>{props.items.map((item) => <tr key={item.unitId}><td><strong>{item.venueTitle}</strong><span>{item.city}, {item.address}</span></td><td>{item.unitTitle}</td><td>{item.ownerName}</td><td><b className={item.isVenueActive && item.isUnitActive ? styles.successBadge : styles.dangerBadge}>{item.isVenueActive && item.isUnitActive ? "Активен" : "Отключён"}</b></td><td><div className={styles.rowActions}><EditCatalogButton city={props.city} item={item} search={props.search} status={props.status} /><CatalogToggleForm active={item.isUnitActive} city={props.city} entityId={item.unitId} entityType="unit" search={props.search} status={props.status} /><CatalogToggleForm active={item.isVenueActive} city={props.city} entityId={item.venueId} entityType="venue" search={props.search} status={props.status} /></div></td></tr>)}</tbody></table></div>;
}
