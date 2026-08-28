import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/i18n/provider";
import { dictionaries, type LocaleCode } from "@/i18n/dictionaries";
import { DemoProvider } from "@/state/demo-provider";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const noto = Noto_Sans({
  variable: "--font-noto",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SETU — Compliance Operating System for Indian businesses",
  description:
    "Setu helps Indian businesses understand, execute, track and maintain compliance. Public demo — no login required.",
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const raw = (await cookies()).get("setu-locale")?.value;
  const initialLocale: LocaleCode =
    raw && Object.prototype.hasOwnProperty.call(dictionaries, raw) ? (raw as LocaleCode) : "en";
  const dir = initialLocale === "ur" ? "rtl" : "ltr";

  return (
    <html lang={initialLocale} dir={dir} suppressHydrationWarning className={`${sans.variable} ${mono.variable} ${noto.variable} h-full antialiased`}>
      <body className="min-h-full text-[var(--foreground)]">
        <LanguageProvider initialLocale={initialLocale}>
          <DemoProvider>
            <AppShell>{children}</AppShell>
          </DemoProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
