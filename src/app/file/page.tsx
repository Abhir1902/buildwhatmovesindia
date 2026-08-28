"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PortalSession } from "@/components/filing/portal-session";
import { portals, type PortalId } from "@/data/portals";
import { useI18n } from "@/i18n/provider";

function FileDesks() {
  const { t } = useI18n();
  const params = useSearchParams();
  const focus = params.get("p") as PortalId | null;
  const ordered = useMemo(() => {
    if (!focus) return portals;
    const first = portals.find((item) => item.id === focus);
    return first ? [first, ...portals.filter((item) => item.id !== focus)] : portals;
  }, [focus]);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <h1 className="text-4xl font-medium tracking-tight">{t.file.title}</h1>
        <p className="mt-3 max-w-xl text-neutral-600">{t.file.subtitle}</p>
      </header>
      <div className="space-y-8">
        {ordered.map((portal) => (
          <PortalSession key={portal.id} portalId={portal.id} />
        ))}
      </div>
    </div>
  );
}

export default function FilePage() {
  return (
    <Suspense fallback={null}>
      <FileDesks />
    </Suspense>
  );
}
