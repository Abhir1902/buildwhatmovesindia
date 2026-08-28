"use client";

import { useState } from "react";
import { JourneyStep } from "@/components/compliance/journey-step";
import { SourcePanel, ConfidenceIndicator } from "@/components/compliance/source-panel";
import { ProfessionalCard } from "@/components/professionals/professional-card";
import { ComplianceAssistant } from "@/services/compliance-assistant";
import { businessProfile } from "@/data/business";
import { PortalSession } from "@/components/filing/portal-session";
import { useI18n } from "@/i18n/provider";

export default function PoshPage() {
  const { t } = useI18n();
  const journey = ComplianceAssistant.createJourney("posh")!;
  const explanation = ComplianceAssistant.explainRequirement("posh")!;
  const matches = ComplianceAssistant.recommendProfessionals("posh");
  const [why, setWhy] = useState(false);
  const [learn, setLearn] = useState(false);
  const pct = (journey.completedSteps / journey.totalSteps) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[11px] text-neutral-500">
        {businessProfile.name} · {businessProfile.city} · {businessProfile.employees} {t.common.employees}
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{t.posh.title}</h1>
      <p className="mt-2 text-neutral-600">{t.posh.subtitle}</p>

      <div className="mt-10">
        <PortalSession portalId="posh" />
      </div>
      <p className="mt-6 font-mono text-xs text-neutral-500">
        {t.posh.progress.replace("{done}", String(journey.completedSteps)).replace("{total}", String(journey.totalSteps))}
      </p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-200" aria-hidden>
        <div className="h-full bg-neutral-900 transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>

      <section className="mt-12">
        {journey.steps.map((step) => (
          <JourneyStep key={step.id} step={step} />
        ))}
      </section>

      <section className="mt-12 border-t border-neutral-200 pt-10">
        <button type="button" className="text-left" onClick={() => setWhy((v) => !v)} aria-expanded={why}>
          <h2 className="text-2xl font-medium tracking-tight">{t.posh.whyTitle}</h2>
        </button>
        {why && (
          <div className="mt-4 space-y-4 text-sm text-neutral-600">
            <p>{t.posh.whyBody}</p>
            <p>{explanation.why}</p>
            <p>{t.posh.verify}</p>
            <button type="button" className="font-medium underline-offset-4 hover:underline" onClick={() => setLearn((v) => !v)}>
              {t.posh.learnMore}
            </button>
            {learn && (
              <div>
                <ConfidenceIndicator value={explanation.confidence} />
                <SourcePanel sources={explanation.sources} jurisdiction={explanation.jurisdiction} />
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-medium tracking-tight">{t.posh.helpTitle}</h2>
        <p className="mt-2 text-neutral-600">{t.posh.helpBody}</p>
        <p className="mt-2 text-sm text-neutral-500">{t.posh.helpHint}</p>
        {matches.map((p) => (
          <ProfessionalCard
            key={p.id}
            professional={p}
            requirementId="posh"
            requirementTitle={t.posh.title}
          />
        ))}
      </section>
    </div>
  );
}
