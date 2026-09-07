import type { Role } from "@/data/users";

export type Capability =
  | "file.submit"
  | "vault.upload"
  | "tasks.move"
  | "demo.reset"
  | "profile.edit";

const matrix: Record<Role, Record<Capability, boolean>> = {
  owner: {
    "file.submit": true,
    "vault.upload": true,
    "tasks.move": true,
    "demo.reset": true,
    "profile.edit": true,
  },
  accountant: {
    "file.submit": true,
    "vault.upload": true,
    "tasks.move": true,
    "demo.reset": false,
    "profile.edit": false,
  },
  expert: {
    "file.submit": false,
    "vault.upload": false,
    "tasks.move": true,
    "demo.reset": false,
    "profile.edit": false,
  },
};

export function can(role: Role, capability: Capability) {
  return matrix[role][capability];
}
