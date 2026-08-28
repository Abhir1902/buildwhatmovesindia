import type { Messages } from "@/i18n/dictionaries";

export function requirementCopy(t: Messages, id: string) {
  const items = t.items as Record<string, Messages["items"][keyof Messages["items"]]>;
  return items[id] ?? null;
}

export function statusLabel(t: Messages, status: string) {
  if (status === "attention") return t.common.statusAttention;
  if (status === "upcoming") return t.common.statusUpcoming;
  if (status === "healthy") return t.common.statusHealthy;
  if (status === "complete") return t.common.statusComplete;
  if (status === "current") return t.common.statusCurrent;
  return status;
}

export function stepCopy(t: Messages, id: string) {
  const steps = t.journey.steps as Record<string, (typeof t.journey.steps)[keyof typeof t.journey.steps]>;
  return steps[id] ?? null;
}
