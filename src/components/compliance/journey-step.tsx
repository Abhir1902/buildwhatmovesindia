"use client";

import { useState } from "react";
import type { ComplianceStep } from "@/domain/types";
import { useI18n } from "@/i18n/provider";
import { FileNow } from "@/components/filing/file-now";
import { statusLabel, stepCopy } from "@/i18n/labels";

export function JourneyStep({ step }: { step: ComplianceStep }) {
  const { t } = useI18n();
  const copy = stepCopy(t, step.id);
  const [open, setOpen] = useState(step.status === "current");
  return (
    <article className="border-b border-neutral-200 py-6">
      <button
        type="button"
        className="flex w-full items-baseline justify-between gap-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-mono text-xs text-neutral-400">{step.number}</span>
        <span className="flex-1 text-lg font-medium tracking-tight">{copy?.title ?? step.title}</span>
        <span className="font-mono text-[11px] tracking-wider text-neutral-500">{statusLabel(t, step.status)}</span>
      </button>
      {open && (
        <div className="mt-4 max-w-2xl space-y-3 pl-8 text-sm text-neutral-600">
          <p>{copy?.summary ?? step.summary}</p>
          <p>
            <span className="text-neutral-400">{t.journey.why} </span>
            {copy?.whyItMatters ?? step.whyItMatters}
          </p>
          <p>
            <span className="text-neutral-400">{t.journey.action} </span>
            {copy?.action ?? step.action}
          </p>
          {step.documents.length > 0 && (
            <p>
              <span className="text-neutral-400">{t.journey.documents} </span>
              {copy?.documents ?? step.documents.join(", ")}
            </p>
          )}
          <FileNow id={step.id.startsWith("gst") ? "gst" : "posh"} />
        </div>
      )}
    </article>
  );
}
