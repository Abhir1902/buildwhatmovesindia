"use client";

import Link from "next/link";
import { deskHref, portalById } from "@/data/portals";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function FileNow({ id, className }: { id: string; className?: string }) {
  const { t } = useI18n();
  if (!portalById(id)) return null;
  const name = t.file.portals[id as keyof typeof t.file.portals];
  return (
    <Link href={deskHref(id)} className={cn("text-sm font-medium underline-offset-4 hover:underline", className)}>
      {t.file.openInSetu.replace("{portal}", name)}
    </Link>
  );
}
