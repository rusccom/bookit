import {
  belarusPhoneSchema,
  registrationSchema
} from "@/features/auth/server/authSchema";
import {
  createUserAccount,
  findUserByEmail,
  findUserByPhone,
  findUserWithPassword,
  upsertTelegramCustomer
} from "@/features/auth/server/authRepository";
import type { AuthUser } from "@/features/auth/server/authTypes";
import { hashPassword, verifyPassword } from "@/features/auth/server/password";

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
  const parsed = registrationSchema.parse(input);

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

  return createUserAccount({
    email: input.email,
    fullName: input.fullName,
    passwordHash: input.passwordHash,
    phone: input.phone,
    providerTitle: input.role === "owner"
      ? input.providerTitle || `${input.fullName} Booking` : undefined,
    role: input.role
  });
}

export async function loginUser(input: {
  email: string;
  password: string;
}) {
  const candidate = await findUserWithPassword(input.email);
  assertLoginCandidate(candidate);
  const valid = await verifyPassword({
    hash: candidate.passwordHash,
    password: input.password
  });
  if (!valid) throw new Error("Неверный email или пароль");
  return candidate.user;
}

export async function registerTelegramCustomer(input: {
  fullName: string;
  phone: string;
}) {
  const user = await upsertTelegramCustomer({
    fullName: input.fullName,
    phone: belarusPhoneSchema.parse(input.phone)
  });
  if (user.isBlocked) throw new Error("Аккаунт заблокирован администратором");
  return user;
}

async function assertRegistrationAvailable(email: string, phone: string) {
  const [existing, phoneOwner] = await Promise.all([findUserByEmail(email), findUserByPhone(phone)]);
  if (existing) throw new Error("Пользователь с таким email уже зарегистрирован");
  if (phoneOwner) throw new Error("Пользователь с таким телефоном уже зарегистрирован");
}

function assertLoginCandidate(candidate: Awaited<ReturnType<typeof findUserWithPassword>>): asserts candidate is NonNullable<typeof candidate> & { passwordHash: string } {
  if (!candidate?.passwordHash) throw new Error("Неверный email или пароль");
  if (candidate.user.isBlocked) throw new Error("Аккаунт заблокирован администратором");
}
