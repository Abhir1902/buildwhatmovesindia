"use client";

import { SetuLogo } from "@/components/brand/setu-logo";
import { ActivityFlyout } from "@/components/suite/activity-flyout";
import { useSuiteUi } from "@/components/suite/suite-ui";
import { useDemo } from "@/state/demo-provider";
import { useAuth } from "@/state/auth-provider";
import { useI18n } from "@/i18n/provider";
import { locales, type LocaleCode } from "@/i18n/dictionaries";
import type { Role } from "@/data/users";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CommandBar() {
  const { t, locale, setLocale } = useI18n();
  const { setActivityOpen, activityOpen } = useSuiteUi();
  const { notifications, plainLanguage, setPlainLanguage } = useDemo();
  const { user, switchRole, signOut } = useAuth();
  const router = useRouter();

  return (
    <header className="acrylic no-print relative z-30">
      <div className="flex h-12 items-center justify-between px-4">
          <Link href="/overview" className="flex h-9 shrink-0 items-center" aria-label="SETU home">
            <SetuLogo />
          </Link>
        <div className="flex h-9 items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={t.suite.notifications}
            onClick={() => setActivityOpen(!activityOpen)}
          >
            <HugeiconsIcon icon={Notification03Icon} size={16} />
            {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-700" />}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon" aria-label={user.name}>
                  <Avatar className="h-7 w-7">
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <p className="text-sm text-neutral-900">{user.name}</p>
                  <p className="text-xs font-normal text-neutral-500">{user.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {t.auth.roles[user.role]}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>{t.suite.switchRole}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {(["owner", "accountant", "expert"] as Role[]).map((role) => (
                      <DropdownMenuItem key={role} onSelect={() => switchRole(role)}>
                        {t.auth.roles[role]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onSelect={() => setPlainLanguage(!plainLanguage)}>
                  {t.suite.plainLabel}: {plainLanguage ? t.suite.plainOn : t.suite.plainOff}
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>{t.common.language}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="max-h-72 overflow-auto">
                    {locales.map((item) => (
                      <DropdownMenuItem key={item.code} onSelect={() => setLocale(item.code as LocaleCode)}>
                        {item.native} · {item.english}
                        {item.code === locale ? " ✓" : ""}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    signOut();
                    router.replace("/");
                  }}
                >
                  {t.suite.signOut}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
      <ActivityFlyout />
    </header>
  );
}
