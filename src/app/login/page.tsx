"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SetuLogo } from "@/components/brand/setu-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/state/auth-provider";
import { useDemo } from "@/state/demo-provider";
import { useI18n } from "@/i18n/provider";

export default function LoginPage() {
  const { t } = useI18n();
  const { signIn, status } = useAuth();
  const { users } = useDemo();
  const router = useRouter();
  const [email, setEmail] = useState("owner@aarav.in");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (status === "signedIn") router.replace("/overview");
  }, [status, router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = signIn(email, password);
    setError(!ok);
    if (ok) router.replace("/overview");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <SetuLogo />
          <CardTitle className="mt-4">{t.auth.title}</CardTitle>
          <CardDescription>{t.auth.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error ? <p className="text-sm text-red-800">{t.auth.error}</p> : null}
            <Button type="submit" className="w-full">
              {t.auth.submit}
            </Button>
          </form>
          <p className="mt-6 text-xs text-neutral-500">{t.auth.demoHint}</p>
          <div className="mt-3 flex flex-col gap-2">
            {users.filter((user) => user.role === "owner").map((user) => (
              <button
                key={user.id}
                type="button"
                className="rounded-md border border-neutral-200 px-3 py-2 text-left text-sm hover:bg-neutral-50"
                onClick={() => {
                  signIn(user.email, user.password);
                  router.replace("/overview");
                }}
              >
                <span className="font-medium">{user.name}</span>
                <span className="ml-2 text-neutral-500">
                  {user.email} · {t.auth.roles[user.role]}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-6 text-center text-xs">
            <Link href="/" className="underline-offset-4 hover:underline">
              {t.auth.back}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
