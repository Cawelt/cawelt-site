import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import GhostMascot from "@/components/layout/GhostMascot";
import Intro from "@/components/layout/Intro";
import MetaPixel from "@/components/analytics/MetaPixel";
import PageTransition from "@/components/layout/PageTransition";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-stack",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display-stack",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-stack",
  display: "swap",
});

const siteTitle = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: siteTitle,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.legal, url: site.url }],
  creator: site.legal,
  publisher: site.legal,
  category: "technology",
  verification: {
    google: "uMWj5Dlpvoz4HI9qg5S9PYqj8p71qbDQ_R0fGBnpf3I",
  },
  alternates: { canonical: "/" },
  formatDetection: { email: false, telephone: false, address: false },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: siteTitle,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  colorScheme: "dark",
};

// Organization + WebSite structured data (JSON-LD) for rich results.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#organization`,
      name: site.legal,
      alternateName: site.name,
      url: site.url,
      email: site.email,
      telephone: site.phone,
      description: site.description,
      slogan: site.tagline,
      logo: `${site.url}/icon.svg`,
      image: `${site.url}/opengraph-image`,
      areaServed: ["Kocaeli", "İstanbul", "Türkiye"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kocaeli",
        addressRegion: "Kocaeli",
        addressCountry: "TR",
      },
      sameAs: site.social.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "tr-TR",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${instrument.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="noise relative min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Intro />
        <MetaPixel />
        <SmoothScroll>
          <Cursor />
          <GhostMascot />
          <Navbar />
          <PageTransition>
            <main className="relative">{children}</main>
            <Footer />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
