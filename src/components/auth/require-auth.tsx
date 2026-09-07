"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/state/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";

const PUBLIC = new Set(["/", "/login"]);

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const publicRoute = PUBLIC.has(pathname);

  useEffect(() => {
    if (status === "loading") return;
    if (!publicRoute && status === "signedOut") {
      router.replace("/login");
    }
  }, [status, publicRoute, router]);

  if (publicRoute) return <>{children}</>;
  if (status === "loading") {
    return (
      <div className="flex min-h-dvh flex-col gap-4 p-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (status === "signedOut") return null;
  return <>{children}</>;
}
