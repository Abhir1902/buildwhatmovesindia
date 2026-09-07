import { getDb } from "@/lib/json-db";

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function exposureFor(requirementId: string) {
  return getDb().penalties.find((item) => item.requirementId === requirementId) ?? null;
}

export function openExposure() {
  const { penalties, requirements } = getDb();
  return penalties.filter((item) => {
    const req = requirements.find((r) => r.id === item.requirementId);
    return req && req.status !== "healthy" && req.status !== "completed";
  });
}

export function totalOpenExposure() {
  return openExposure().reduce((sum, item) => sum + item.amountInr, 0);
}
