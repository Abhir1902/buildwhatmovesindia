"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ComplianceItem } from "@/components/compliance/compliance-item";
import { useI18n } from "@/i18n/provider";
import { AppHeader } from "@/components/suite/app-header";
import { Input } from "@/components/ui/input";
import { requirementCopy } from "@/i18n/labels";
import { useDemo } from "@/state/demo-provider";
import { EmptyState } from "@/components/ui/states";
import { cn } from "@/lib/utils";
import type { ComplianceRequirement } from "@/domain/types";

const filters = ["all", "attention", "upcoming", "completed"] as const;
const coreIds = ["posh", "gst", "shops", "epf", "esi", "mca", "factory", "ptax"];

function statusRank(status: ComplianceRequirement["status"]) {
  if (status === "attention") return 0;
  if (status === "upcoming") return 1;
  return 2;
}

function filterRequirements(all: ComplianceRequirement[], filter: (typeof filters)[number]) {
  if (filter === "completed") return all.filter((r) => r.progress >= 100);
  if (filter === "attention") return all.filter((r) => r.status === "attention");
  if (filter === "upcoming") return all.filter((r) => r.status === "upcoming");
  return all.filter((r) => coreIds.includes(r.id) || r.status !== "healthy");
}

export default function CompliancePage() {
  const { t } = useI18n();
  const { requirements: allRequirements, business: businessProfile } = useDemo();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [query, setQuery] = useState("");
  const items = useMemo(() => {
    let list = filterRequirements(allRequirements, filter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((item) => {
        const copy = requirementCopy(t, item.id);
        return (
          (copy?.title ?? item.title).toLowerCase().includes(q) ||
          (copy?.category ?? item.category).toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.id.includes(q)
        );
      });
    }
    return [...list]
      .sort((a, b) => statusRank(a.status) - statusRank(b.status) || (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))
      .slice(0, 16);
  }, [allRequirements, filter, query, t]);

  const filterLabel = {
    all: t.compliance.filterAll,
    attention: t.compliance.filterAttention,
    upcoming: t.compliance.filterUpcoming,
    completed: t.compliance.filterCompleted,
  };

  return (
    <div className="mx-auto max-w-6xl">
      <AppHeader
        appId="register"
        extra={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] text-neutral-500">
              {businessProfile.name} · {businessProfile.city} · {businessProfile.employees} {t.common.employees}
            </p>
            <Link href="/file" className="text-sm font-medium underline-offset-4 hover:underline">
              {t.file.title}
            </Link>
          </div>
        }
      />
      <div className="rounded-xl border border-neutral-200 bg-[var(--surface)] p-4 shadow-[var(--elev-2)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.suite.searchPlaceholder}
            aria-label={t.suite.searchPlaceholder}
          />
          <p className="shrink-0 font-mono text-[11px] text-neutral-500">{items.length}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={t.compliance.title}>
          {filters.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                filter === key ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-600",
              )}
            >
              {filterLabel[key]}
            </button>
          ))}
        </div>
      </div>
      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState title={t.compliance.emptyTitle} body={t.compliance.emptyBody} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <ComplianceItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
