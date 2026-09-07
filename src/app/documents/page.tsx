"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { useDemo } from "@/state/demo-provider";
import { DocumentViewer } from "@/components/documents/document-viewer";
import { VaultFileCard } from "@/components/documents/vault-file-card";
import type { DocumentCategory, VaultDocument } from "@/domain/types";
import { useI18n } from "@/i18n/provider";
import { AppHeader } from "@/components/suite/app-header";

const categories: DocumentCategory[] = ["corporate", "tax", "employees", "licences", "policies", "contracts"];

export default function DocumentsPage() {
  const { documents, addDocument, removeDocument } = useDemo();
  const { t } = useI18n();
  const [viewing, setViewing] = useState<VaultDocument | null>(null);
  const categoryLabel: Record<DocumentCategory, string> = {
    corporate: t.documents.corporate,
    tax: t.documents.tax,
    employees: t.documents.employees,
    licences: t.documents.licences,
    policies: t.documents.policies,
    contracts: t.documents.contracts,
  };

  return (
    <div className={documents.length === 0 ? "mx-auto max-w-3xl" : "mx-auto max-w-5xl"}>
      <AppHeader
        appId="vault"
        extra={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-500">{t.documents.subtitle}</p>
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
        }
      />
      {documents.length > 0 ? (
        <div className="space-y-10">
          {categories.map((category) => {
            const files = documents.filter((doc) => doc.category === category);
            return (
              <section key={category}>
                <h2 className="text-lg font-medium tracking-tight">{categoryLabel[category]}</h2>
                {files.length > 0 ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {files.map((doc) => (
                      <VaultFileCard
                        key={doc.id}
                        doc={doc}
                        onView={() => setViewing(doc)}
                        onRemove={() => {
                          if (viewing?.id === doc.id) setViewing(null);
                          removeDocument(doc.id);
                        }}
                      />
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      ) : null}
      <DocumentViewer doc={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
