function isPlain(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function mergeMessages<T>(base: T, over: T): T {
  if (!isPlain(base) || !isPlain(over)) return over ?? base;
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(over)) {
    const b = (base as Record<string, unknown>)[key];
    const o = over[key];
    out[key] = isPlain(b) && isPlain(o) ? mergeMessages(b, o) : o;
  }
  return out as T;
}
