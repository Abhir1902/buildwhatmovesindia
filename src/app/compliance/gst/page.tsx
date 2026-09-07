"use client";

import { SourcePanel, ConfidenceIndicator } from "@/components/compliance/source-panel";
import { ProfessionalCard } from "@/components/professionals/professional-card";
import { ObligationJourney } from "@/components/compliance/obligation-journey";
import { ComplianceAssistant } from "@/services/compliance-assistant";
import { PortalSession } from "@/components/filing/portal-session";
import { useI18n } from "@/i18n/provider";
import { useDemo } from "@/state/demo-provider";

export default function GstPage() {
  const { t } = useI18n();
  const { business: businessProfile, requirements } = useDemo();
  const item = requirements.find((row) => row.id === "gst");
  const explanation = ComplianceAssistant.explainRequirement("gst")!;
  const matches = ComplianceAssistant.recommendProfessionals("gst");

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[11px] text-neutral-500">
        {businessProfile.name} · GSTIN {businessProfile.gstin}
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{t.gst.title}</h1>
      <p className="mt-2 text-neutral-600">{t.gst.status}</p>

      <div className="mt-10">
        <PortalSession portalId="gst" />
      </div>

      <dl className="mt-10 grid gap-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{t.gst.registration}</dt>
          <dd className="mt-1">
            {t.business.registered} · {businessProfile.gstin}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{t.gst.upcomingFiling}</dt>
          <dd className="mt-1">16 Sep 2026</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{t.gst.requiredDocs}</dt>
          <dd className="mt-1">Invoice register, GSTR-3B draft, GST certificate</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{t.gst.recurring}</dt>
          <dd className="mt-1">Monthly / quarterly</dd>
        </div>
      </dl>

      <p className="mt-8 text-sm text-neutral-600">{explanation.why}</p>
      <ConfidenceIndicator value={explanation.confidence} />
      <SourcePanel sources={explanation.sources} jurisdiction={explanation.jurisdiction} />

      {item ? <ObligationJourney item={item} /> : null}

      <section className="mt-16">
        <h2 className="text-2xl font-medium tracking-tight">{t.gst.helpTitle}</h2>
        <p className="mt-2 text-sm text-neutral-500">{t.gst.helpHint}</p>
        {matches.map((p) => (
          <ProfessionalCard key={p.id} professional={p} requirementId="gst" requirementTitle={t.gst.title} />
        ))}
      </section>
    </div>
  );
}
