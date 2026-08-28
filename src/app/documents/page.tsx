"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { useDemo } from "@/state/demo-provider";
import { FileNow } from "@/components/filing/file-now";
import { portals } from "@/data/portals";
import { allRequirements } from "@/data/requirements";
import { DocumentViewer } from "@/components/documents/document-viewer";
import type { DocumentCategory, VaultDocument } from "@/domain/types";
import { useI18n } from "@/i18n/provider";

const categories: DocumentCategory[] = ["corporate", "tax", "employees", "licences", "policies", "contracts"];

export default function DocumentsPage() {
  const { documents, addDocument } = useDemo();
  const { t } = useI18n();
  const [filter, setFilter] = useState<DocumentCategory | "all">("all");
  const [viewing, setViewing] = useState<VaultDocument | null>(null);
  const visible = filter === "all" ? documents : documents.filter((d) => d.category === filter);
  const categoryLabel: Record<DocumentCategory, string> = {
    corporate: t.documents.corporate,
    tax: t.documents.tax,
    employees: t.documents.employees,
    licences: t.documents.licences,
    policies: t.documents.policies,
    contracts: t.documents.contracts,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-medium tracking-tight">{t.documents.title}</h1>
          <p className="mt-2 text-neutral-600">{t.documents.subtitle}</p>
          <div className="mt-3 flex flex-col gap-2">
            {portals.map((portal) => (
              <FileNow key={portal.id} id={portal.id} />
            ))}
          </div>
        </div>
        <Modal>
          <ModalTrigger asChild>
            <Button variant="outline">{t.documents.upload}</Button>
          </ModalTrigger>
          <ModalContent title={t.documents.uploadTitle}>
            <p className="text-sm text-neutral-600">{t.documents.uploadBody}</p>
            <Button
              className="mt-6 w-full"
              onClick={() =>
                addDocument({
                  id: `doc-${Date.now()}`,
                  name: "Uploaded file (demo)",
                  category: "policies",
                  status: "uploaded",
                  uploadedDate: "2026-08-29",
                  linkedComplianceId: "posh",
                })
              }
            >
              {t.documents.addDemo}
            </Button>
          </ModalContent>
        </Modal>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <button type="button" onClick={() => setFilter("all")} className="rounded-full border px-3 py-1 text-xs">
          {t.documents.all}
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className="rounded-full border border-neutral-200 px-3 py-1 text-xs"
          >
            {categoryLabel[c]}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <div className="mt-10">
          <EmptyState title={t.documents.emptyTitle} body={t.documents.emptyBody} />
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-neutral-200 border-y">
          {visible.map((doc) => {
            const linked = allRequirements.find((r) => r.id === doc.linkedComplianceId);
            return (
              <li key={doc.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <button
                    type="button"
                    className="text-left font-medium underline-offset-4 hover:underline"
                    onClick={() => setViewing(doc)}
                  >
                    {doc.name}
                  </button>
                  <p className="text-xs text-neutral-500">
                    {categoryLabel[doc.category]} · {doc.status}
                    {doc.uploadedDate ? ` · ${doc.uploadedDate}` : ""}
                    {doc.expiryDate ? ` · ${doc.expiryDate}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {linked && (
                    <p className="text-sm text-neutral-600">
                      {t.documents.linkedTo} {linked.title}
                    </p>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setViewing(doc)}>
                    {t.documents.view}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <DocumentViewer doc={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
