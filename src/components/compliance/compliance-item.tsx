"use client";

import Link from "next/link";
import { daysUntil, formatIndianDate } from "@/lib/utils";
import type { ComplianceRequirement } from "@/domain/types";
import { useI18n } from "@/i18n/provider";
import { requirementCopy, statusLabel } from "@/i18n/labels";
import { FileNow } from "@/components/filing/file-now";

export function ComplianceItem({ item }: { item: ComplianceRequirement }) {
  const { t } = useI18n();
  const due = item.dueDate ? daysUntil(item.dueDate) : null;
  return (
    <article className="flex flex-col gap-3 border-b border-neutral-200 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-base font-medium">{requirementCopy(t, item.id)?.title ?? item.title}</h3>
        <p className="text-sm text-neutral-500">{requirementCopy(t, item.id)?.category ?? item.category}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="font-mono text-[11px] tracking-wider text-neutral-500">{statusLabel(t, item.status)}</span>
        {item.dueDate && (
          <span className="text-neutral-600">
            {due !== null && due >= 0 ? t.overview.dueIn.replace("{n}", String(due)) : formatIndianDate(item.dueDate)}
          </span>
        )}
        <div className="h-1 w-16 overflow-hidden rounded-full bg-neutral-200" aria-hidden>
          <div className="h-full bg-neutral-900" style={{ width: `${item.progress}%` }} />
        </div>
        <FileNow id={item.id} />
        <Link href={item.href} className="text-sm font-medium underline-offset-4 hover:underline">
          {requirementCopy(t, item.id)?.action ?? `${item.nextAction} →`}
        </Link>
      </div>
    </article>
  );
}
