import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import plan from "@/content/plan.json";
import site from "@/content/site.json";
import type { Plan, SiteContent } from "@/content/types";

import "./globals.css";

const content = site as SiteContent;
const page = plan as Plan;

// A result page shows roughly 65 characters of title. The bare product name is
// too short to be useful there, and a mid-sentence truncation reads as broken,
// so the product is prefixed only when the headline does not already carry it
// and the pair still fits.
const headline = page.hero.headline;
const prefixed = content.product + " — " + headline;
const pageTitle = headline.toLowerCase().includes(content.product.toLowerCase())
  ? headline
  : prefixed.length <= 65
    ? prefixed
    : headline;

export const metadata: Metadata = {
  metadataBase: new URL(content.domain),
  title: {
    default: pageTitle,
    template: "%s — " + content.product,
  },
  description: page.hero.metaDescription,
  openGraph: {
    type: "website",
    url: content.domain,
    siteName: content.siteName,
    title: pageTitle,
    description: page.hero.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: page.hero.metaDescription,
  },
  alternates: { canonical: content.domain },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: content.product,
  description: page.hero.metaDescription,
  applicationCategory: "DeveloperApplication",
  url: content.domain,
  codeRepository: content.sourceUrl,
  publisher: { "@type": "Organization", name: "Wisent", url: "https://wisent.ai" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
