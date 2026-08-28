"use client";

import { Modal, ModalContent } from "@/components/ui/modal";
import { businessProfile } from "@/data/business";
import { allRequirements } from "@/data/requirements";
import type { VaultDocument } from "@/domain/types";
import { useI18n } from "@/i18n/provider";

export function DocumentViewer({
  doc,
  onClose,
}: {
  doc: VaultDocument | null;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const linked = doc ? allRequirements.find((r) => r.id === doc.linkedComplianceId) : null;

  return (
    <Modal open={!!doc} onOpenChange={(open) => !open && onClose()}>
      <ModalContent title={doc?.name ?? t.documents.view} className="w-[min(94vw,680px)] max-h-[88vh] overflow-auto">
        {doc && (
          <article className="border border-neutral-200 bg-[#fffcf8] px-6 py-8 sm:px-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">{t.documents.demoStamp}</p>
            <h3 className="mt-4 text-xl font-medium tracking-tight">{doc.name}</h3>
            <p className="mt-1 text-sm text-neutral-500">
              {t.documents.issuedTo} {businessProfile.name}
            </p>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-neutral-400">{t.documents.linkedTo}</dt>
                <dd>{linked?.title ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-neutral-400">{t.common.lastVerified}</dt>
                <dd className="font-mono text-xs">{doc.uploadedDate ?? "—"}</dd>
              </div>
              {doc.expiryDate && (
                <div>
                  <dt className="text-neutral-400">{t.overview.upcoming}</dt>
                  <dd className="font-mono text-xs">{doc.expiryDate}</dd>
                </div>
              )}
              <div>
                <dt className="text-neutral-400">{t.common.jurisdiction}</dt>
                <dd>{linked?.jurisdiction ?? "Maharashtra / India"}</dd>
              </div>
            </dl>
            <div className="mt-8 space-y-3 text-sm leading-6 text-neutral-700">
              {previewBody(doc, t.documents.previewNote)}
            </div>
            <p className="mt-10 font-mono text-[10px] text-neutral-400">{t.documents.pageOf}</p>
          </article>
        )}
      </ModalContent>
    </Modal>
  );
}

function previewBody(doc: VaultDocument, note: string) {
  const ack = doc.name.replace(/\.pdf$/i, "");
  if (doc.id.startsWith("ack-") || /\.pdf$/i.test(doc.name)) {
    return (
      <>
        <p className="font-mono text-sm">{ack}</p>
        <p>{note}</p>
      </>
    );
  }
  return <p>{note}</p>;
}
