"use client";

import type { Confidence, ComplianceSource } from "@/domain/types";
import { useI18n } from "@/i18n/provider";

export function ConfidenceIndicator({ value }: { value: Confidence }) {
  const { t } = useI18n();
  return (
    <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
      {t.common.confidence} · {value}
    </span>
  );
}

export function SourcePanel({ sources, jurisdiction }: { sources: ComplianceSource[]; jurisdiction: string }) {
  const { t } = useI18n();
  const source = sources[0];
  if (!source) return null;
  return (
    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{t.common.source}</dt>
        <dd className="mt-1">
          <a href={source.url} className="underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
            {source.title}
          </a>
          <p className="text-neutral-500">{source.publisher}</p>
        </dd>
      </div>
      <div>
        <dt className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{t.common.jurisdiction}</dt>
        <dd className="mt-1">{jurisdiction}</dd>
      </div>
      <div>
        <dt className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{t.common.lastVerified}</dt>
        <dd className="mt-1 font-mono">{source.lastVerified}</dd>
      </div>
    </dl>
  );
}
