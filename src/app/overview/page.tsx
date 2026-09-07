"use client";

import Link from "next/link";
import { ComplianceDonut } from "@/components/home/compliance-donut";
import { CategoryBars, FilingBars, ReadinessTrend } from "@/components/home/dashboard-charts";
import { daysUntil, formatIndianDate } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import { requirementCopy } from "@/i18n/labels";
import { useDemo } from "@/state/demo-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Term } from "@/components/suite/plain-language";
import { formatInr, openExposure, totalOpenExposure } from "@/lib/exposure";
import { appById } from "@/suite/apps";

const serviceIds = ["discover", "filing", "experts"] as const;

export default function OverviewPage() {
  const { t } = useI18n();
  const { filings, tasks, business: businessProfile, health, requirementsFeatured: requirements } = useDemo();
  const reminders = [...requirements]
    .filter((r) => r.dueDate)
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-neutral-500">{t.overview.greeting}</p>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">{businessProfile.name}</h1>
        <Separator />
        <p className="font-mono text-[11px] text-neutral-500">
          <Term id="gstin">{businessProfile.gstin}</Term>
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{t.overview.healthTitle}</CardTitle>
            <CardDescription>
              {health.total} {t.overview.obligations}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ComplianceDonut readyLabel={t.overview.completed} />
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>{t.overview.businessTitle}</CardTitle>
            <CardDescription>{businessProfile.industry}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">{t.business.location}</dt>
                <dd>
                  {businessProfile.city}, {businessProfile.state}
                </dd>
              </div>
              <Separator />
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">{t.business.entity}</dt>
                <dd>{businessProfile.entity}</dd>
              </div>
              <Separator />
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">{t.business.employees}</dt>
                <dd>{businessProfile.employees}</dd>
              </div>
              <Separator />
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">{t.business.turnover}</dt>
                <dd>{businessProfile.annualTurnover}</dd>
              </div>
              <Separator />
              <div className="group relative flex justify-between gap-4">
                <dt className="text-neutral-500">{t.suite.exposureTotal}</dt>
                <dd className="font-medium">{formatInr(totalOpenExposure())}</dd>
                <div className="pointer-events-none absolute right-0 bottom-full z-20 mb-2 hidden w-max max-w-xs rounded-md border border-neutral-200 bg-[var(--surface)] px-2 py-1 text-left text-xs text-neutral-800 shadow-[var(--elev-8)] group-hover:block">
                  {openExposure().map((item) => (
                    <p key={item.requirementId}>
                      {item.label}: {formatInr(item.amountInr)}
                    </p>
                  ))}
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="flex h-full min-h-0 max-h-80 flex-col overflow-hidden print:max-h-none lg:h-0 lg:max-h-none lg:min-h-full">
          <CardHeader className="shrink-0">
            <CardTitle>{t.overview.reminders}</CardTitle>
            <CardDescription>{t.suite.nextDeadline}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 overflow-y-auto">
            <ul className="space-y-3">
              {reminders.map((item) => {
                const due = item.dueDate ? daysUntil(item.dueDate) : null;
                return (
                  <li key={item.id} className="rounded-lg bg-neutral-100 px-3 py-2.5">
                    <p className="text-sm font-medium">{requirementCopy(t, item.id)?.title ?? item.title}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {item.dueDate ? formatIndianDate(item.dueDate) : ""}
                      {due !== null ? ` · ${t.overview.dueIn.replace("{n}", String(due))}` : ""}
                    </p>
                    <Link href={item.href} className="mt-1 inline-block text-xs font-medium underline-offset-4 hover:underline">
                      {requirementCopy(t, item.id)?.action ?? item.nextAction}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium tracking-tight">{t.overview.services}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {serviceIds.map((id) => {
            const app = appById(id);
            const Icon = app.icon;
            const copy = t.suite.apps[id];
            return (
              <Link
                key={id}
                href={app.href}
                className="rounded-xl border border-neutral-200 bg-[var(--surface)] p-5 shadow-[var(--elev-2)] transition-[transform,box-shadow] duration-[var(--dur-fast)] hover:-translate-y-px hover:shadow-[var(--elev-8)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-medium">{copy.name}</h3>
                <p className="mt-1 text-sm text-neutral-500">{copy.purpose}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid items-start gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.overview.readinessTrend}</CardTitle>
            <CardDescription>{t.overview.readinessTrendHint}</CardDescription>
          </CardHeader>
          <CardContent>
            <ReadinessTrend />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.overview.filingHistory}</CardTitle>
            <CardDescription>{t.overview.filingHistoryHint}</CardDescription>
          </CardHeader>
          <CardContent>
            <FilingBars />
            <div className="mt-4 flex gap-4 text-[11px] text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 bg-neutral-950" /> GST
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 bg-neutral-500" /> EPF
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 bg-neutral-300" /> {t.overview.otherFilings}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{t.overview.categoryMix}</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryBars />
        </CardContent>
      </Card>

      <div className="no-print flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          {t.suite.report}
        </Button>
        <p className="text-xs text-neutral-500">
          {filings.length} filings · {tasks.filter((task) => task.status !== "completed").length} open tasks
        </p>
      </div>

      <section className="print-only">
        <h2 className="text-xl font-medium">{t.suite.reportTitle}</h2>
        <p className="mt-2 text-sm">
          {businessProfile.name} · {formatInr(totalOpenExposure())} open exposure · {filings.length} filings
        </p>
        <ul className="mt-4 list-disc pl-5 text-sm">
          {reminders.map((item) => (
            <li key={item.id}>
              {item.title} {item.dueDate ? `· ${item.dueDate}` : ""}
            </li>
          ))}
        </ul>
      </section>

      <p className="max-w-xl text-xs leading-5 text-neutral-500">{t.overview.disclaimer}</p>
    </div>
  );
}
