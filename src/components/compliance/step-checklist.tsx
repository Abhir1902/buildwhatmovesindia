"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { ComplianceStep } from "@/domain/types";
import { useI18n } from "@/i18n/provider";
import { statusLabel, stepCopy } from "@/i18n/labels";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TaskPending } from "@/lib/task-journey";

export function StepChecklist({
  steps,
  pending = null,
  stuckStepId,
  size = "sm",
  expandable = false,
}: {
  steps: ComplianceStep[];
  pending?: TaskPending | null;
  stuckStepId?: string;
  size?: "sm" | "lg";
  expandable?: boolean;
}) {
  if (steps.length === 0) return null;
  const lg = size === "lg";

  return (
    <ol className="relative">
      {steps.map((step, index) => (
        <li key={step.id} className={cn("relative flex gap-2.5", lg ? "pb-5 last:pb-0" : "pb-3 last:pb-0")}>
          {index < steps.length - 1 ? (
            <span
              className={cn(
                "absolute bottom-0 w-px",
                lg ? "top-[22px] left-[9px]" : "top-[18px] left-[7px]",
                step.status === "complete" ? "bg-neutral-900" : "bg-neutral-200",
              )}
              aria-hidden
            />
          ) : null}
          <JourneyTick step={step} pending={pending} stuckStepId={stuckStepId} size={size} expandable={expandable} />
        </li>
      ))}
    </ol>
  );
}

function JourneyTick({
  step,
  pending,
  stuckStepId,
  size,
  expandable,
}: {
  step: ComplianceStep;
  pending: TaskPending | null;
  stuckStepId?: string;
  size: "sm" | "lg";
  expandable: boolean;
}) {
  const { t } = useI18n();
  const copy = stepCopy(t, step.id);
  const title = copy?.title ?? step.title;
  const waitingHere = Boolean(pending && (stuckStepId ? step.id === stuckStepId : step.status === "current"));
  const tip = waitingHere
    ? pending.detail
    : [copy?.summary ?? step.summary, copy?.action ?? step.action].filter(Boolean).join(" ") || title;
  const [open, setOpen] = useState(expandable && step.status === "current");
  const lg = size === "lg";

  return (
    <div className="relative z-[1] min-w-0 flex-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="flex w-full items-start gap-2 rounded-md text-left hover:bg-neutral-50"
            aria-expanded={expandable ? open : undefined}
            onClick={() => expandable && setOpen((value) => !value)}
          >
            <span
              className={cn(
                "mt-0.5 flex shrink-0 items-center justify-center rounded-full border",
                lg ? "h-5 w-5" : "h-4 w-4",
                step.status === "complete" && "border-neutral-900 bg-neutral-900 text-white",
                step.status === "current" && "border-neutral-900 bg-white",
                step.status === "upcoming" && "border-neutral-300 bg-white",
              )}
              aria-hidden
            >
              {step.status === "complete" ? <Check className={lg ? "h-3 w-3" : "h-2.5 w-2.5"} strokeWidth={3} /> : null}
              {step.status === "current" ? <span className={cn("rounded-full bg-neutral-900", lg ? "h-2 w-2" : "h-1.5 w-1.5")} /> : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("flex items-baseline justify-between gap-3", lg ? "text-sm" : "text-xs")}>
                <span
                  className={cn(
                    step.status === "complete" && "text-neutral-400 line-through",
                    step.status === "current" && "text-neutral-800",
                    step.status === "upcoming" && "text-neutral-400",
                  )}
                >
                  <span className="font-mono text-[10px] text-neutral-400">{step.number}</span> {title}
                </span>
                {lg ? (
                  <span className="shrink-0 font-mono text-[10px] tracking-wider text-neutral-500">
                    {statusLabel(t, step.status)}
                  </span>
                ) : null}
              </span>
              {waitingHere ? <span className="mt-0.5 block text-[11px] text-neutral-500">{t.suite.stuckHere}</span> : null}
            </span>
          </button>
        </TooltipTrigger>
        {!expandable ? <TooltipContent className="max-w-xs leading-4">{tip}</TooltipContent> : null}
      </Tooltip>
      {expandable && open ? (
        <div className={cn("mt-2 max-w-2xl space-y-2 text-sm text-neutral-600", lg ? "pl-7" : "pl-6")}>
          <p>{copy?.summary ?? step.summary}</p>
          {(copy?.whyItMatters ?? step.whyItMatters) ? (
            <p>
              <span className="text-neutral-400">{t.journey.why} </span>
              {copy?.whyItMatters ?? step.whyItMatters}
            </p>
          ) : null}
          {(copy?.action ?? step.action) ? (
            <p>
              <span className="text-neutral-400">{t.journey.action} </span>
              {copy?.action ?? step.action}
            </p>
          ) : null}
          {step.documents.length > 0 ? (
            <p>
              <span className="text-neutral-400">{t.journey.documents} </span>
              {copy?.documents ?? step.documents.join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
