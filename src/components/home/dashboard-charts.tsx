"use client";

import { useState, type ReactNode } from "react";
import { useI18n } from "@/i18n/provider";
import { useDemo } from "@/state/demo-provider";
import { cn } from "@/lib/utils";

function HoverCard({ children, label, className }: { children: ReactNode; label: ReactNode; className?: string }) {
  return (
    <div className={cn("group relative", className)}>
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-max -translate-x-1/2 rounded-md border border-neutral-200 bg-[var(--surface)] px-2 py-1 text-left text-xs text-neutral-800 shadow-[var(--elev-8)] group-hover:block">
        {label}
      </div>
    </div>
  );
}

export function ReadinessTrend() {
  const { t } = useI18n();
  const { dashboard } = useDemo();
  const readinessTrend = dashboard.readinessTrend;
  const [hover, setHover] = useState<(typeof readinessTrend)[number] & { x: number; y: number } | null>(null);
  const max = 100;
  const w = 320;
  const h = 140;
  const pad = 16;
  const points = readinessTrend.map((row, i) => {
    const x = pad + (i * (w - pad * 2)) / (readinessTrend.length - 1);
    const y = h - pad - (row.value / max) * (h - pad * 2);
    return { ...row, x, y };
  });
  const area = `M${points[0].x} ${points[0].y} L${points.map((p) => `${p.x},${p.y}`).join(" L")} L${w - pad} ${h - pad} L${pad} ${h - pad} Z`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full" role="img" aria-label="Readiness over six months">
        <path d={area} fill="#141413" fillOpacity="0.08" />
        <polyline points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#141413" strokeWidth="2" />
        {points.map((row) => (
          <g
            key={row.month}
            onPointerEnter={() => setHover(row)}
            onPointerLeave={() => setHover(null)}
            className="cursor-pointer"
          >
            <circle cx={row.x} cy={row.y} r="10" className="fill-transparent" />
            <circle cx={row.x} cy={row.y} r={hover?.month === row.month ? 5 : 3} fill="#141413" />
            <text x={row.x} y={h - 2} textAnchor="middle" className="fill-neutral-500" style={{ fontSize: 9 }}>
              {row.month}
            </text>
          </g>
        ))}
      </svg>
      {hover ? (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md border border-neutral-200 bg-[var(--surface)] px-2 py-1 text-xs text-neutral-800 shadow-[var(--elev-8)]"
          style={{ left: `${(hover.x / w) * 100}%`, top: `${(hover.y / h) * 100}%` }}
        >
          {hover.month}: {hover.value}% {t.overview.readyShort}
        </div>
      ) : null}
    </div>
  );
}

export function FilingBars() {
  const { t } = useI18n();
  const { dashboard } = useDemo();
  const filingHistory = dashboard.filingHistory;
  const max = Math.max(...filingHistory.map((row) => row.gst + row.epf + row.other));
  return (
    <div className="flex h-40 items-end gap-3">
      {filingHistory.map((row) => {
        const total = row.gst + row.epf + row.other;
        return (
          <HoverCard
            key={row.month}
            className="flex-1"
            label={
              <div className="space-y-0.5">
                <p className="font-medium">{row.month}</p>
                <p>GST {row.gst}</p>
                <p>EPF {row.epf}</p>
                <p>
                  {t.overview.otherFilings} {row.other}
                </p>
              </div>
            }
          >
            <div className="flex w-full cursor-pointer flex-col items-center gap-2">
              <div className="flex h-28 w-full flex-col justify-end overflow-hidden rounded-sm bg-neutral-100">
                <div className="w-full bg-[#d9d6d0]" style={{ height: `${(row.other / max) * 100}%` }} />
                <div className="w-full bg-[#8a8680]" style={{ height: `${(row.epf / max) * 100}%` }} />
                <div className="w-full bg-[#141413]" style={{ height: `${(row.gst / max) * 100}%` }} />
              </div>
              <span className="text-[10px] text-neutral-500">{row.month}</span>
              <span className="sr-only">{total} filings</span>
            </div>
          </HoverCard>
        );
      })}
    </div>
  );
}

export function CategoryBars() {
  const { t } = useI18n();
  const { dashboard } = useDemo();
  const categoryMix = dashboard.categoryMix;
  const max = Math.max(...categoryMix.map((row) => row.value));
  const total = categoryMix.reduce((sum, row) => sum + row.value, 0);
  return (
    <ul className="space-y-3">
      {categoryMix.map((row) => (
        <li key={row.label}>
          <HoverCard
            label={
              <span>
                {row.label}: {row.value} {t.overview.obligations} · {Math.round((row.value / total) * 100)}%
              </span>
            }
          >
            <div className="cursor-pointer">
              <div className="mb-1 flex justify-between text-xs">
                <span>{row.label}</span>
                <span className="font-mono text-neutral-500">{row.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full bg-neutral-900" style={{ width: `${(row.value / max) * 100}%` }} />
              </div>
            </div>
          </HoverCard>
        </li>
      ))}
    </ul>
  );
}
