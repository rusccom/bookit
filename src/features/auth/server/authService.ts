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

export type PreparedRegistration = {
  email: string;
  fullName: string;
  passwordHash: string;
  phone: string;
  providerTitle?: string;
  role: AuthUser["role"];
};

export async function registerUser(input: RegistrationInput) {
  const prepared = await prepareRegistration(input);
  return registerPreparedUser(prepared);
}

export async function prepareRegistration(input: RegistrationInput) {
  const parsed = registrationSchema.parse({
    ...input,
    phone: normalizePhone(input.phone)
  });

  await assertRegistrationAvailable(parsed.email, parsed.phone);

  return {
    email: parsed.email,
    fullName: parsed.fullName,
    passwordHash: await hashPassword(parsed.password),
    phone: parsed.phone,
    providerTitle: parsed.providerTitle,
    role: parsed.role
  } satisfies PreparedRegistration;
}

export async function registerPreparedUser(input: PreparedRegistration) {
  await assertRegistrationAvailable(input.email, input.phone);

  const user = await createUser({
    email: input.email,
    fullName: input.fullName,
    passwordHash: input.passwordHash,
    phone: input.phone,
    role: input.role
  });

  if (input.role === "owner") {
    await createProvider({
      ownerUserId: user.id,
      title: input.providerTitle || `${input.fullName} Booking`
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

async function assertRegistrationAvailable(email: string, phone: string) {
  const existing = await findUserByEmail(email);
  const phoneOwner = await findUserByPhone(phone);

  if (existing) {
    throw new Error("Email already registered");
  }

  if (phoneOwner) {
    throw new Error("Phone already registered");
  }
}
