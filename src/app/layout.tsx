import { Geist, Geist_Mono, Noto_Sans, Oswald } from "next/font/google";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/i18n/provider";
import { dictionaries, type LocaleCode } from "@/i18n/dictionaries";
import { DemoProvider } from "@/state/demo-provider";
import { SoundLayer } from "@/components/sound/sound-layer";
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

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SETU — Compliance operating system for India | EODB",
    template: "%s · SETU",
  },
  description:
    "SETU is a compliance operating system for Indian SMEs. Understand, file GST EPF MCA POSH, keep a document vault. Public demo, no login.",
  keywords: ["Ease of Doing Business", "EODB India", "SETU", "SME compliance", "GST", "EPFO", "MCA21"],
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    siteName: "SETU",
    locale: "en_IN",
    type: "website",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const raw = (await cookies()).get("setu-locale")?.value;
  const initialLocale: LocaleCode =
    raw && Object.prototype.hasOwnProperty.call(dictionaries, raw) ? (raw as LocaleCode) : "en";
  const dir = initialLocale === "ur" ? "rtl" : "ltr";

  return (
    <html lang={initialLocale} dir={dir} suppressHydrationWarning className={`${sans.variable} ${mono.variable} ${noto.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full text-[var(--foreground)]">
        <LanguageProvider initialLocale={initialLocale}>
          <DemoProvider>
            <SoundLayer />
            <AppShell>{children}</AppShell>
          </DemoProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
