"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Task } from "@/domain/types";
import { cn, formatIndianDate } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import { useDemo } from "@/state/demo-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TaskJourney } from "@/components/calendar/task-journey";
import { pendingForTask, stepsForTask } from "@/lib/task-journey";

const DEAL_MS = 640;
const SPREAD_MS = 820;
const SPREAD_STAGGER = 72;
const GATHER_MS = 620;
const GATHER_STAGGER = 48;
const CARD_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function pendingMonthKeys(tasks: Task[]) {
  const keys = new Set<string>();
  for (const task of tasks) {
    if (task.status === "completed") continue;
    if (task.dueDate.length >= 7) keys.add(task.dueDate.slice(0, 7));
  }
  return [...keys].sort();
}

function mergeQueue(prev: string[], pending: string[]) {
  if (pending.length === 0) return [];
  const kept = prev.filter((key) => pending.includes(key));
  const added = pending.filter((key) => !prev.includes(key));
  const next = [...kept, ...added];
  const front = prev[0];
  if (front && next.includes(front)) {
    const i = next.indexOf(front);
    return [...next.slice(i), ...next.slice(0, i)];
  }
  return pending;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function MonthCard({
  monthKey,
  interactive,
  showNext,
  onNext,
}: {
  monthKey: string;
  interactive: boolean;
  showNext?: boolean;
  onNext?: () => void;
}) {
  const { t, locale } = useI18n();
  const { tasks, setTaskStatus } = useDemo();
  const [year, month] = monthKey.split("-").map(Number);
  const label = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1),
  );
  const monthTasks = tasks
    .filter((task) => task.dueDate.startsWith(monthKey))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const open = monthTasks.filter((task) => task.status !== "completed");
  const done = monthTasks.filter((task) => task.status === "completed");

  return (
    <article className="flex h-[36rem] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-[var(--surface)] shadow-[var(--elev-2)]">
      <header className="flex shrink-0 items-start justify-between gap-3 p-6 pb-4">
        <h3 className="text-2xl font-medium tracking-tight">{label}</h3>
        {interactive && showNext ? (
          <Button type="button" size="sm" onClick={onNext}>
            {t.suite.dealNext}
          </Button>
        ) : null}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        {open.length === 0 && done.length === 0 ? (
          <p className="text-sm text-neutral-500">{t.suite.calendarEmpty}</p>
        ) : null}
        {open.length > 0 ? (
          <ul className="space-y-3">
            {open.map((task) => (
              <TaskRow key={task.id} task={task} interactive={interactive} onStart={() => setTaskStatus(task.id, "in_progress")} />
            ))}
          </ul>
        ) : null}
        {done.length > 0 ? (
          <div className={cn(open.length > 0 && "mt-6")}>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
              {t.suite.completedThisMonth}
            </p>
            <ul className="space-y-3">
              {done.map((task) => (
                <TaskRow key={task.id} task={task} interactive={interactive} />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function TaskRow({
  task,
  interactive,
  onStart,
}: {
  task: Task;
  interactive: boolean;
  onStart?: () => void;
}) {
  const { t } = useI18n();
  const { requirements, requests, professionals } = useDemo();
  const linked = requirements.find((item) => item.id === task.complianceId);
  const overlay = stepsForTask(task, linked?.steps ?? []);
  const pending = pendingForTask(task, linked?.steps ?? [], requests, professionals);
  const statusLabel =
    task.status === "todo"
      ? t.suite.boardTodo
      : task.status === "in_progress"
        ? t.suite.boardDoing
        : task.status === "waiting_professional"
          ? t.suite.boardWaiting
          : t.suite.boardDone;
  const cta = task.status === "todo" ? t.suite.startTask : t.common.continue;

  return (
    <li className="rounded-lg border border-neutral-200 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium">{task.title}</h4>
        <Badge variant="secondary">{statusLabel}</Badge>
      </div>
      <p className="mt-1 text-xs text-neutral-500">
        {formatIndianDate(task.dueDate)} · {task.owner}
      </p>
      <p className="mt-2 text-xs text-neutral-600">{task.reason}</p>
      <TaskJourney steps={overlay} pending={pending} complete={task.status === "completed"} />
      {interactive && linked && (task.status === "todo" || task.status === "in_progress") ? (
        <div className="mt-3">
          <Button asChild size="sm">
            <Link href={linked.href} onClick={() => task.status === "todo" && onStart?.()}>
              {cta}
            </Link>
          </Button>
        </div>
      ) : null}
    </li>
  );
}

export function MonthDeck({ className }: { className?: string }) {
  const { t } = useI18n();
  const { tasks } = useDemo();
  const pendingMonths = useMemo(() => pendingMonthKeys(tasks), [tasks]);
  const [queue, setQueue] = useState<string[]>(pendingMonths);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [layout, setLayout] = useState<"card" | "monthly">("card");
  const [motion, setMotion] = useState<"spread" | "gather" | null>(null);
  const leavingLock = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const originRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const stackBox = useRef<DOMRect | null>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (leavingLock.current) return;
    setQueue((prev) => mergeQueue(prev, pendingMonths));
  }, [pendingMonths]);

  const front = queue[0];
  const under = queue[1];
  const canDeal = queue.length > 1;
  const busy = motion !== null;

  function rotate() {
    setQueue(([first, ...rest]) => [...rest, first]);
  }

  function onNext() {
    if (!canDeal || !front || busy) return;
    if (leavingLock.current) return;
    if (prefersReducedMotion()) {
      rotate();
      return;
    }
    leavingLock.current = front;
    setLeavingId(front);
    timerRef.current = window.setTimeout(() => {
      rotate();
      leavingLock.current = null;
      setLeavingId(null);
      timerRef.current = null;
    }, DEAL_MS);
  }

  function bindCard(key: string) {
    return (el: HTMLDivElement | null) => {
      if (el) cardRefs.current.set(key, el);
      else cardRefs.current.delete(key);
    };
  }

  function openMonthly() {
    if (layout === "monthly" || busy || leavingLock.current) return;
    stackBox.current = originRef.current?.getBoundingClientRect() ?? null;
    if (prefersReducedMotion() || pendingMonths.length < 2) {
      setLayout("monthly");
      return;
    }
    setMotion("spread");
    setLayout("monthly");
  }

  function openCard() {
    if (layout === "card" || busy) return;
    if (prefersReducedMotion() || pendingMonths.length < 2) {
      setLayout("card");
      return;
    }
    setMotion("gather");
  }

  const queueFront = useRef(queue[0]);
  queueFront.current = queue[0];

  useLayoutEffect(() => {
    if (layout !== "monthly" || motion !== "spread") return;
    const origin = stackBox.current;
    const nodes = pendingMonths.map((key) => cardRefs.current.get(key)).filter((el): el is HTMLDivElement => !!el);
    if (!origin || nodes.length < 2) {
      setMotion(null);
      return;
    }
    const frontKey = queueFront.current;
    for (const [i, node] of nodes.entries()) {
      const dest = node.getBoundingClientRect();
      const dx = origin.left - dest.left;
      const dy = origin.top - dest.top;
      const tilt = (i - (nodes.length - 1) / 2) * 3.4;
      const key = pendingMonths[i];
      node.style.zIndex = key === frontKey ? "40" : String(28 - i);
      node.style.transformOrigin = "50% 8%";
      node.animate(
        [
          {
            transform: `translate(${dx}px, ${dy + i * 8}px) rotate(${tilt}deg) scale(${1 - Math.min(i, 5) * 0.012})`,
          },
          {
            transform: `translate(${dx * 0.22}px, ${dy * 0.32 - 36}px) rotate(${tilt * 0.35}deg) scale(1.03)`,
            offset: 0.42,
          },
          { transform: "none" },
        ],
        {
          duration: SPREAD_MS,
          delay: i * SPREAD_STAGGER,
          easing: CARD_EASE,
          fill: "both",
        },
      );
    }
    const doneAt = SPREAD_MS + (nodes.length - 1) * SPREAD_STAGGER + 40;
    const timer = window.setTimeout(() => {
      for (const node of nodes) {
        node.style.zIndex = "";
        node.style.transformOrigin = "";
      }
      setMotion(null);
    }, doneAt);
    return () => window.clearTimeout(timer);
  }, [layout, motion, pendingMonths]);

  useLayoutEffect(() => {
    if (motion !== "gather") return;
    const stage = stageRef.current?.getBoundingClientRect();
    const nodes = pendingMonths.map((key) => cardRefs.current.get(key)).filter((el): el is HTMLDivElement => !!el);
    if (!stage || nodes.length < 2) {
      setLayout("card");
      setMotion(null);
      return;
    }
    const width = stackBox.current?.width ?? Math.min(stage.width, 768);
    const targetLeft = stage.left + (stage.width - width) / 2;
    const targetTop = stage.top;
    for (const [i, node] of nodes.entries()) {
      const from = node.getBoundingClientRect();
      const dx = targetLeft - from.left;
      const dy = targetTop - from.top;
      const tilt = (i - (nodes.length - 1) / 2) * 2.4;
      node.style.zIndex = String(30 + pendingMonths.length - i);
      node.style.transformOrigin = "50% 8%";
      node.animate(
        [
          { transform: "none" },
          {
            transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 20}px) rotate(${tilt}deg) scale(0.98)`,
            offset: 0.4,
          },
          { transform: `translate(${dx}px, ${dy + i * 7}px) rotate(${tilt * 0.2}deg) scale(0.96)` },
        ],
        {
          duration: GATHER_MS,
          delay: (nodes.length - 1 - i) * GATHER_STAGGER,
          easing: CARD_EASE,
          fill: "forwards",
        },
      );
    }
    const doneAt = GATHER_MS + (nodes.length - 1) * GATHER_STAGGER + 40;
    const timer = window.setTimeout(() => {
      setLayout("card");
      setMotion(null);
    }, doneAt);
    return () => window.clearTimeout(timer);
  }, [motion, pendingMonths]);

  const dealing = leavingId !== null;

  const toggle = (
    <div
      role="group"
      aria-label={t.suite.calendarView}
      className="mb-6 inline-flex rounded-full border border-neutral-200 p-0.5"
    >
      <button
        type="button"
        aria-pressed={layout === "card"}
        disabled={busy}
        onClick={openCard}
        className={cn(
          "rounded-full px-3 py-1 text-xs",
          layout === "card" ? "bg-neutral-900 text-white" : "text-neutral-600",
        )}
      >
        {t.suite.calendarCardView}
      </button>
      <button
        type="button"
        aria-pressed={layout === "monthly"}
        disabled={busy}
        onClick={openMonthly}
        className={cn(
          "rounded-full px-3 py-1 text-xs",
          layout === "monthly" ? "bg-neutral-900 text-white" : "text-neutral-600",
        )}
      >
        {t.suite.calendarMonthView}
      </button>
    </div>
  );

  if (!front) {
    return (
      <div className={cn("rounded-xl border border-neutral-200 bg-[var(--surface)] p-8 shadow-[var(--elev-2)]", className)}>
        <p className="text-sm text-neutral-500">{t.suite.noPendingTasks}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={cn(layout === "card" && "mx-auto max-w-3xl")}>
        <div className="flex justify-end">{toggle}</div>
        <TooltipProvider>
          <div ref={stageRef} className={cn(busy && "pointer-events-none")}>
          {layout === "monthly" ? (
            <div className={cn("month-spread", motion === "spread" && "is-spreading")}>
              {pendingMonths.map((monthKey) => (
                <div key={monthKey} ref={bindCard(monthKey)} className="month-spread-card">
                  <MonthCard monthKey={monthKey} interactive={motion === null} />
                </div>
              ))}
            </div>
          ) : (
            <div className={cn("month-deck", dealing && "is-dealing")}>
              <div className="month-deck-back" aria-hidden>
                <div className="h-full rounded-xl border border-neutral-200 bg-[var(--surface)] shadow-[var(--elev-2)]" />
              </div>
              {under ? (
                <div className="month-deck-under" inert aria-hidden>
                  <MonthCard monthKey={under} interactive={false} />
                </div>
              ) : null}
              <div ref={originRef} className="month-deck-front">
                <MonthCard monthKey={front} interactive showNext={canDeal} onNext={onNext} />
              </div>
            </div>
          )}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
