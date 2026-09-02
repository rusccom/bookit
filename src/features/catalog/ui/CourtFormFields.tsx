import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";
import { CourtCommercialFields } from "@/features/catalog/ui/CourtCommercialFields";
import { CourtIdentityFields } from "@/features/catalog/ui/CourtIdentityFields";
import { CourtLocationFields } from "@/features/catalog/ui/CourtLocationFields";
import { CourtSlotField } from "@/features/catalog/ui/CourtSlotField";
import { WeeklyScheduleFields } from "@/features/catalog/ui/WeeklyScheduleFields";

export function CourtFormFields({ unit }: { unit?: OwnerUnit }) {
  return <>
    <CourtLocationFields unit={unit} />
    <CourtIdentityFields unit={unit} />
    <CourtCommercialFields unit={unit} />
    <CourtSlotField unit={unit} />
    <WeeklyScheduleFields unit={unit} />
  </>;
}
