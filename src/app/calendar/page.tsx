"use client";

import { MonthDeck } from "@/components/home/month-deck";
import { AppHeader } from "@/components/suite/app-header";
import { useI18n } from "@/i18n/provider";

export default function CalendarPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl">
      <AppHeader appId="calendar" extra={<p className="text-sm text-neutral-500">{t.suite.calendarSubtitle}</p>} />
      <MonthDeck />
    </div>
  );
}
