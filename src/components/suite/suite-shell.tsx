"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OpenAIMark } from "@/components/brand/setu-logo";
import { LanguageSelect } from "@/components/layout/language-select";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { appFromPath, railApps } from "@/suite/apps";
import { SuiteUiProvider } from "@/components/suite/suite-ui";
import { SideRail } from "@/components/suite/side-rail";
import { CommandBar } from "@/components/suite/command-bar";
import { CommandPalette } from "@/components/suite/command-palette";

export function SuiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname === "/" || pathname === "/login") {
    return <>{children}</>;
  }

  const current = appFromPath(pathname);

  return (
    <SuiteUiProvider>
      <div
        className="relative z-[1] min-h-dvh md:flex"
        style={{ ["--app-accent" as string]: current.accent }}
      >
        <SideRail current={current} />
        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <CommandBar />
          <main className="page-enter flex-1 px-4 py-8 pb-24 sm:px-8 md:pb-12 lg:px-12 lg:py-12">{children}</main>
          <footer className="no-print mt-auto border-t border-neutral-200 px-4 py-5 text-neutral-500 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-2 text-xs">
                {t.footer.built}
                <OpenAIMark className="h-[18px] w-[18px] shrink-0" />
                OpenAI
              </p>
              <p className="font-mono text-[11px]">#BuildWhatMovesIndia</p>
              <p className="text-xs">{t.footer.rights}</p>
            </div>
          </footer>
          <nav className="no-print sticky bottom-0 z-40 grid grid-cols-6 border-t border-neutral-200 bg-[var(--background)]/90 md:hidden" aria-label="Mobile apps">
            {railApps.map((app) => {
              const Icon = app.icon;
              const active = app.id === current.id;
              return (
                <Link
                  key={app.id}
                  href={app.href}
                  className={cn(
                    "mx-1 flex flex-col items-center gap-1 rounded-lg py-2 text-[9px]",
                    active ? "bg-neutral-200 text-neutral-950" : "text-neutral-500",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {t.suite.apps[app.id].name}
                </Link>
              );
            })}
          </nav>
          <div className="no-print md:hidden">
            <div className="px-4 pb-4">
              <LanguageSelect />
            </div>
          </div>
        </div>
        <CommandPalette />
      </div>
    </SuiteUiProvider>
  );
}
