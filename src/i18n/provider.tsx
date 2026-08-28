"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries, locales, type LocaleCode, type Messages } from "@/i18n/dictionaries";

type I18nContextValue = {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
  t: Messages;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nContextValue | null>(null);
export const LOCALE_COOKIE = "setu-locale";

function isLocale(value: string | null | undefined): value is LocaleCode {
  return !!value && Object.prototype.hasOwnProperty.call(dictionaries, value);
}

function applyDocument(code: LocaleCode) {
  const meta = locales.find((item) => item.code === code);
  document.documentElement.lang = code;
  document.documentElement.dir = meta?.dir ?? "ltr";
}

function persist(code: LocaleCode) {
  window.localStorage.setItem(LOCALE_COOKIE, code);
  document.cookie = `${LOCALE_COOKIE}=${code}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function LanguageProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: LocaleCode;
}) {
  const [locale, setLocaleState] = useState<LocaleCode>(initialLocale);

  const setLocale = useCallback((code: LocaleCode) => {
    persist(code);
    applyDocument(code);
    setLocaleState(code);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_COOKIE);
    const fromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))
      ?.split("=")[1];
    const next = isLocale(stored) ? stored : isLocale(fromCookie) ? fromCookie : initialLocale;
    persist(next);
    applyDocument(next);
    setLocaleState(next);
  }, [initialLocale]);

  const value = useMemo(() => {
    const meta = locales.find((item) => item.code === locale);
    return {
      locale,
      setLocale,
      t: dictionaries[locale] ?? dictionaries.en,
      dir: (meta?.dir ?? "ltr") as "ltr" | "rtl",
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
