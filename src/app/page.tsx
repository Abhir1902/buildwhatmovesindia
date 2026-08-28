import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

const title = "SETU — Compliance operating system for India | EODB";
const description =
  "SETU is a compliance operating system for Indian SMEs. Understand obligations, file GST, EPF, MCA and POSH inside the app, keep documents in a vault, and get matched help. Public demo — no login.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Ease of Doing Business",
    "EODB India",
    "SETU",
    "Indian SME compliance",
    "GST filing",
    "EPFO",
    "MCA21",
    "POSH",
    "compliance operating system",
    "document vault",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_IN",
    siteName: "SETU",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SETU",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description,
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  audience: { "@type": "Audience", geographicArea: { "@type": "Country", name: "India" } },
  keywords: "Ease of Doing Business, EODB, SETU, GST, EPFO, MCA, POSH, SME compliance India",
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingPage />
    </>
  );
}
