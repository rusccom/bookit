import { registrationSchema } from "@/features/auth/server/authSchema";
import {
  createProvider,
  createUser,
  findUserByEmail,
  findUserByPhone,
  findUserWithPassword,
  upsertTelegramCustomer
} from "@/features/auth/server/authRepository";
import type { AuthUser } from "@/features/auth/server/authTypes";
import { hashPassword, verifyPassword } from "@/features/auth/server/password";
import { normalizePhone } from "@/features/shared/server/phone";

type RegistrationInput = {
  email: string;
  fullName: string;
  password: string;
  phone: string;
  providerTitle?: string;
  role: AuthUser["role"];
};

export async function registerUser(input: RegistrationInput) {
  const parsed = registrationSchema.parse({
    ...input,
    phone: normalizePhone(input.phone)
  });

  const existing = await findUserByEmail(parsed.email);
  const phoneOwner = await findUserByPhone(parsed.phone);

  if (existing) {
    throw new Error("Email already registered");
  }

  if (phoneOwner) {
    throw new Error("Phone already registered");
  }

  const passwordHash = await hashPassword(parsed.password);
  const user = await createUser({
    email: parsed.email,
    fullName: parsed.fullName,
    passwordHash,
    phone: parsed.phone,
    role: parsed.role
  });

  if (parsed.role === "owner") {
    await createProvider({
      ownerUserId: user.id,
      title: parsed.providerTitle || `${parsed.fullName} Booking`
    });
  }

  return user;
}

export async function loginUser(input: {
  email: string;
  password: string;
}) {
  const candidate = await findUserWithPassword(input.email);

  if (!candidate?.passwordHash) {
    throw new Error("Invalid credentials");
  }

  const isValid = await verifyPassword({
    hash: candidate.passwordHash,
    password: input.password
  });

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return candidate.user;
}

export async function registerTelegramCustomer(input: {
  fullName: string;
  phone: string;
}) {
  return upsertTelegramCustomer({
    fullName: input.fullName,
    phone: normalizePhone(input.phone)
  });
}
