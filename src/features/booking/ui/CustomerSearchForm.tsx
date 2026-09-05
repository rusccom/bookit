import s from "./customerSearchForm.module.css";
import { getTodayIso } from "@/features/shared/server/dateTime";
import { CustomerSearchControls } from "./CustomerSearchControls";
import type { CustomerSearchValues } from "./customerSearchTypes";

type CustomerSearchFormProps = {
  cities: string[];
  values: CustomerSearchValues;
};

export function CustomerSearchForm(props: CustomerSearchFormProps) {
  return <form className={`panel form-grid ${s.searchForm}`} method="GET">
      <div className={s.header}><div><p className="eyebrow">Поиск по расписанию</p><h2>Когда хотите играть?</h2></div><span>Бронирование подтверждается сразу</span></div>
      <CustomerSearchControls cities={props.cities} today={getTodayIso()} values={props.values} />
    </form>;
}
