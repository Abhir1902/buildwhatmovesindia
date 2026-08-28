"use client";

import { ComplianceAssistant } from "@/services/compliance-assistant";
import { ProfessionalCard } from "@/components/professionals/professional-card";
import { requirements } from "@/data/requirements";
import { FileNow } from "@/components/filing/file-now";
import { useI18n } from "@/i18n/provider";

export default function ProfessionalsPage() {
  const { t } = useI18n();
  const groups = ["posh", "gst", "factory", "mca", "epf", "shops", "esi", "ptax"] as const;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-medium tracking-tight">{t.professionals.title}</h1>
      <p className="mt-2 max-w-xl text-neutral-600">{t.professionals.subtitle}</p>
      {groups.map((id) => {
        const req = requirements.find((r) => r.id === id);
        const people = ComplianceAssistant.recommendProfessionals(id);
        if (!req) return null;
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
