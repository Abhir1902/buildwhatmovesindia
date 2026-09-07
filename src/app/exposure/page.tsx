"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { formatInr, openExposure, totalOpenExposure } from "@/lib/exposure";
import { useDemo } from "@/state/demo-provider";
import { FileNow } from "@/components/filing/file-now";
import { AppHeader } from "@/components/suite/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ExposurePage() {
  const { t } = useI18n();
  const { filings } = useDemo();
  const open = openExposure();
  const remaining = open.filter((item) => !filings.some((f) => f.portalId === item.requirementId));
  const remainingTotal = remaining.reduce((sum, item) => sum + item.amountInr, 0);

  return (
    <div className="mx-auto max-w-3xl">
      <AppHeader appId="exposure" extra={<p className="text-sm text-neutral-500">{t.suite.exposureSubtitle}</p>} />
      <p className="font-mono text-4xl">{formatInr(remainingTotal || totalOpenExposure())}</p>
      <p className="mt-1 text-sm text-neutral-500">
        {t.suite.exposureTotal} · {remaining.length} / {open.length}
      </p>
      <ul className="mt-8 space-y-4">
        {open.map((item) => {
          const filed = filings.some((f) => f.portalId === item.requirementId);
          return (
            <li key={item.requirementId}>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <CardTitle className="text-lg">{item.label}</CardTitle>
                  <p className="font-mono text-sm">{formatInr(item.amountInr)}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">{item.consequence}</p>
                  <p className="mt-2 text-xs text-neutral-500">{item.sourceNote}</p>
                  {filed ? (
                    <Badge className="mt-4">{t.suite.exposureFiled}</Badge>
                  ) : (
                    <div className="mt-4 flex gap-4">
                      <FileNow id={item.requirementId} />
                      <Link href={`/compliance/${item.requirementId}`} className="text-sm underline-offset-4 hover:underline">
                        {t.suite.openApp}
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
