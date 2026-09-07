"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ComplianceAssistant } from "@/services/compliance-assistant";
import { useI18n } from "@/i18n/provider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSuiteUi } from "@/components/suite/suite-ui";

export function AskSetu() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { setPaletteOpen } = useSuiteUi();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const matches = ComplianceAssistant.search(query).filter((hit) => hit.group !== "apps").slice(0, 6);
    const list = matches.length ? matches : ComplianceAssistant.suggestions().map((item) => ({ ...item, group: "actions" as const, score: 1 }));
    const labels: Record<string, { title: string; reason: string }> = {
      posh: { title: t.ask.poshTitle, reason: t.ask.poshReason },
      gst: { title: t.ask.gstTitle, reason: t.ask.gstReason },
      hire: { title: t.ask.hireTitle, reason: t.ask.hireReason },
      location: { title: t.ask.locationTitle, reason: t.ask.locationReason },
      missing: { title: t.ask.missingTitle, reason: t.ask.missingReason },
      professional: { title: t.ask.professionalTitle, reason: t.ask.professionalReason },
    };
    return list.map((item) => ({
      ...item,
      title: labels[item.id]?.title ?? item.title,
      reason: labels[item.id]?.reason ?? item.reason,
    }));
  }, [query, t]);

  const chips = [t.ask.chipPosh, t.ask.chipGst, t.ask.chipHire, t.ask.chipLocation, t.ask.chipMissing];

  function close() {
    setOpen(false);
  }

  function go(href: string) {
    close();
    setLoading(true);
    router.push(href);
  }

  return (
    <section className="relative" aria-label="Ask Setu">
      {open && (
        <button type="button" className="fixed inset-0 z-20 cursor-default bg-transparent" aria-label={t.ask.closeList} onPointerDown={close} />
      )}
      <div className="relative z-30">
        <label htmlFor="ask-setu" className="sr-only">
          {t.overview.askPlaceholder}
        </label>
        <Input
          id="ask-setu"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && suggestions[0]) go(suggestions[0].href);
            if (e.key === "Escape") close();
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
              e.preventDefault();
              setPaletteOpen(true);
            }
          }}
          placeholder={t.overview.askPlaceholder}
          className="h-12 bg-white text-base"
          autoComplete="off"
        />
        {loading && <p className="mt-3 font-mono text-xs text-neutral-500">{t.overview.understanding}</p>}
        {open && (
          <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[var(--elev-8)]">
            {suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    go(item.href);
                  }}
                  className={cn("flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left hover:bg-neutral-50")}
                >
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-neutral-500">{item.reason}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <button
              key={`${locale}-${index}`}
              type="button"
              onPointerDown={(event) => {
                event.stopPropagation();
                setQuery(chip);
                setOpen(true);
              }}
            >
              <Badge variant="outline" className="cursor-pointer font-normal">
                {chip}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
