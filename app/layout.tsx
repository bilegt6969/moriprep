import { Analytics } from "@vercel/analytics/next";
import { AuthSessionSync } from "components/auth/auth-session-sync";
import { CookieConsentProvider } from "components/cookie-consent";
import { Providers } from "components/providers/tooltip-provider";
import { baseUrl } from "lib/utils";
import type { Metadata } from "next";
import { EB_Garamond, Geist } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const { SITE_NAME } = process.env;

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"] as const,
  variable: "--font-eb-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Mori Prep - Master the DSAT",
    template: `%s | Mori Prep`,
  },
  description:
    "Mori Prep is your complete DSAT preparation platform. Practice with exam-calibrated questions, track your progress, and master the Digital SAT with comprehensive study tools.",
  keywords:
    "DSAT, Digital SAT, SAT prep, SAT practice, college prep, standardized testing, exam preparation, Mori Prep, SAT study",
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
    title: "Mori Prep - Master the DSAT",
    description:
      "Mori Prep is your complete DSAT preparation platform. Practice with exam-calibrated questions, track your progress, and master the Digital SAT with comprehensive study tools.",
  },
  other: {
    "google-font-preconnect": "https://fonts.googleapis.com",
    "google-font-preconnect-crossorigin": "https://fonts.gstatic.com",
    "google-font-stylesheet":
      "https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${ebGaramond.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f9f9f9] text-neutral-900 antialiased selection:bg-neutral-200">
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
