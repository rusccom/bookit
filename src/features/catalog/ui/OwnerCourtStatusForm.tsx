"use client";

import { toggleOwnerUnitAction } from "@/features/catalog/server/catalogActions";
import type { OwnerUnit } from "@/features/catalog/server/catalogTypes";

export function OwnerCourtStatusForm({ unit }: { unit: OwnerUnit }) {
  const nextActive = !unit.isActive;
  return <form action={toggleOwnerUnitAction} onSubmit={(event) => confirmChange(event, nextActive)}>
    <input name="unitId" type="hidden" value={unit.unitId} />
    <input name="active" type="hidden" value={String(nextActive)} />
    <button className="ghost-button" type="submit">{nextActive ? "Включить приём броней" : "Приостановить бронирование"}</button>
  </form>;
}

function confirmChange(event: React.FormEvent<HTMLFormElement>, nextActive: boolean) {
  if (nextActive) return;
  if (!window.confirm("Приостановить новые бронирования этого корта? Уже созданные брони сохранятся.")) event.preventDefault();
}
