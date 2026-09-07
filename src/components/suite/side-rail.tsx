"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { railApps, type SuiteApp } from "@/suite/apps";
import { useI18n } from "@/i18n/provider";
import { useSuiteUi } from "@/components/suite/suite-ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { SidebarLeft01Icon, SidebarRight01Icon } from "@hugeicons/core-free-icons";

export function SideRail({ current }: { current: SuiteApp }) {
  const { t } = useI18n();
  const { railCollapsed, setRailCollapsed } = useSuiteUi();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "no-print hidden shrink-0 border-r border-neutral-200/80 bg-[var(--surface)] transition-[width] duration-200 ease-out md:flex md:flex-col",
          railCollapsed ? "w-16" : "w-56",
        )}
      >
        <button
          type="button"
          className={cn(
            "flex items-center rounded-md text-neutral-700 hover:bg-neutral-100",
            railCollapsed
              ? "mx-auto mt-2 mb-2 h-10 w-10 justify-center"
              : "m-2 h-9 justify-start gap-2 px-2",
          )}
          aria-expanded={!railCollapsed}
          aria-label={railCollapsed ? t.suite.expandRail : t.suite.collapseRail}
          onClick={() => setRailCollapsed(!railCollapsed)}
        >
          <HugeiconsIcon icon={railCollapsed ? SidebarRight01Icon : SidebarLeft01Icon} size={18} />
          {!railCollapsed ? (
            <span className="text-xs font-medium">{t.suite.collapseRail}</span>
          ) : null}
        </button>
        <nav
          className={cn("flex flex-1 flex-col gap-0.5", railCollapsed ? "items-center px-0 pb-2" : "p-2 pt-0")}
          aria-label="Apps"
        >
          {railApps.map((app) => {
            const Icon = app.icon;
            const active = app.id === current.id;
            const copy = t.suite.apps[app.id];
            const link = (
              <Link
                href={app.href}
                className={cn(
                  "flex items-center rounded-lg text-sm transition-colors duration-[var(--dur-fast)]",
                  railCollapsed ? "h-10 w-10 justify-center" : "gap-3 px-2.5 py-2.5",
                  active ? "bg-neutral-200 text-neutral-950" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
                )}
              >
                <Icon className="block h-5 w-5 shrink-0" />
                {!railCollapsed && <span className="truncate font-medium">{copy.name}</span>}
              </Link>
            );
            if (!railCollapsed) return <div key={app.id}>{link}</div>;
            return (
              <div key={app.id} className="relative flex w-full justify-center">
                {active ? (
                  <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-neutral-950" aria-hidden />
                ) : null}
                <Tooltip>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{copy.name}</TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
