"use client";

import { LanguageSelect } from "@/components/layout/language-select";
import { FileNow } from "@/components/filing/file-now";
import { portals } from "@/data/portals";
import { useI18n } from "@/i18n/provider";

export default function SettingsPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-xl space-y-8">
      <h1 className="text-4xl font-medium tracking-tight">{t.nav.settings}</h1>
      <section>
        <h2 className="text-sm text-neutral-500">{t.settings.language}</h2>
        <p className="mb-3 mt-1 text-sm text-neutral-600">{t.settings.languageHelp}</p>
        <LanguageSelect />
      </section>
      <section>
        <h2 className="text-sm text-neutral-500">{t.file.title}</h2>
        <p className="mb-3 mt-1 text-sm text-neutral-600">{t.file.subtitle}</p>
        <ul className="space-y-2">
          {portals.map((portal) => (
            <li key={portal.id}>
              <FileNow id={portal.id} />
            </li>
          ))}
        </ul>
      </section>
      <p className="text-sm text-neutral-500">{t.overview.disclaimer}</p>
    </div>
  );
}
