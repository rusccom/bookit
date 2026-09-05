import type { OwnerBookingTab } from "./ownerBookingPresentation";
import shared from "./dashboardShared.module.css";

const TABS: Array<{ label: string; value: OwnerBookingTab }> = [
  { label: "Предстоящие", value: "upcoming" }, { label: "Прошедшие", value: "past" },
  { label: "Отменённые", value: "cancelled" }
];

type Props = { active: OwnerBookingTab; onChange: (value: OwnerBookingTab) => void };

export function OwnerBookingTabs(props: Props) {
  return <div className={shared.filterTabs}>
    {TABS.map((tab) => {
      const cls = props.active === tab.value ? `${shared.filterTab} ${shared.filterTabActive}` : shared.filterTab;
      return <button key={tab.value} className={cls} onClick={() => props.onChange(tab.value)} type="button">{tab.label}</button>;
    })}
  </div>;
}
