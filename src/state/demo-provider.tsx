"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { initialTasks } from "@/data/tasks";
import { initialDocuments } from "@/data/documents";
import type { GovernmentFiling, Task, TaskStatus, VaultDocument } from "@/domain/types";

type HelpRequest = {
  professionalId: string;
  requirementId: string;
  status: "waiting";
};

type DemoState = {
  tasks: Task[];
  documents: VaultDocument[];
  filings: GovernmentFiling[];
  requests: HelpRequest[];
  discoveryDone: boolean;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  addRequest: (req: HelpRequest) => void;
  addDocument: (doc: VaultDocument) => void;
  addFiling: (filing: GovernmentFiling) => void;
  markDiscoveryDone: () => void;
};

const DemoContext = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [documents, setDocuments] = useState(initialDocuments);
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [filings, setFilings] = useState<GovernmentFiling[]>([]);
  const [discoveryDone, setDiscoveryDone] = useState(false);

  const value = useMemo<DemoState>(
    () => ({
      tasks,
      documents,
      filings,
      requests,
      discoveryDone,
      setTaskStatus: (id, status) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t))),
      addRequest: (req) => setRequests((prev) => [...prev, req]),
      addDocument: (doc) => setDocuments((prev) => [doc, ...prev]),
      addFiling: (filing) => {
        setFilings((prev) => [filing, ...prev.filter((item) => item.portalId !== filing.portalId)]);
        setDocuments((prev) => [
          {
            id: `ack-${filing.id}`,
            name: `${filing.acknowledgement}.pdf`,
            category: filing.portalId === "gst" || filing.portalId === "ptax" ? "tax" : filing.portalId === "mca" ? "corporate" : filing.portalId === "shops" || filing.portalId === "factory" ? "licences" : filing.portalId === "posh" ? "policies" : "employees",
            status: "uploaded",
            uploadedDate: filing.submittedAt,
            linkedComplianceId: filing.portalId === "ptax" ? "ptax" : filing.portalId,
          },
          ...prev,
        ]);
      },
      markDiscoveryDone: () => setDiscoveryDone(true),
    }),
    [tasks, documents, filings, requests, discoveryDone],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
