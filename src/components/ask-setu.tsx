"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ComplianceAssistant } from "@/services/compliance-assistant";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function AskSetu() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const matches = ComplianceAssistant.matchIntent(query);
    const list = matches.length ? matches : ComplianceAssistant.suggestions();
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
        <button
          type="button"
          className="fixed inset-0 z-20 cursor-default bg-transparent"
          aria-label={t.ask.closeList}
          onPointerDown={close}
        />
      )}
      <div className="relative z-30">
        <label htmlFor="ask-setu" className="sr-only">
          {t.overview.askPlaceholder}
        </label>
        <input
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
          }}
          placeholder={t.overview.askPlaceholder}
          className="h-14 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base outline-none transition-shadow duration-150 placeholder:text-neutral-400 focus:border-neutral-400 focus:shadow-[0_0_0_4px_rgba(20,20,19,0.06)]"
          autoComplete="off"
        />
        {loading && <p className="mt-3 font-mono text-xs text-neutral-500">{t.overview.understanding}</p>}
        {open && (
          <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
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
              className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 hover:border-neutral-400"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
