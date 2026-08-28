"use client";

import { PortalSession } from "@/components/filing/portal-session";
import { ProfessionalCard } from "@/components/professionals/professional-card";
import { SourcePanel, ConfidenceIndicator } from "@/components/compliance/source-panel";
import { ComplianceAssistant } from "@/services/compliance-assistant";
import { portalById, type PortalId } from "@/data/portals";
import { requirements } from "@/data/requirements";
import { businessProfile } from "@/data/business";
import { requirementCopy } from "@/i18n/labels";
import { useI18n } from "@/i18n/provider";

export function RequirementDesk({ id }: { id: PortalId }) {
  const { t } = useI18n();
  const portal = portalById(id);
  const item = requirements.find((r) => r.id === id);
  if (!portal || !item) return null;
  const copy = requirementCopy(t, id);
  const explanation = ComplianceAssistant.explainRequirement(id);
  const matches = ComplianceAssistant.recommendProfessionals(id);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[11px] text-neutral-500">
        {businessProfile.name} · {businessProfile.city}
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{copy?.title ?? item.title}</h1>
      <p className="mt-2 text-neutral-600">{copy?.category ?? item.category}</p>
      <p className="mt-4 max-w-xl text-sm text-neutral-600">{item.description}</p>

      <div className="mt-10">
        <PortalSession portalId={id} />
      </div>

      {explanation && (
        <div className="mt-10">
          <p className="text-sm text-neutral-600">{explanation.why}</p>
          <ConfidenceIndicator value={explanation.confidence} />
          <SourcePanel sources={explanation.sources} jurisdiction={explanation.jurisdiction} />
        </div>
      )}

      {matches.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-medium tracking-tight">{t.posh.helpTitle}</h2>
          <p className="mt-2 text-sm text-neutral-500">{t.posh.helpHint}</p>
          {matches.map((p) => (
            <ProfessionalCard
              key={p.id}
              professional={p}
              requirementId={id}
              requirementTitle={copy?.title ?? item.title}
            />
          ))}
        </section>
      )}
    </div>
  );
}
