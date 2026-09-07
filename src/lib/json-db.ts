import seedJson from "@/data/db.json";
import type {
  BusinessProfile,
  ComplianceRequirement,
  ComplianceSource,
  GovernmentFiling,
  Notification,
  Professional,
  Task,
  TaskStatus,
  VaultDocument,
} from "@/domain/types";
import type { DemoUser } from "@/data/users";
import type { GlossaryTerm } from "@/data/glossary";
import type { PenaltyBand } from "@/data/penalties";
import { computeHealth } from "@/lib/health";

export type HelpRequest = {
  id: string;
  professionalId: string;
  requirementId: string;
  status: "waiting";
  stage?: string;
  detail?: string;
};

export type PortalRow = { label: string; value: string };

export type PortalRecord = {
  id: string;
  requirementId: string;
  period: string;
  rows: PortalRow[];
};

export type SetuDb = {
  business: BusinessProfile;
  users: DemoUser[];
  demoPassword: string;
  tasks: Task[];
  documents: VaultDocument[];
  filings: GovernmentFiling[];
  requests: HelpRequest[];
  notifications: Notification[];
  requirements: ComplianceRequirement[];
  featuredRequirementIds: string[];
  professionals: Professional[];
  glossary: GlossaryTerm[];
  portals: PortalRecord[];
  penalties: PenaltyBand[];
  sources: ComplianceSource[];
  dashboard: {
    readinessTrend: { month: string; value: number }[];
    filingHistory: { month: string; gst: number; epf: number; other: number }[];
    categoryMix: { label: string; value: number }[];
  };
  health: {
    total: number;
    completed: number;
    pendingApproval: number;
    remaining: number;
    readiness: number;
  };
  flags: {
    discoveryDone: boolean;
    tourDone: boolean;
    plainLanguage: boolean;
  };
};

export type CollectionName = {
  [K in keyof SetuDb]: SetuDb[K] extends { id: string }[] ? K : never;
}[keyof SetuDb];

export const STORAGE_KEY = "setu-json-db-v3";
const PREV_STORAGE_KEYS = ["setu-json-db-v2", "setu-json-db-v1", "setu-demo-v1"];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const SEED: SetuDb = clone(seedJson as SetuDb);

let current: SetuDb = clone(SEED);
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
  for (const listener of listeners) listener();
}

function mergeById<T extends { id: string }>(seed: T[], stored: T[] | undefined) {
  if (!stored) return clone(seed);
  const have = new Set(stored.map((item) => item.id));
  const missing = seed.filter((item) => !have.has(item.id));
  return missing.length ? [...stored, ...missing] : stored;
}

export function hydrateDb() {
  if (typeof window === "undefined") return getDb();
  for (const key of PREV_STORAGE_KEYS) window.localStorage.removeItem(key);
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    current = clone(SEED);
    return getDb();
  }
  try {
    const stored = JSON.parse(raw) as Partial<SetuDb>;
    current = {
      ...clone(SEED),
      ...stored,
      tasks: mergeById(SEED.tasks, stored.tasks),
      documents: mergeById(SEED.documents, stored.documents),
      requirements: mergeById(SEED.requirements, stored.requirements),
      professionals: mergeById(SEED.professionals, stored.professionals),
      users: mergeById(SEED.users, stored.users),
      glossary: mergeById(SEED.glossary, stored.glossary),
      portals: mergeById(SEED.portals, stored.portals),
      penalties: mergeById(SEED.penalties, stored.penalties),
      sources: mergeById(SEED.sources, stored.sources),
      filings: stored.filings ?? clone(SEED.filings),
      requests: stored.requests ?? clone(SEED.requests),
      notifications: stored.notifications ?? clone(SEED.notifications),
    };
  } catch {
    current = clone(SEED);
  }
  return getDb();
}

export function getDb(): SetuDb {
  const health = computeHealth(current);
  const trend = current.dashboard.readinessTrend;
  const readinessTrend = trend.map((row, i) => (i === trend.length - 1 ? { ...row, value: health.readiness } : row));
  return { ...current, health, dashboard: { ...current.dashboard, readinessTrend } };
}

export function subscribeDb(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function mutateDb(fn: (draft: SetuDb) => void) {
  const next = clone(current);
  fn(next);
  current = next;
  emit();
  return getDb();
}

export function listAll<K extends CollectionName>(collection: K): SetuDb[K] {
  return current[collection];
}

export function getById<K extends CollectionName>(collection: K, id: string): SetuDb[K][number] | null {
  const rows = current[collection] as Array<SetuDb[K][number] & { id: string }>;
  return rows.find((item) => item.id === id) ?? null;
}

export function createRecord<K extends CollectionName>(collection: K, item: SetuDb[K][number]) {
  mutateDb((draft) => {
    const rows = draft[collection] as SetuDb[K][number][];
    rows.unshift(item);
  });
  return item;
}

export function updateRecord<K extends CollectionName>(collection: K, id: string, patch: Partial<SetuDb[K][number]>) {
  mutateDb((draft) => {
    const rows = draft[collection] as Array<SetuDb[K][number] & { id: string }>;
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) return;
    rows[index] = { ...rows[index], ...patch };
  });
}

export function deleteRecord<K extends CollectionName>(collection: K, id: string) {
  mutateDb((draft) => {
    const rows = draft[collection] as Array<{ id: string }>;
    Object.assign(draft, { [collection]: rows.filter((row) => row.id !== id) });
  });
}

export function resetDb() {
  current = clone(SEED);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
    for (const key of PREV_STORAGE_KEYS) window.localStorage.removeItem(key);
  }
  for (const listener of listeners) listener();
  return getDb();
}

export function featuredRequirements(db: SetuDb = current) {
  return db.requirements.filter((item) => db.featuredRequirementIds.includes(item.id));
}

export function setTaskStatusInDb(id: string, status: TaskStatus) {
  updateRecord("tasks", id, { status } as Partial<Task>);
}

export function resetDbForTests(snapshot?: SetuDb) {
  current = clone(snapshot ?? SEED);
  listeners.clear();
}
