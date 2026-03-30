import { z } from "zod";

export const registrationSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  password: z.string().min(8),
  phone: z.string().min(10),
  providerTitle: z.string().optional(),
  role: z.enum(["customer", "owner"])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
