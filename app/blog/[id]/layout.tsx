import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Blog Post - Mori Prep",
  description: "Read the latest articles from Mori Prep about Digital SAT preparation, education technology, and making education accessible in Mongolia by Bilegt Amartuvshin and Gundsambuu Ganzil.",
  keywords: ["Mori Prep", "Bilegt Amartuvshin", "Gundsambuu Ganzil", "Digital SAT", "education", "Mongolia"],
  authors: [{ name: "Bilegt Amartuvshin" }, { name: "Gundsambuu Ganzil" }],
  openGraph: {
    title: "Blog Post - Mori Prep",
    description: "Read the latest articles from Mori Prep",
    siteName: "Mori Prep",
    images: [
      {
        url: "https://moriprep.xyz/people/bilegt-amartuvshin.jpg",
        width: 800,
        height: 800,
        alt: "Bilegt Amartuvshin - Co-Founder of Mori Prep",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Post - Mori Prep",
    description: "Read the latest articles from Mori Prep",
    images: ["https://moriprep.xyz/people/bilegt-amartuvshin.jpg"],
    creator: "@moriprep",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
