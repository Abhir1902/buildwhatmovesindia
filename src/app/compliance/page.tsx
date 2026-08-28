"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ComplianceItem } from "@/components/compliance/compliance-item";
import { allRequirements } from "@/data/requirements";
import { businessProfile } from "@/data/business";
import { useI18n } from "@/i18n/provider";

const filters = ["all", "attention", "upcoming", "completed"] as const;

export default function CompliancePage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const items = useMemo(() => {
    if (filter === "all")
      return allRequirements
        .filter(
          (r) =>
            ["posh", "gst", "shops", "epf", "esi", "mca", "factory", "ptax"].includes(r.id) ||
            r.status !== "healthy",
        )
        .slice(0, 14);
    if (filter === "completed") return allRequirements.filter((r) => r.status === "healthy").slice(0, 12);
    if (filter === "attention") return allRequirements.filter((r) => r.status === "attention");
    return allRequirements.filter((r) => r.status === "upcoming").slice(0, 12);
  }, [filter]);

  const filterLabel = {
    all: t.compliance.filterAll,
    attention: t.compliance.filterAttention,
    upcoming: t.compliance.filterUpcoming,
    completed: t.compliance.filterCompleted,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[11px] text-neutral-500">
        {businessProfile.name} · {businessProfile.city} · {businessProfile.employees} {t.common.employees}
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{t.compliance.title}</h1>
      <p className="mt-2 max-w-lg text-neutral-600">{t.compliance.subtitle}</p>
      <p className="mt-3">
        <Link href="/file" className="text-sm font-medium underline-offset-4 hover:underline">
          {t.file.title}
        </Link>
      </p>
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={t.compliance.title}>
        {filters.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={`rounded-full border px-3 py-1 text-xs ${
              filter === key ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-600"
            }`}
          >
            {filterLabel[key]}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {items.map((item) => (
          <ComplianceItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
