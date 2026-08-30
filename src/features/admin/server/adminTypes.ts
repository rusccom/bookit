import type { UserRole } from "@/features/auth/server/authTypes";

export type AdminAccount = {
  id: string;
  login: string;
};

export type AdminUserRecord = {
  createdAt: string;
  email: string | null;
  fullName: string;
  id: string;
  phone: string | null;
  role: UserRole;
};
