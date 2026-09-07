"use client";

import Link from "next/link";
import { cn, daysUntil, formatIndianDate } from "@/lib/utils";
import type { ComplianceRequirement } from "@/domain/types";
import { useI18n } from "@/i18n/provider";
import { requirementCopy, statusLabel } from "@/i18n/labels";
import { FileNow } from "@/components/filing/file-now";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { obligationScore } from "@/lib/health";
import { isFullyComplete, stepsForRequirement } from "@/lib/task-journey";
import { useDemo } from "@/state/demo-provider";
import { StepChecklist } from "@/components/compliance/step-checklist";
import { TooltipProvider } from "@/components/ui/tooltip";

function statusVariant(status: ComplianceRequirement["status"]) {
  if (status === "attention") return "default" as const;
  if (status === "upcoming") return "secondary" as const;
  return "outline" as const;
}

function actionLabel(raw: string) {
  return raw.replace(/\s*→\s*$/, "");
}

export function ComplianceItem({ item }: { item: ComplianceRequirement }) {
  const { t } = useI18n();
  const { documents, filings } = useDemo();
  const copy = requirementCopy(t, item.id);
  const progress = Math.round(obligationScore(item, documents, filings) * 100);
  const steps = stepsForRequirement(item);
  const done = steps.filter((step) => step.status === "complete").length;
  const finished = isFullyComplete(item);
  const due = item.dueDate ? daysUntil(item.dueDate) : null;
  const source = item.sources[0];
  const title = copy?.title ?? item.title;
  const dueLabel =
    item.dueDate == null
      ? null
      : due !== null && due >= 0
        ? t.overview.dueIn.replace("{n}", String(due))
        : formatIndianDate(item.dueDate);

  return (
    <Card
      className={cn(
        "flex h-full flex-col transition-[transform,box-shadow] duration-[var(--dur-fast)] hover:-translate-y-px hover:shadow-[var(--elev-8)]",
        item.status === "attention" && "border-neutral-900",
      )}
    >
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            {copy?.category ?? item.category}
          </p>
          <Badge variant={statusVariant(item.status)} className="shrink-0">
            {statusLabel(t, item.status)}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-snug">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-2 text-sm text-neutral-600">{item.description}</p>
        <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-neutral-200">
          <div className="border-r border-neutral-200 px-3 py-2.5">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{t.suite.nextDeadline}</dt>
            <dd className="mt-1 text-sm">{dueLabel ?? "—"}</dd>
          </div>
          <div className="px-3 py-2.5">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{t.common.jurisdiction}</dt>
            <dd className="mt-1 text-sm">{item.jurisdiction}</dd>
          </div>
        </dl>
        {steps.length > 0 ? (
          <TooltipProvider>
            <div className="mt-auto">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                {finished
                  ? t.suite.journeyComplete
                  : t.suite.stepsDone.replace("{done}", String(done)).replace("{total}", String(steps.length))}
              </p>
              <StepChecklist steps={steps} />
            </div>
          </TooltipProvider>
        ) : (
          <div className="mt-auto flex items-center gap-3">
            <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-100" aria-hidden>
              <div className="h-full rounded-full bg-neutral-900" style={{ width: `${progress}%` }} />
            </div>
            <span className="shrink-0 font-mono text-xs text-neutral-500">{progress}%</span>
          </div>
        )}
        {source ? (
          <p className="text-xs text-neutral-500">
            {t.common.source} · {source.publisher}
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="mt-auto flex-col items-start gap-2">
        <Button asChild size="sm">
          <Link href={item.href}>{actionLabel(copy?.action ?? item.nextAction)}</Link>
        </Button>
        <FileNow id={item.id} className="text-xs" />
      </CardFooter>
    </Card>
  );
}
