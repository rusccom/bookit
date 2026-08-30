import { z } from "zod";

import {
  isBelarusPhoneValid,
  normalizeBelarusPhone
} from "@/features/shared/server/phone";

export const belarusPhoneSchema = z.string().trim()
  .transform(normalizeBelarusPhone)
  .refine(isBelarusPhoneValid, "Телефон должен быть в формате +375 XX XXX XX XX с кодом 25, 29, 33 или 44");

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
