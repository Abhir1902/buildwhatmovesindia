"use client";

import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from "react";

type SuiteUi = {
  launcherOpen: boolean;
  paletteOpen: boolean;
  activityOpen: boolean;
  railCollapsed: boolean;
  setLauncherOpen: (v: boolean) => void;
  setPaletteOpen: (v: boolean) => void;
  setActivityOpen: (v: boolean) => void;
  setRailCollapsed: (v: boolean) => void;
  closeFlyouts: () => void;
};

const Ctx = createContext<SuiteUi | null>(null);
const RAIL_KEY = "setu-rail-collapsed";

export function SuiteUiProvider({ children }: { children: React.ReactNode }) {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [railCollapsed, setRailCollapsedState] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(RAIL_KEY);
    if (stored === "0" || stored === "1") {
      startTransition(() => setRailCollapsedState(stored === "1"));
    }
  }, []);

  const setRailCollapsed = useCallback((v: boolean) => {
    setRailCollapsedState(v);
    window.localStorage.setItem(RAIL_KEY, v ? "1" : "0");
  }, []);

  const closeFlyouts = useCallback(() => {
    setLauncherOpen(false);
    setActivityOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      launcherOpen,
      paletteOpen,
      activityOpen,
      railCollapsed,
      setLauncherOpen,
      setPaletteOpen,
      setActivityOpen,
      setRailCollapsed,
      closeFlyouts,
    }),
    [launcherOpen, paletteOpen, activityOpen, railCollapsed, setRailCollapsed, closeFlyouts],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSuiteUi() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSuiteUi must be used within SuiteUiProvider");
  return ctx;
}
