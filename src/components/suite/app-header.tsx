"use client";

import type { ReactNode } from "react";
import type { SuiteAppId } from "@/suite/apps";
import { useI18n } from "@/i18n/provider";
import { Separator } from "@/components/ui/separator";

export function AppHeader({
  appId,
  extra,
}: {
  appId: Exclude<SuiteAppId, "home">;
  extra?: ReactNode;
}) {
  const { t } = useI18n();
  const copy = t.suite.apps[appId];

  return (
    <header className="mb-8 space-y-3">
      <h1 className="text-4xl font-medium tracking-tight">{copy.name}</h1>
      <p className="max-w-xl text-neutral-600">{copy.purpose}</p>
      {extra}
      <Separator />
    </header>
  );
}
