"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ComplianceAssistant } from "@/services/compliance-assistant";
import { useSuiteUi } from "@/components/suite/suite-ui";
import { useI18n } from "@/i18n/provider";
import { suiteApps } from "@/suite/apps";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useSuiteUi();
  const { t } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
      if (e.key === "Escape") setPaletteOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key >= "0" && e.key <= "9") {
        const app = suiteApps.find((item) => item.shortcut === e.key);
        if (app) {
          e.preventDefault();
          router.push(app.href);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, router, setPaletteOpen]);

  const hits = useMemo(() => ComplianceAssistant.search(q).slice(0, 12), [q]);

  if (!paletteOpen) return null;

  function go(href: string) {
    setPaletteOpen(false);
    setQ("");
    router.push(href);
  }

  const groups = ["apps", "actions", "items", "glossary"] as const;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/45 px-4 pt-[12vh]">
      <button type="button" className="absolute inset-0" aria-label={t.common.close} onClick={() => setPaletteOpen(false)} />
      <div role="dialog" aria-label={t.suite.search} className="suite-panel relative z-10 w-full max-w-xl overflow-hidden rounded-xl">
        <Command shouldFilter={false}>
          <CommandInput
            autoFocus
            value={q}
            onValueChange={setQ}
            placeholder={t.suite.searchHint}
          />
          <CommandList>
            {hits.length === 0 ? <CommandEmpty>{t.suite.emptySearch}</CommandEmpty> : null}
            {groups.map((group) => {
              const rows = hits.filter((hit) => hit.group === group);
              if (!rows.length) return null;
              const label =
                group === "apps"
                  ? t.suite.groupApps
                  : group === "actions"
                    ? t.suite.groupActions
                    : group === "glossary"
                      ? t.suite.groupGlossary
                      : t.suite.groupItems;
              return (
                <CommandGroup key={group} heading={label}>
                  {rows.map((hit) => (
                    <CommandItem key={hit.id} value={hit.id} onSelect={() => go(hit.href)}>
                      <span className="text-sm font-medium">
                        {hit.group === "apps" ? t.suite.apps[hit.title as keyof typeof t.suite.apps]?.name ?? hit.title : hit.title}
                      </span>
                      <span className="text-xs text-neutral-500">{hit.reason}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
