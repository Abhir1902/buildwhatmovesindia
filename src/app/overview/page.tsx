"use client";

import Link from "next/link";
import { AskSetu } from "@/components/ask-setu";
import { ComplianceHealth } from "@/components/compliance/health";
import { businessProfile } from "@/data/business";
import { requirements } from "@/data/requirements";
import { daysUntil } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import { requirementCopy } from "@/i18n/labels";
import { FileNow } from "@/components/filing/file-now";
import { portals } from "@/data/portals";

export default function OverviewPage() {
  const { t, locale } = useI18n();
  const attention = requirements.filter((r) => r.status === "attention" || r.id === "gst" || r.id === "shops").slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl space-y-16">
      <header className="space-y-4">
        <p className="text-sm text-neutral-500">{t.overview.greeting}</p>
        <h1 className="max-w-xl text-4xl font-medium tracking-tight sm:text-5xl">{t.overview.ready}</h1>
        <p className="text-neutral-600">{t.overview.attentionCount}</p>
        <p className="font-mono text-[11px] text-neutral-500">
          {businessProfile.name} · {businessProfile.city} · {businessProfile.employees} {t.common.employees}
        </p>
      </header>

      <AskSetu key={locale} />

      <section className="space-y-4">
        <h2 className="text-sm text-neutral-500">{t.file.title}</h2>
        <p className="max-w-xl text-neutral-600">{t.file.subtitle}</p>
        <ul className="divide-y divide-neutral-200 border-y">
          {portals.map((portal) => (
            <li key={portal.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium">{t.file.portals[portal.id]}</p>
              <FileNow id={portal.id} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="attention-heading" className="space-y-6">
        <h2 id="attention-heading" className="text-sm text-neutral-500">
          {t.overview.needsAttention}
        </h2>
        <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
          {attention.map((item) => {
            const due = item.dueDate ? daysUntil(item.dueDate) : null;
            return (
              <li key={item.id} className="flex flex-col gap-2 py-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-lg font-medium">{requirementCopy(t, item.id)?.title ?? item.title}</p>
                  <p className="text-sm text-neutral-500">{requirementCopy(t, item.id)?.category ?? item.category}</p>
                </div>
                  <div className="flex items-center gap-6">
                  {due !== null && (
                    <p className="font-mono text-xs text-neutral-500">
                      {t.overview.dueIn.replace("{n}", String(due))}
                    </p>
                  )}
                  <FileNow id={item.id} />
                  <Link href={item.href} className="text-sm font-medium underline-offset-4 hover:underline">
                    {requirementCopy(t, item.id)?.action ?? `${item.nextAction} →`}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <ComplianceHealth />

      <p className="max-w-xl text-xs leading-5 text-neutral-500">{t.overview.disclaimer}</p>
    </div>
  );
}
