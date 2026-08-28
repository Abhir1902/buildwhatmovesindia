"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemo } from "@/state/demo-provider";
import { formatIndianDate } from "@/lib/utils";
import { allRequirements } from "@/data/requirements";
import type { TaskStatus } from "@/domain/types";
import { FileNow } from "@/components/filing/file-now";
import { PortalSession } from "@/components/filing/portal-session";
import { portalById, type PortalId } from "@/data/portals";
import { useI18n } from "@/i18n/provider";

const statuses: TaskStatus[] = ["todo", "in_progress", "waiting_professional", "completed"];

export default function TasksPage() {
  const { tasks, setTaskStatus } = useDemo();
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>(null);
  const labels: Record<TaskStatus, string> = {
    todo: t.tasks.todo,
    in_progress: t.tasks.inProgress,
    waiting_professional: t.tasks.waiting,
    completed: t.tasks.completed,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-medium tracking-tight">{t.tasks.title}</h1>
      <p className="mt-2 text-neutral-600">{t.tasks.subtitle}</p>
      <ul className="mt-10 divide-y divide-neutral-200 border-y">
        {tasks.map((task) => {
          const linked = allRequirements.find((r) => r.id === task.complianceId);
          return (
            <li key={task.id} className="py-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-medium">{task.title}</h2>
                  <p className="mt-1 text-sm text-neutral-600">{task.reason}</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    {t.tasks.owner} {task.owner} · {t.tasks.due} {formatIndianDate(task.dueDate)} · {t.tasks.documents}{" "}
                    {task.requiredDocuments.join(", ")}
                  </p>
                  {linked && (
                    <div className="mt-2 flex flex-wrap gap-4">
                      <Link href={linked.href} className="text-sm underline-offset-4 hover:underline">
                        {t.tasks.linked}: {linked.title}
                      </Link>
                      <FileNow id={task.complianceId} />
                    </div>
                  )}
                </div>
                <label className="text-xs">
                  <span className="sr-only">
                    {t.tasks.title} {task.title}
                  </span>
                  <select
                    value={task.status}
                    onChange={(e) => setTaskStatus(task.id, e.target.value as TaskStatus)}
                    className="h-9 rounded-md border border-neutral-200 bg-white px-2 font-mono text-[11px]"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {labels[s]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mt-3 text-sm font-medium">{task.nextAction}</p>
              {portalById(task.complianceId) && (
                <div className="mt-4">
                  <button
                    type="button"
                    className="text-sm font-medium underline-offset-4 hover:underline"
                    onClick={() => setOpen(open === task.id ? null : task.id)}
                  >
                    {open === task.id ? t.common.close : t.nav.file}
                  </button>
                  {open === task.id && (
                    <div className="mt-4">
                      <PortalSession portalId={task.complianceId as PortalId} />
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
