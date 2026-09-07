"use client";

import { suiteApps } from "@/suite/apps";
import { AppTile } from "@/components/suite/app-tile";
import { useSuiteUi } from "@/components/suite/suite-ui";
import { useI18n } from "@/i18n/provider";

export function AppLauncher() {
  const { launcherOpen, setLauncherOpen } = useSuiteUi();
  const { t } = useI18n();
  if (!launcherOpen) return null;

  return (
    <>
      <button type="button" className="fixed inset-0 z-40 cursor-default bg-black/45" aria-label={t.common.close} onClick={() => setLauncherOpen(false)} />
      <div
        role="dialog"
        aria-label={t.suite.launcher}
        className="suite-panel no-print absolute top-12 left-3 z-50 w-[min(22rem,calc(100vw-1.5rem))] rounded-xl p-4"
      >
        <p className="mb-3 text-[11px] tracking-wide text-neutral-500 uppercase">{t.suite.appsHeading}</p>
        <div className="grid grid-cols-4 gap-1">
          {suiteApps.map((app) => (
            <AppTile key={app.id} app={app} size="md" onSelect={() => setLauncherOpen(false)} />
          ))}
        </div>
      </div>
    </>
  );
}
