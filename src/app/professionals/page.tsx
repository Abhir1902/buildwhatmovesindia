"use client";

import { useMemo, useState } from "react";
import { ComplianceAssistant } from "@/services/compliance-assistant";
import { ProfessionalCard } from "@/components/professionals/professional-card";
import { professionalTypeLabel } from "@/data/professionals";
import { FileNow } from "@/components/filing/file-now";
import { useI18n } from "@/i18n/provider";
import { AppHeader } from "@/components/suite/app-header";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDemo } from "@/state/demo-provider";
import type { ProfessionalType } from "@/domain/types";

const groups = ["posh", "gst", "factory", "mca", "epf", "shops", "esi", "ptax"] as const;

export default function ProfessionalsPage() {
  const { t } = useI18n();
  const { professionals, requirementsFeatured: requirements } = useDemo();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ProfessionalType | "all">("all");
  const types = useMemo(() => Array.from(new Set(professionals.map((p) => p.type))), [professionals]);
  const q = query.trim().toLowerCase();

  return (
    <div className="mx-auto max-w-3xl">
      <AppHeader appId="experts" extra={<p className="text-sm text-neutral-500">{t.professionals.subtitle}</p>} />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.suite.searchPlaceholder}
        aria-label={t.suite.searchPlaceholder}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setType("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs",
            type === "all" ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-600",
          )}
        >
          {t.documents.all}
        </button>
        {types.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setType(key)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              type === key ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-600",
            )}
          >
            {professionalTypeLabel[key]}
          </button>
        ))}
      </div>
      {groups.map((id) => {
        const req = requirements.find((r) => r.id === id);
        const people = ComplianceAssistant.recommendProfessionals(id).filter((person) => {
          if (type !== "all" && person.type !== type) return false;
          if (!q) return true;
          return (
            person.name.toLowerCase().includes(q) ||
            person.specialty.toLowerCase().includes(q) ||
            person.city.toLowerCase().includes(q)
          );
        });
        if (!req || people.length === 0) return null;
        return (
          <section key={id} className="mt-14">
            <h2 className="text-sm text-neutral-500">
              {t.professionals.for} {req.title}
            </h2>
            <p className="mt-2">
              <FileNow id={id} />
            </p>
            {people.map((p) => (
              <ProfessionalCard key={p.id} professional={p} requirementId={id} requirementTitle={req.title} />
            ))}
          </section>
        );
      })}
    </div>
  );
}
