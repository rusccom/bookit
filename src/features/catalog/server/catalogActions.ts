'use server';

import { redirect } from "next/navigation";

import { createOwnerUnit } from "@/features/catalog/server/catalogService";
import { requireUser } from "@/features/auth/server/requireUser";

export async function createOwnerUnitAction(formData: FormData) {
  const owner = await requireUser("owner");
  let target = "/dashboard/owner";

  try {
    await createOwnerUnit({
      address: String(formData.get("address") || ""),
      city: String(formData.get("city") || ""),
      days: getDays(formData),
      endTime: String(formData.get("endTime") || ""),
      kind: String(formData.get("kind") || "tennis_court"),
      ownerUserId: owner.id,
      startTime: String(formData.get("startTime") || ""),
      title: String(formData.get("title") || ""),
      venueTitle: String(formData.get("venueTitle") || "")
    });
    target = "/dashboard/owner?success=unit-created";
  } catch (error) {
    target = `/dashboard/owner?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(target);
}

function getDays(formData: FormData): number[] {
  return formData
    .getAll("days")
    .map((item) => Number(item))
    .filter(Number.isInteger);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected error";
}
