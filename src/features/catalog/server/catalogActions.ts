'use server';

import { redirect } from "next/navigation";

import { requireUser } from "@/features/auth/server/requireUser";
import { readCourtFormData } from "@/features/catalog/server/catalogFormData";
import {
  createOwnerUnit,
  toggleOwnerUnit,
  updateOwnerUnit
} from "@/features/catalog/server/catalogService";
import { getErrorMessage } from "@/features/shared/server/errors";
import { readFormFlag, readFormText } from "@/features/shared/server/formData";

const UNITS_PATH = "/dashboard/owner/units";

export async function createOwnerUnitAction(formData: FormData) {
  const owner = await requireUser("owner");
  let target = `${UNITS_PATH}?success=unit-created`;
  try {
    await createOwnerUnit({ ...readCourtFormData(formData), ownerUserId: owner.id });
  } catch (error) {
    target = errorTarget(error);
  }
  redirect(target);
}

export async function updateOwnerUnitAction(formData: FormData) {
  const owner = await requireUser("owner");
  let target = `${UNITS_PATH}?success=unit-updated`;
  try {
    await updateOwnerUnit({ ...readCourtFormData(formData), ownerUserId: owner.id, unitId: readFormText(formData, "unitId") });
  } catch (error) {
    target = errorTarget(error);
  }
  redirect(target);
}

export async function toggleOwnerUnitAction(formData: FormData) {
  const owner = await requireUser("owner");
  let target = `${UNITS_PATH}?success=unit-status-updated`;
  try {
    await toggleOwnerUnit({ active: readFormFlag(formData, "active"), ownerUserId: owner.id, unitId: readFormText(formData, "unitId") });
  } catch (error) {
    target = errorTarget(error);
  }
  redirect(target);
}

function errorTarget(error: unknown) {
  const message = getErrorMessage(error, "Не удалось сохранить корт");
  return `${UNITS_PATH}?error=${encodeURIComponent(message)}`;
}
