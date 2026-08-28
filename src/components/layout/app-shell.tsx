"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SetuLogo } from "@/components/brand/setu-logo";
import { OpenAIMark } from "@/components/brand/setu-logo";
import { LanguageSelect } from "@/components/layout/language-select";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { businessProfile } from "@/data/business";

const main = ["overview", "compliance", "file", "tasks", "professionals", "documents"] as const;
const secondary = ["business", "settings"] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();

  const item = (key: (typeof main)[number] | (typeof secondary)[number]) => {
    const href = `/${key}`;
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        key={key}
        href={href}
        className={cn(
          "block rounded-md px-3 py-2 text-sm transition-colors duration-150",
          active ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
        )}
      >
        {t.nav[key]}
      </Link>
    );
  };

  return (
    <div className="relative z-[1] min-h-dvh md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-neutral-200/80 bg-transparent md:flex md:flex-col">
        <div className="px-6 py-7">
          <Link href="/overview" aria-label="SETU home">
            <SetuLogo />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-8 px-3" aria-label="Primary">
          <div className="space-y-1">{main.map(item)}</div>
          <div className="mt-auto space-y-1 pb-4">{secondary.map(item)}</div>
        </nav>
        <div className="space-y-3 border-t border-neutral-200 p-4">
          <p className="font-mono text-[11px] text-neutral-500">
            {businessProfile.name}
          </p>
          <LanguageSelect openUp />
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-transparent px-4 py-3 md:hidden">
          <Link href="/overview" aria-label="SETU home">
            <SetuLogo />
          </Link>
          <div className="min-w-48 max-w-56">
            <LanguageSelect />
          </div>
        </header>
        <main className="page-enter flex-1 px-4 py-8 pb-24 sm:px-8 md:pb-12 lg:px-12 lg:py-12">{children}</main>
        <SiteFooter />
        <nav
          className="sticky bottom-0 z-40 grid grid-cols-6 border-t border-neutral-200 bg-[var(--background)]/90 md:hidden"
          aria-label="Mobile"
        >
          {main.map((key) => {
            const href = `/${key}`;
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[9px] tracking-wide sm:text-[10px]",
                  active ? "text-neutral-950" : "text-neutral-500",
                )}
              >
                {t.nav[key]}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto border-t border-neutral-200 px-4 py-5 text-neutral-500 sm:px-8 lg:px-12">
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
  );
}
