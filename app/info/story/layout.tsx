import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Our Story - Bilegt Amartuvshin & Gundsambuu Ganzil | Mori Prep",
  description: "Learn about Bilegt Amartuvshin and Gundsambuu Ganzil, the co-founders of Mori Prep. Discover how two Mongolian students built a free Digital SAT preparation platform to make education accessible for all.",
  keywords: ["Bilegt Amartuvshin", "Gundsambuu Ganzil", "Mori Prep", "co-founders", "Mongolia", "education", "Digital SAT", "free SAT prep", "non-profit"],
  authors: [{ name: "Bilegt Amartuvshin" }, { name: "Gundsambuu Ganzil" }],
  openGraph: {
    title: "Our Story - Bilegt Amartuvshin & Gundsambuu Ganzil",
    description: "Meet the co-founders of Mori Prep - Bilegt Amartuvshin and Gundsambuu Ganzil. Two students building free education for Mongolia.",
    url: "https://moriprep.xyz/info/story",
    siteName: "Mori Prep",
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
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story - Bilegt Amartuvshin & Gundsambuu Ganzil",
    description: "Meet the co-founders of Mori Prep - building free education for Mongolia",
    images: ["https://moriprep.xyz/people/bilegt-amartuvshin.jpg"],
    creator: "@moriprep",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function StoryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
