"use client";

import { useDemo } from "@/state/demo-provider";
import { useSuiteUi } from "@/components/suite/suite-ui";
import { useI18n } from "@/i18n/provider";
import Link from "next/link";

export function ActivityFlyout() {
  const { activityOpen, setActivityOpen } = useSuiteUi();
  const { notifications } = useDemo();
  const { t } = useI18n();
  if (!activityOpen) return null;

  return (
    <>
      <button type="button" className="fixed inset-0 z-40 cursor-default bg-black/45" aria-label={t.common.close} onClick={() => setActivityOpen(false)} />
      <div
        role="dialog"
        aria-label={t.suite.notifications}
        className="suite-panel absolute top-12 right-3 z-50 w-80 rounded-xl p-4"
      >
        <p className="text-sm font-medium">{t.suite.notifications}</p>
        {notifications.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">{t.suite.noNotifications}</p>
        ) : (
          <ul className="mt-3 divide-y divide-neutral-200">
            {notifications.slice(0, 8).map((item) => (
              <li key={item.id} className="py-2">
                <Link href={item.href} className="block" onClick={() => setActivityOpen(false)}>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-neutral-500">{item.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
