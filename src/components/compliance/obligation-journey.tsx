"use client";

import type { ComplianceRequirement } from "@/domain/types";
import { useI18n } from "@/i18n/provider";
import { useDemo } from "@/state/demo-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StepChecklist } from "@/components/compliance/step-checklist";
import { isFullyComplete, pendingForTask, stepsForRequirement, stepsForTask } from "@/lib/task-journey";

export function ObligationJourney({ item }: { item: ComplianceRequirement }) {
  const { t } = useI18n();
  const { requests, professionals, tasks } = useDemo();
  const steps = stepsForRequirement(item);
  if (steps.length === 0) return null;
  const done = steps.filter((step) => step.status === "complete").length;
  const waiting = tasks.find((task) => task.complianceId === item.id && task.status === "waiting_professional");
  const pending = waiting ? pendingForTask(waiting, item.steps.length ? item.steps : steps, requests, professionals) : null;
  const stuckStepId = waiting
    ? stepsForTask(waiting, item.steps.length ? item.steps : steps).find((step) => step.status === "current")?.id
    : undefined;

  return (
    <section className="mt-12">
      <p className="mb-4 font-mono text-xs uppercase tracking-wider text-neutral-500">
        {isFullyComplete(item)
          ? t.suite.journeyComplete
          : t.suite.stepsDone.replace("{done}", String(done)).replace("{total}", String(steps.length))}
      </p>
      <TooltipProvider>
        <StepChecklist steps={steps} pending={pending} stuckStepId={stuckStepId} size="lg" expandable />
      </TooltipProvider>
    </section>
  );
}
