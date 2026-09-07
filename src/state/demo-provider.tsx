"use client";

import { createContext, startTransition, useContext, useEffect, useMemo, useState } from "react";
import type { BusinessProfile, GovernmentFiling, Notification, Task, TaskStatus, VaultDocument } from "@/domain/types";
import {
  createRecord,
  deleteRecord,
  featuredRequirements,
  getDb,
  hydrateDb,
  mutateDb,
  resetDb,
  subscribeDb,
  updateRecord,
  type CollectionName,
  type HelpRequest,
  type SetuDb,
} from "@/lib/json-db";

type DemoState = SetuDb & {
  discoveryDone: boolean;
  tourDone: boolean;
  plainLanguage: boolean;
  requirementsFeatured: ReturnType<typeof featuredRequirements>;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  createTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addRequest: (req: Omit<HelpRequest, "id">) => void;
  addDocument: (doc: VaultDocument) => void;
  updateDocument: (id: string, patch: Partial<VaultDocument>) => void;
  removeDocument: (id: string) => void;
  addFiling: (filing: GovernmentFiling) => void;
  addNotification: (item: Notification) => void;
  updateBusiness: (patch: Partial<BusinessProfile>) => void;
  create: typeof createRecord;
  update: typeof updateRecord;
  remove: typeof deleteRecord;
  markDiscoveryDone: () => void;
  setPlainLanguage: (value: boolean) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SetuDb>(() => getDb());

  useEffect(() => {
    hydrateDb();
    startTransition(() => setDb(getDb()));
    return subscribeDb(() => setDb(getDb()));
  }, []);

  const value = useMemo<DemoState>(
    () => ({
      ...db,
      discoveryDone: db.flags.discoveryDone,
      tourDone: db.flags.tourDone,
      plainLanguage: db.flags.plainLanguage,
      requirementsFeatured: featuredRequirements(db),
      setTaskStatus: (id, status) => updateRecord("tasks", id, { status }),
      createTask: (task) => createRecord("tasks", task),
      deleteTask: (id) => deleteRecord("tasks", id),
      addRequest: (req) =>
        mutateDb((draft) => {
          const id = `req-${Date.now()}`;
          draft.requests.unshift({ ...req, id });
          draft.notifications.unshift({
            id: `n-${Date.now()}`,
            title: "Help requested",
            body: "An expert has been notified in this demo.",
            href: "/professionals",
          });
        }),
      addDocument: (doc) =>
        mutateDb((draft) => {
          draft.documents.unshift(doc);
          draft.notifications.unshift({
            id: `n-${Date.now()}`,
            title: "Document added",
            body: doc.name,
            href: "/documents",
          });
        }),
      updateDocument: (id, patch) => updateRecord("documents", id, patch),
      removeDocument: (id) => deleteRecord("documents", id),
      addFiling: (filing) => {
        mutateDb((draft) => {
          draft.filings = [filing, ...draft.filings.filter((item) => item.portalId !== filing.portalId)];
          draft.documents.unshift({
            id: `ack-${filing.id}`,
            name: `${filing.acknowledgement}.pdf`,
            category:
              filing.portalId === "gst" || filing.portalId === "ptax"
                ? "tax"
                : filing.portalId === "mca"
                  ? "corporate"
                  : filing.portalId === "shops" || filing.portalId === "factory"
                    ? "licences"
                    : filing.portalId === "posh"
                      ? "policies"
                      : "employees",
            status: "uploaded",
            uploadedDate: filing.submittedAt,
            linkedComplianceId: filing.portalId === "ptax" ? "ptax" : filing.portalId,
          });
          draft.tasks = draft.tasks.map((task) =>
            task.complianceId === filing.portalId ? { ...task, status: "completed" as const } : task,
          );
          draft.notifications.unshift({
            id: `n-${Date.now()}`,
            title: "Filing submitted",
            body: `${filing.acknowledgement} saved to Vault.`,
            href: "/documents",
          });
        });
      },
      addNotification: (item) => createRecord("notifications", item),
      updateBusiness: (patch) =>
        mutateDb((draft) => {
          draft.business = { ...draft.business, ...patch };
        }),
      create: createRecord,
      update: updateRecord,
      remove: deleteRecord,
      markDiscoveryDone: () =>
        mutateDb((draft) => {
          draft.flags.discoveryDone = true;
        }),
      setPlainLanguage: (plainLanguage) =>
        mutateDb((draft) => {
          draft.flags.plainLanguage = plainLanguage;
        }),
      resetDemo: () => {
        resetDb();
      },
    }),
    [db],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}

export type { CollectionName, HelpRequest, SetuDb };
