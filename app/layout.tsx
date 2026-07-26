import { AuthSessionSync } from "components/auth/auth-session-sync";
import { CookieConsentProvider } from "components/cookie-consent";
import { baseUrl } from "lib/utils";
import type { Metadata } from "next";
import { EB_Garamond, Geist } from "next/font/google";
// @ts-ignore - nextjs-toploader types may not resolve correctly
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "components/providers/tooltip-provider";
import NextTopLoader from "nextjs-toploader";
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
    default: "Byte - The Operating System for Your Future",
    template: `%s | Byte`,
  },
  description:
    "Byte is the complete operating system for your future. Access DSAT prep, coding practice, and educational resources all in one place.",
  keywords:
    "DSAT, SAT prep, coding practice, education, learning, Byte, future, career prep",
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
    siteName: "Byte",
    title: "Byte - The Operating System for Your Future",
    description:
      "Byte is the complete operating system for your future. Access DSAT prep, coding practice, and educational resources all in one place.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${ebGaramond.variable}`}>
      <body className="bg-[#f9f9f9] text-neutral-900 antialiased selection:bg-neutral-200">
        <NextTopLoader
          color="#111"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="cubic-bezier(0.16, 1, 0.3, 1)"
          speed={200}
          shadow="0 0 15px rgba(17, 17, 17, 0.5), 0 0 8px rgba(17, 17, 17, 0.3)"
          zIndex={1600}
          showAtBottom={false}
        />
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
