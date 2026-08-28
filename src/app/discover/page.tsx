"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ComplianceAssistant } from "@/services/compliance-assistant";
import { useDemo } from "@/state/demo-provider";
import { SourcePanel } from "@/components/compliance/source-panel";
import type { DiscoveryAnswers } from "@/domain/types";
import { FileNow } from "@/components/filing/file-now";
import { useI18n } from "@/i18n/provider";

export default function DiscoverPage() {
  const { t } = useI18n();
  const questions: { key: keyof DiscoveryAnswers; label: string; options?: string[] }[] = [
    { key: "entity", label: t.discover.q0, options: ["Private Limited", "LLP", "Partnership", "Sole proprietor"] },
    { key: "location", label: t.discover.q1, options: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat"] },
    { key: "industry", label: t.discover.q2, options: ["Engineering / Manufacturing", "Retail", "IT / Services", "Food"] },
    { key: "employees", label: t.discover.q3, options: ["1–9", "10–19", "20–99", "100+"] },
    { key: "turnover", label: t.discover.q4, options: ["Under ₹40 lakh", "₹40 lakh–₹2 Cr", "₹2–20 Cr", "Above ₹20 Cr"] },
    { key: "importExport", label: t.discover.q5, options: [t.business.no, t.business.yes] },
    { key: "locations", label: t.discover.q6, options: ["1", "2", "3+"] },
  ];
  const { markDiscoveryDone } = useDemo();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiscoveryAnswers>({
    entity: "Private Limited",
    location: "Maharashtra",
    industry: "Engineering / Manufacturing",
    employees: "10–19",
    turnover: "₹2–20 Cr",
    activities: ["manufacturing"],
    importExport: false,
    locations: "1",
  });
  const [done, setDone] = useState(false);
  const q = questions[step];

  if (done) {
    const map = ComplianceAssistant.discover(answers);
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-medium tracking-tight">{t.discover.mapTitle}</h1>
        <p className="mt-2 text-sm text-neutral-500">{t.discover.mapNote}</p>
        <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-neutral-500">{t.discover.attention}</dt>
            <dd className="font-mono text-3xl">{map.attention.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">{t.discover.upcoming}</dt>
            <dd className="font-mono text-3xl">{map.upcoming.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">{t.discover.healthy}</dt>
            <dd className="font-mono text-3xl">{map.healthy}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">{t.discover.potential}</dt>
            <dd className="font-mono text-3xl">{map.potential.length}</dd>
          </div>
        </dl>
        <ul className="mt-10 divide-y divide-neutral-200 border-y">
          {[...map.attention, ...map.potential].map((item) => (
            <li key={item.id} className="py-6">
              <p className="text-lg font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-neutral-600">{item.applicability}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                {item.status} · {item.confidence} · {item.nextAction}
              </p>
              <div className="mt-3">
                <FileNow id={item.id} />
              </div>
              <SourcePanel sources={item.sources} jurisdiction={item.jurisdiction} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="font-mono text-xs text-neutral-500">
        {step + 1} / {questions.length}
      </p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight">{q.label}</h1>
      <p className="mt-2 text-sm text-neutral-500">{t.discover.intro}</p>
      <div className="mt-8 space-y-2">
        {q.options?.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              const next = { ...answers };
              if (q.key === "importExport") next.importExport = opt === t.business.yes;
              else (next as Record<string, unknown>)[q.key] = opt;
              setAnswers(next);
            }}
            className="block w-full rounded-md border border-neutral-200 px-4 py-3 text-left text-sm hover:border-neutral-400"
          >
            {opt}
          </button>
        ))}
      </div>
      <Button
        className="mt-8"
        onClick={() => {
          if (step === questions.length - 1) {
            markDiscoveryDone();
            setDone(true);
          } else setStep((s) => s + 1);
        }}
      >
        {step === questions.length - 1 ? t.discover.generate : t.discover.continue}
      </Button>
    </div>
  );
}
