import type { ComponentType } from "react";
import {
  AdminIcon,
  CalendarIcon,
  DiscoverIcon,
  ExpertsIcon,
  ExposureIcon,
  FilingIcon,
  HomeIcon,
  RegisterIcon,
  VaultIcon,
} from "@/components/brand/app-icons";

export type SuiteAppId =
  | "home"
  | "discover"
  | "register"
  | "filing"
  | "calendar"
  | "tasks"
  | "vault"
  | "experts"
  | "exposure"
  | "admin";

export type SuiteApp = {
  id: SuiteAppId;
  href: string;
  accent: string;
  icon: ComponentType<{ accent?: string; className?: string }>;
  shortcut: string;
};

export const suiteApps: SuiteApp[] = [
  { id: "home", href: "/overview", accent: "#141413", icon: HomeIcon, shortcut: "1" },
  { id: "discover", href: "/discover", accent: "#0F6CBD", icon: DiscoverIcon, shortcut: "2" },
  { id: "register", href: "/compliance", accent: "#2B579A", icon: RegisterIcon, shortcut: "3" },
  { id: "filing", href: "/file", accent: "#217346", icon: FilingIcon, shortcut: "4" },
  { id: "calendar", href: "/calendar", accent: "#C43E1C", icon: CalendarIcon, shortcut: "5" },
  { id: "vault", href: "/documents", accent: "#0F7B6C", icon: VaultIcon, shortcut: "7" },
  { id: "experts", href: "/professionals", accent: "#B146C2", icon: ExpertsIcon, shortcut: "8" },
  { id: "exposure", href: "/exposure", accent: "#A4262C", icon: ExposureIcon, shortcut: "9" },
  { id: "admin", href: "/settings", accent: "#6B6860", icon: AdminIcon, shortcut: "0" },
];

const railHidden = new Set<SuiteAppId>(["discover", "filing", "experts"]);

export const railApps = suiteApps.filter((app) => !railHidden.has(app.id));

export function appById(id: SuiteAppId) {
  return suiteApps.find((app) => app.id === id)!;
}

export function appFromPath(pathname: string): SuiteApp {
  if (pathname.startsWith("/discover")) return appById("discover");
  if (pathname.startsWith("/compliance")) return appById("register");
  if (pathname.startsWith("/file")) return appById("filing");
  if (pathname.startsWith("/calendar") || pathname.startsWith("/tasks")) return appById("calendar");
  if (pathname.startsWith("/documents")) return appById("vault");
  if (pathname.startsWith("/professionals")) return appById("experts");
  if (pathname.startsWith("/exposure")) return appById("exposure");
  if (pathname.startsWith("/settings") || pathname.startsWith("/business")) return appById("admin");
  return appById("home");
}
