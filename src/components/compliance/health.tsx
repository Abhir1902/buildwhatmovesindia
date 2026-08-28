"use client";

import Link from "next/link";
import { healthSummary } from "@/data/requirements";
import { useI18n } from "@/i18n/provider";

export function ComplianceHealth() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="health-heading">
      <h2 id="health-heading" className="text-sm text-neutral-500">
        {t.overview.healthTitle}
      </h2>
      <p className="mt-2 font-mono text-3xl tracking-tight">{healthSummary.total}</p>
      <p className="text-sm text-neutral-500">{t.overview.obligations}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-200" aria-hidden>
        <div
          className="h-full bg-neutral-900 transition-[width] duration-700"
          style={{ width: `${healthSummary.readiness}%` }}
        />
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <dt className="text-xs text-neutral-500">{t.overview.onTrack}</dt>
          <dd className="font-mono text-2xl">{healthSummary.onTrack}</dd>
        </div>
        <div>
          <dt className="text-xs text-neutral-500">{t.overview.upcoming}</dt>
          <dd className="font-mono text-2xl">{healthSummary.upcoming}</dd>
        </div>
        <div>
          <dt className="text-xs text-neutral-500">{t.overview.attention}</dt>
          <dd className="font-mono text-2xl">{healthSummary.attention}</dd>
        </div>
      </dl>
      <Link href="/file" className="mt-6 inline-block text-sm font-medium underline-offset-4 hover:underline">
        {t.file.title}
      </Link>
    </section>
  );
}
