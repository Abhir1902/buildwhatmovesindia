"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { useDemo } from "@/state/demo-provider";

export function ComplianceHealth() {
  const { t } = useI18n();
  const { health } = useDemo();
  return (
    <section aria-labelledby="health-heading">
      <h2 id="health-heading" className="text-sm text-neutral-500">
        {t.overview.healthTitle}
      </h2>
      <p className="mt-2 font-mono text-3xl tracking-tight">{health.total}</p>
      <p className="text-sm text-neutral-500">{t.overview.obligations}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-200" aria-hidden>
        <div
          className="h-full bg-neutral-900 transition-[width] duration-700"
          style={{ width: `${health.readiness}%` }}
        />
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <dt className="text-xs text-neutral-500">{t.overview.completed}</dt>
          <dd className="font-mono text-2xl">{health.completed}</dd>
        </div>
        <div>
          <dt className="text-xs text-neutral-500">{t.overview.pendingApproval}</dt>
          <dd className="font-mono text-2xl">{health.pendingApproval}</dd>
        </div>
        <div>
          <dt className="text-xs text-neutral-500">{t.overview.remaining}</dt>
          <dd className="font-mono text-2xl">{health.remaining}</dd>
        </div>
      </dl>
      <Link href="/file" className="mt-6 inline-block text-sm font-medium underline-offset-4 hover:underline">
        {t.nav.filing}
      </Link>
    </section>
  );
}
