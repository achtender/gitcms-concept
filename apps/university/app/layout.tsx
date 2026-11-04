import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter, SiteHeader, SkipLink, ThemeScript } from "@repo/ui";

import { navigation, settings, siteUrl } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${settings.name} — ${settings.tagline}`,
    template: `%s — ${settings.name}`,
  },
  description: settings.description,
  openGraph: {
    type: "website",
    siteName: settings.name,
    title: settings.name,
    description: settings.description,
    url: siteUrl,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={settings.locale}
      suppressHydrationWarning
      className={`${inter.variable} ${sourceCode.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <ThemeScript />
        <SkipLink />
        <SiteHeader
          siteName={settings.name}
          navigation={navigation.primary}
          action={{ label: "Apply now", href: "/admissions" }}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter
          siteName={settings.name}
          tagline={settings.tagline}
          columns={navigation.footer}
          meta={
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="transition-colors hover:text-foreground"
                >
                  {settings.email}
                </a>
              ) : null}
              {settings.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="transition-colors hover:text-foreground"
                >
                  {social.label}
                </a>
              ))}
            </p>
          }
        />
      </body>
    </html>
  );
}
