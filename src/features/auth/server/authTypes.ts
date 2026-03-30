export type UserRole = "customer" | "owner";

export type AuthUser = {
  id: string;
  role: UserRole;
  fullName: string;
  email: string | null;
  phone: string | null;
};
