"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PortalSession } from "@/components/filing/portal-session";
import { type PortalId } from "@/data/portals";
import { Term } from "@/components/suite/plain-language";
import { AppHeader } from "@/components/suite/app-header";
import { useDemo } from "@/state/demo-provider";

function FileDesks() {
  const { portals } = useDemo();
  const params = useSearchParams();
  const focus = params.get("p") as PortalId | null;
  const ordered = useMemo(() => {
    if (!focus) return portals;
    const first = portals.find((item) => item.id === focus);
    return first ? [first, ...portals.filter((item) => item.id !== focus)] : portals;
  }, [focus, portals]);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <AppHeader
          appId="filing"
          extra={
            <p className="text-sm text-neutral-500">
              Mock OTP is <span className="font-mono">123456</span>. Acknowledgements such as an <Term id="arn">ARN</Term> stay in Vault.
            </p>
          }
        />
      </header>
      <div className="space-y-8">
        {ordered.map((portal) => (
          <PortalSession key={portal.id} portalId={portal.id as PortalId} />
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
