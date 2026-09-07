"use client";

import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { DemoUser, Role } from "@/data/users";
import { can, type Capability } from "@/lib/permissions";
import { getDb, hydrateDb } from "@/lib/json-db";

function liveUserByEmail(email: string) {
  return getDb().users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
}

function liveUserById(id: string) {
  return getDb().users.find((user) => user.id === id);
}

function liveUserByRole(role: Role) {
  return getDb().users.find((user) => user.role === role) ?? null;
}

const KEY = "setu-session-v1";


type Status = "loading" | "signedIn" | "signedOut";

type AuthValue = {
  user: DemoUser | null;
  role: Role | null;
  status: Status;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
  switchRole: (role: Role) => void;
  can: (capability: Capability) => boolean;
};

const Ctx = createContext<AuthValue | null>(null);

function persist(user: DemoUser | null) {
  if (typeof window === "undefined") return;
  if (!user) window.localStorage.removeItem(KEY);
  else window.localStorage.setItem(KEY, JSON.stringify({ userId: user.id }));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    hydrateDb();
    const raw = window.localStorage.getItem(KEY);
    let next: DemoUser | null = null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { userId?: string };
        next = parsed.userId ? (liveUserById(parsed.userId) ?? null) : null;
      } catch {
        next = null;
      }
    }
    startTransition(() => {
      setUser(next);
      setStatus(next ? "signedIn" : "signedOut");
    });
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const found = liveUserByEmail(email);
    if (!found || found.password !== password) return false;
    persist(found);
    setUser(found);
    setStatus("signedIn");
    return true;
  }, []);

  const signOut = useCallback(() => {
    persist(null);
    setUser(null);
    setStatus("signedOut");
  }, []);

  const switchRole = useCallback((role: Role) => {
    const next = liveUserByRole(role);
    if (!next) return;
    persist(next);
    setUser(next);
    setStatus("signedIn");
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      role: user?.role ?? null,
      status,
      signIn,
      signOut,
      switchRole,
      can: (capability) => (user ? can(user.role, capability) : false),
    }),
    [user, status, signIn, signOut, switchRole],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
