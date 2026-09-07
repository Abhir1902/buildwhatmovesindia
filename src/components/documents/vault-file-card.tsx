"use client";

import { Button } from "@/components/ui/button";
import type { VaultDocument } from "@/domain/types";
import { useDemo } from "@/state/demo-provider";
import { useI18n } from "@/i18n/provider";

export function VaultFileCard({
  doc,
  onView,
  onRemove,
}: {
  doc: VaultDocument;
  onView: () => void;
  onRemove: () => void;
}) {
  const { t } = useI18n();
  const { business, requirements } = useDemo();
  const linked = requirements.find((item) => item.id === doc.linkedComplianceId);
  const filed = doc.uploadedDate
    ? t.documents.filedOn.replace("{date}", doc.uploadedDate)
    : doc.status;

  return (
    <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[var(--elev-2)]">
      <button type="button" className="block w-full text-left" onClick={onView}>
        <div className="flex aspect-[3/4] flex-col border-b border-neutral-200 bg-[#fffcf8] px-4 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">{t.documents.demoStamp}</p>
          <h3 className="mt-6 line-clamp-4 text-base font-medium tracking-tight">{doc.name}</h3>
          <p className="mt-3 text-xs text-neutral-500">
            {t.documents.issuedTo} {business.name}
          </p>
          <p className="mt-auto font-mono text-[11px] text-neutral-500">{filed}</p>
        </div>
      </button>
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{linked?.title ?? t.documents.linkedTo}</p>
          <p className="text-[11px] text-neutral-500">{filed}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="sm" onClick={onView}>
            {t.documents.view}
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            {t.documents.remove}
          </Button>
        </div>
      </div>
    </article>
  );
}
