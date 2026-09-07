"use client";

import type { ComplianceStep } from "@/domain/types";
import { useI18n } from "@/i18n/provider";
import { stepCopy } from "@/i18n/labels";
import { StepChecklist } from "@/components/compliance/step-checklist";
import type { TaskPending } from "@/lib/task-journey";

export function TaskJourney({
  steps,
  pending,
  complete,
}: {
  steps: ComplianceStep[];
  pending: TaskPending | null;
  complete: boolean;
}) {
  const { t } = useI18n();
  if (steps.length === 0) return null;

  return (
    <div className="mt-3">
      {pending ? (
        <p className="mb-2 text-xs text-neutral-700">
          {t.suite.pendingStage.replace("{stage}", pending.stage)}
          <span className="mt-0.5 block text-neutral-500">
            {pending.who}
            {pending.city ? ` · ${pending.city}` : ""} · {pending.specialty}
          </span>
        </p>
      ) : null}
      <StepChecklist steps={steps} pending={pending} />
      {complete ? (
        <div className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">{t.suite.journeyComplete}</p>
          <p className="text-xs leading-5 text-neutral-600">
            {steps.map((step) => stepCopy(t, step.id)?.title ?? step.title).join(" → ")}
          </p>
        </div>
      ) : null}
    </div>
  );
}
