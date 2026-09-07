"use client";

import { LanguageSelect } from "@/components/layout/language-select";
import { useI18n } from "@/i18n/provider";
import { useDemo } from "@/state/demo-provider";
import { useAuth } from "@/state/auth-provider";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/suite/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { t } = useI18n();
  const { resetDemo, plainLanguage, setPlainLanguage, business: businessProfile } = useDemo();
  const { can, user } = useAuth();
  const rows = [
    [t.business.name, businessProfile.name],
    [t.business.location, `${businessProfile.city}, ${businessProfile.state}`],
    [t.business.industry, businessProfile.industry],
    [t.business.entity, businessProfile.entity],
    [t.business.employees, String(businessProfile.employees)],
    [t.business.turnover, businessProfile.annualTurnover],
    [t.business.gst, businessProfile.gstin ?? t.business.no],
  ];

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <AppHeader appId="admin" />
      {user ? (
        <Card>
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{t.auth.roles[user.role]}</Badge>
          </CardContent>
        </Card>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>{t.business.title}</CardTitle>
          <CardDescription>{t.business.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-neutral-200 border-y">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-2">
                <dt className="text-sm text-neutral-500">{k}</dt>
                <dd className="text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.language}</CardTitle>
          <CardDescription>{t.settings.languageHelp}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LanguageSelect />
          <Button type="button" variant="outline" onClick={() => setPlainLanguage(!plainLanguage)}>
            {t.suite.plainLabel}: {plainLanguage ? t.suite.plainOn : t.suite.plainOff}
          </Button>
        </CardContent>
      </Card>
      {can("demo.reset") ? (
        <Button variant="outline" onClick={resetDemo}>
          {t.suite.reset}
        </Button>
      ) : null}
      <p className="text-sm text-neutral-500">{t.overview.disclaimer}</p>
    </div>
  );
}
