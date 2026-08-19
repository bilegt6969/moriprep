import { Analytics } from "@vercel/analytics/next";
import { AuthSessionSync } from "components/auth/auth-session-sync";
import { CookieConsentProvider } from "components/cookie-consent";
import { Providers } from "components/providers/tooltip-provider";
import { baseUrl } from "lib/utils";
import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

const { SITE_NAME } = process.env;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Mori Prep - Your Digital SAT preparation companion",
    template: `%s | Mori Prep`,
  },
  description:
    "Free Digital SAT preparation for students worldwide. Practice, analyze, and master the DSAT with adaptive learning and comprehensive analytics.",
  keywords:
    "Digital SAT, SAT preparation, DSAT, college admissions, test prep, free education, adaptive learning, student success",
  robots: {
    follow: true,
    index: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Mori Prep",
    title: "Mori Prep - Your Digital SAT preparation companion",
    description:
      "Free Digital SAT preparation for students worldwide. Practice, analyze, and master the DSAT with adaptive learning and comprehensive analytics.",
  },
  other: {
    // No external fonts needed - using Geist
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>{/* Fonts are loaded via next/font/google */}</head>
      <body
        className="bg-white text-primary antialiased selection:bg-gray-200 selection:text-black"
        style={{ fontFamily: "Geist Sans, system-ui, sans-serif" }}
      >
        <Providers>
          <CookieConsentProvider>
            <AuthSessionSync />
            <main>{children}</main>
          </CookieConsentProvider>
        </Providers>
      </body>
      <Analytics />
    </html>
  );
}
