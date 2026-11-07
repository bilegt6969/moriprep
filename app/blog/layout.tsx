import { Metadata } from "next";
import { ReactNode } from "react";
import Navbar from "components/Heading/Navbar";
import CTA from "../components/CTA";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "Blog - Mori Prep | Education News & Updates",
  description: "Latest news and updates from Mori Prep by Bilegt Amartuvshin and Gundsambuu Ganzil. Learn about Digital SAT preparation, education technology, and our mission to make education accessible in Mongolia.",
  keywords: ["Mori Prep blog", "Bilegt Amartuvshin", "Gundsambuu Ganzil", "Digital SAT", "education technology", "Mongolia education", "SAT prep"],
  authors: [{ name: "Bilegt Amartuvshin" }, { name: "Gundsambuu Ganzil" }],
  openGraph: {
    title: "Blog - Mori Prep",
    description: "Latest news and updates from Mori Prep by Bilegt Amartuvshin and Gundsambuu Ganzil",
    url: "https://moriprep.xyz/blog",
    siteName: "Mori Prep",
    images: [
      {
        url: "https://moriprep.xyz/people/bilegt-amartuvshin.jpg",
        width: 800,
        height: 800,
        alt: "Bilegt Amartuvshin - Co-Founder of Mori Prep",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Mori Prep",
    description: "Latest news and updates from Mori Prep",
    images: ["https://moriprep.xyz/people/bilegt-amartuvshin.jpg"],
    creator: "@moriprep",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar
        siteName="Mori Prep"
        categories={[
          { label: "Overview", href: "/overview" },
          { label: "Practice", href: "/question-rush" },
          { label: "Lessons", href: "/resources" },
          { label: "Analytics", href: "/analytics" },
        ]}
        showBanner={false}
      />
      {children}
      <CTA />
      <Footer />
    </>
  );
}
