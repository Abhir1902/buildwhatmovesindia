"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { useDemo } from "@/state/demo-provider";

const R = 42;
const C = 2 * Math.PI * R;

export function ComplianceDonut({ readyLabel }: { readyLabel: string }) {
  const { t } = useI18n();
  const { health } = useDemo();
  const slices = [
    { key: "completed" as const, value: health.completed, color: "#141413", swatch: "bg-neutral-950" },
    { key: "pendingApproval" as const, value: health.pendingApproval, color: "#8a8680", swatch: "bg-neutral-500" },
    { key: "remaining" as const, value: health.remaining, color: "#d9d6d0", swatch: "bg-neutral-300" },
  ];
  const arcs = slices.reduce<
    { key: (typeof slices)[number]["key"]; color: string; swatch: string; length: number; offset: number; value: number }[]
  >((list, slice) => {
    const length = (slice.value / health.total) * C;
    const offset = list.reduce((sum, item) => sum + item.length, 0);
    list.push({ key: slice.key, color: slice.color, swatch: slice.swatch, length, offset, value: slice.value });
    return list;
  }, []);
  const [hover, setHover] = useState<(typeof arcs)[number] | null>(null);
  const labels = {
    completed: t.overview.completed,
    pendingApproval: t.overview.pendingApproval,
    remaining: t.overview.remaining,
  };

  const centerValue = hover ? String(hover.value) : `${health.readiness}%`;
  const centerLabel = hover ? labels[hover.key] : readyLabel;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg viewBox="0 0 120 120" className="h-44 w-44" aria-hidden>
        <circle cx="60" cy="60" r={R} fill="none" stroke="#f3f1ec" strokeWidth="14" />
        <g transform="rotate(-90 60 60)">
          {arcs.map((arc) => (
            <circle
              key={arc.key}
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke={arc.color}
              strokeWidth={hover?.key === arc.key ? 16 : 14}
              strokeDasharray={`${arc.length} ${C - arc.length}`}
              strokeDashoffset={-arc.offset}
              strokeLinecap="butt"
              className="cursor-pointer"
              style={{ pointerEvents: "stroke" }}
              onPointerEnter={() => setHover(arc)}
              onPointerLeave={() => setHover(null)}
            />
          ))}
        </g>
        <text x="60" y="56" textAnchor="middle" className="fill-neutral-950" style={{ fontSize: hover ? 20 : 22, fontWeight: 500 }}>
          {centerValue}
        </text>
        <text x="60" y="72" textAnchor="middle" className="fill-neutral-500" style={{ fontSize: 8 }}>
          {centerLabel}
        </text>
      </svg>
      <ul className="w-full space-y-1.5 text-[11px] text-neutral-600">
        {arcs.map((arc) => {
          const pct = Math.round((arc.value / health.total) * 100);
          return (
            <li key={arc.key}>
              <button
                type="button"
                className="group flex w-full cursor-pointer items-center justify-between rounded-md px-1 py-0.5 text-left hover:bg-neutral-100"
                onPointerEnter={() => setHover(arc)}
                onPointerLeave={() => setHover(null)}
              >
                <span className="inline-flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${arc.swatch}`} />
                  {labels[arc.key]}
                </span>
                <span className="font-mono">
                  <span className="group-hover:hidden">{arc.value}</span>
                  <span className="hidden group-hover:inline">
                    {arc.value} · {pct}%
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
