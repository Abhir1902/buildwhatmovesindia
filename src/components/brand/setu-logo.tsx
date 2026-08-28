export function SetuLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-neutral-950">
      <svg
        width={compact ? 22 : 28}
        height={compact ? 22 : 28}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
      >
        <rect x="1" y="1" width="30" height="30" rx="6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 20.5C11 14 14.5 11 16 11c1.5 0 5 3 8 9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M8 12c3 6.5 6.5 9.5 8 9.5 1.5 0 5-3 8-9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="1.6" fill="currentColor" />
      </svg>
      {!compact && (
        <span className="text-[15px] font-medium tracking-[0.18em]">SETU</span>
      )}
    </span>
  );
}

export function OpenAIMark({ className }: { className?: string }) {
  return (
    // Official OpenAI blossom logomark (static SVG so it cannot collapse into a filled blob).
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/openai.svg" alt="" width={18} height={18} className={className} />
  );
}
