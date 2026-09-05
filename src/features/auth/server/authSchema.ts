import { z } from "zod";

import {
  BELARUS_PHONE_VALIDATION_MESSAGE,
  isBelarusPhoneValid,
  normalizeBelarusPhone
} from "@/features/shared/phone";

export const belarusPhoneSchema = z.string().trim()
  .transform(normalizeBelarusPhone)
  .refine(isBelarusPhoneValid, BELARUS_PHONE_VALIDATION_MESSAGE);

export const registrationSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  password: z.string().min(8),
  phone: belarusPhoneSchema,
  providerTitle: z.string().optional(),
  role: z.enum(["customer", "owner"])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
