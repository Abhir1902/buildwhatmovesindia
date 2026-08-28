"use client";

import { businessProfile } from "@/data/business";
import { FileNow } from "@/components/filing/file-now";
import { PortalSession } from "@/components/filing/portal-session";
import { portals } from "@/data/portals";
import { useI18n } from "@/i18n/provider";

export default function BusinessPage() {
  const { t } = useI18n();
  const rows = [
    [t.business.name, businessProfile.name],
    [t.business.location, `${businessProfile.city}, ${businessProfile.state}`],
    [t.business.industry, businessProfile.industry],
    [t.business.entity, businessProfile.entity],
    [t.business.employees, String(businessProfile.employees)],
    [t.business.turnover, businessProfile.annualTurnover],
    [t.business.gst, businessProfile.gstRegistered ? `${t.business.registered} · ${businessProfile.gstin}` : t.business.no],
    [t.business.ie, businessProfile.importExport ? t.business.yes : t.business.no],
    [t.business.locations, String(businessProfile.locations)],
    [t.business.scale, t.business.scaleValue],
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-4xl font-medium tracking-tight">{t.business.title}</h1>
      <p className="mt-2 text-neutral-600">{t.business.subtitle}</p>
      <dl className="mt-10 divide-y divide-neutral-200 border-y">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-2">
            <dt className="text-sm text-neutral-500">{k}</dt>
            <dd className="text-sm">{v}</dd>
          </div>
        ))}
      </dl>
      <section className="mt-12 space-y-6">
        <h2 className="text-sm text-neutral-500">{t.file.title}</h2>
        <PortalSession portalId="gst" />
        <ul className="divide-y divide-neutral-200 border-y">
          {portals.map((portal) => (
            <li key={portal.id} className="py-3">
              <FileNow id={portal.id} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
