"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { locales, type LocaleCode } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

type LanguageSelectProps = {
  openUp?: boolean;
};

export function LanguageSelect({ openUp = false }: LanguageSelectProps) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [box, setBox] = useState<{ top: number; bottom: number; left: number; width: number } | null>(null);
  const current = locales.find((item) => item.code === locale);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setBox({ top: r.top, bottom: r.bottom, left: r.left, width: r.width });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menu =
    mounted && open && box
      ? createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            className="fixed z-[80] max-h-72 overflow-auto rounded-md border border-neutral-200 bg-white py-1 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            style={{
              left: box.left,
              width: Math.max(box.width, 220),
              ...(openUp
                ? { bottom: window.innerHeight - box.top + 8 }
                : { top: box.bottom + 8 }),
            }}
          >
            {locales.map((item) => (
              <li key={item.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={item.code === locale}
                  onClick={() => {
                    setLocale(item.code as LocaleCode);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full flex-col items-start px-3 py-2.5 text-left hover:bg-neutral-50",
                    item.code === locale && "bg-neutral-100",
                  )}
                >
                  <span className="text-sm text-neutral-900">{item.native}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                    {item.english}
                  </span>
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={t.common.language}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 text-left text-xs text-neutral-800 transition-colors hover:border-neutral-400"
      >
        <span>
          {current?.native} · {current?.english}
        </span>
        <span className="font-mono text-[10px] text-neutral-400">{open ? "–" : "+"}</span>
      </button>
      {menu}
    </div>
  );
}
