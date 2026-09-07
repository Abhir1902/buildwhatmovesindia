import seed from "@/data/db.json";

export type Role = "owner" | "accountant" | "expert";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  initials: string;
};

export const DEMO_PASSWORD = seed.demoPassword;
export const demoUsers = seed.users as DemoUser[];

export function userByEmail(email: string) {
  return demoUsers.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
}

export function userById(id: string) {
  return demoUsers.find((user) => user.id === id);
}

export function userByRole(role: Role) {
  return demoUsers.find((user) => user.role === role)!;
}
