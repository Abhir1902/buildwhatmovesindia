"use client";

import { useDemo } from "@/state/demo-provider";
import { cn } from "@/lib/utils";

export function Term({ id, children }: { id: string; children: React.ReactNode }) {
  const { plainLanguage, glossary } = useDemo();
  const entry = glossary.find((item) => item.id === id);
  if (!entry) return <>{children}</>;

  if (plainLanguage) {
    return (
      <span>
        {children}{" "}
        <span className="text-neutral-500">({entry.plain})</span>
      </span>
    );
  }

  return (
    <abbr title={entry.plain} className={cn("cursor-help decoration-dotted underline-offset-2")}>
      {children}
    </abbr>
  );
}
