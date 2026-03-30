import { z } from "zod";

import {
  createUnitWithRules,
  listDistinctCities,
  listOwnerUnits,
  listSearchUnits
} from "@/features/catalog/server/catalogRepository";
import { parseTimeLabel } from "@/features/shared/server/dateTime";

const createUnitSchema = z.object({
  address: z.string().min(3),
  city: z.string().min(2),
  days: z.array(z.number().int().min(0).max(6)).min(1),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  kind: z.string().min(2),
  ownerUserId: z.string().uuid(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  title: z.string().min(2),
  venueTitle: z.string().min(2)
});

export async function createOwnerUnit(input: z.input<typeof createUnitSchema>) {
  const parsed = createUnitSchema.parse(input);
  const startMinutes = parseTimeLabel(parsed.startTime);
  const endMinutes = parseTimeLabel(parsed.endTime);

  if (startMinutes >= endMinutes) {
    throw new Error("Working hours are invalid");
  }

  await createUnitWithRules({
    address: parsed.address,
    city: parsed.city,
    days: parsed.days,
    endMinutes,
    kind: parsed.kind,
    ownerUserId: parsed.ownerUserId,
    startMinutes,
    title: parsed.title,
    venueTitle: parsed.venueTitle
  });
}

export async function getOwnerUnits(ownerUserId: string) {
  return listOwnerUnits(ownerUserId);
}

export async function getCityOptions() {
  return listDistinctCities();
}

export async function searchUnits(input: {
  city: string;
  venueQuery?: string;
}) {
  return listSearchUnits(input);
}
