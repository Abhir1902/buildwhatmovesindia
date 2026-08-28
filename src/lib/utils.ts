import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIndianDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function daysUntil(iso: string) {
  const target = new Date(`${iso}T00:00:00`);
  const today = new Date("2026-08-29T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
