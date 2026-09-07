import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SuiteApp } from "@/suite/apps";
import { useI18n } from "@/i18n/provider";

export function AppTile({
  app,
  size = "md",
  showLabel = true,
  onSelect,
}: {
  app: SuiteApp;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  onSelect?: () => void;
}) {
  const { t } = useI18n();
  const Icon = app.icon;
  const copy = t.suite.apps[app.id];

  return (
    <Link
      href={app.href}
      onClick={onSelect}
      className={cn("suite-tile group flex flex-col items-center gap-2 rounded-xl p-2 text-center", showLabel ? "min-w-20" : "p-1")}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800 group-hover:bg-neutral-200">
        <Icon className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5", "shrink-0")} />
      </span>
      {showLabel ? (
        <span className="max-w-24 text-[11px] leading-tight font-medium text-neutral-800">{copy.name}</span>
      ) : (
        <span className="sr-only">{copy.name}</span>
      )}
    </Link>
  );
}
