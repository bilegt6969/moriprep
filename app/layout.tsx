import { BodyWrapper } from "components/body-wrapper";
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
    "Free Digital SAT preparation for students worldwide by Bilegt Amartuvshin and Gundsambuu Ganzil. Practice, analyze, and master the DSAT with adaptive learning and comprehensive analytics.",
  keywords:
    "Digital SAT, SAT preparation, DSAT, college admissions, test prep, free education, adaptive learning, student success, Bilegt Amartuvshin, Gundsambuu Ganzil, Mongolia education",
  authors: [{ name: "Bilegt Amartuvshin" }, { name: "Gundsambuu Ganzil" }],
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
      "Free Digital SAT preparation for students worldwide by Bilegt Amartuvshin and Gundsambuu Ganzil. Practice, analyze, and master the DSAT with adaptive learning and comprehensive analytics.",
    images: [
      {
        url: "https://moriprep.xyz/people/bilegt-amartuvshin.jpg",
        width: 800,
        height: 800,
        alt: "Bilegt Amartuvshin - Co-Founder of Mori Prep",
      },
      {
        url: "https://moriprep.xyz/people/Gundsambuu.png",
        width: 800,
        height: 800,
        alt: "Gundsambuu Ganzil - Co-Founder of Mori Prep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mori Prep - Your Digital SAT preparation companion",
    description:
      "Free Digital SAT preparation for students worldwide by Bilegt Amartuvshin and Gundsambuu Ganzil",
    images: ["https://moriprep.xyz/people/bilegt-amartuvshin.jpg"],
    creator: "@moriprep",
  },
  other: {
    // No external fonts needed - using Geist
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* Fonts are loaded via next/font/google */}</head>
      <body
        className="bg-background text-foreground antialiased selection:bg-gray-200 selection:text-black dark:selection:bg-gray-700 dark:selection:text-white"
        style={{ fontFamily: "Geist Sans, system-ui, sans-serif" }}
      >
        <BodyWrapper>{children}</BodyWrapper>
      </body>
    </html>
  );
}
