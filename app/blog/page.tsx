"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

const blogPosts = [
  {
    id: "why-family-accounts",
    title: "The Crypto Wallet Problem – Why We Created Family Accounts",
    excerpt:
      "Traditional wallets rely on seed phrases and private keys, but this approach has fundamental flaws. Losing access to your bank account because you misplaced a single piece of information would be unthinkable—yet in crypto, this remains a common reality. Most users struggle with managing seed phrases and private keys, often resorting to insecure storage methods like screenshots or digital notes.",
    date: "13 May, 2025",
    categories: ["News", "Wallet"],
  },
  {
    id: "family-accounts",
    title: "Making Family Simpler & Safer",
    excerpt:
      "We're thrilled to announce a major upgrade to Family—designed to make onboarding and navigating Ethereum simpler and safer than ever. Born from our own need for seamless yet secure crypto experiences, these features offer the easiest path to getting onchain.",
    date: "2 April, 2025",
    categories: ["News", "Wallet"],
  },
  {
    id: "launch",
    title: "Avara Launches Family: The Feature-Rich Crypto Wallet",
    excerpt:
      "With features for beginners and experienced users alike, Family makes interacting with web3 secure, effortless and fun.",
    date: "11 November, 2024",
    categories: ["News", "Wallet"],
  },
  {
    id: "avara",
    title: "Family Acquired by Avara (Aave Companies)",
    excerpt:
      "I'm thrilled to announce that Los Feliz Engineering (LFE)—the company behind Family and previously, Honk—has been acquired by Avara, formerly known as Aave Companies.",
    date: "16 November, 2023",
    categories: ["News"],
  },
  {
    id: "unveiling-previews",
    title: "Unveiling Previews in Family, Powered by Blowfish",
    excerpt:
      "We're excited to share a major feature addition to Family, Previews. Enabled by our collaboration with Blowfish, Previews offers an unprecedented level of user control and transparency when navigating the world of Ethereum.",
    date: "16 August, 2023",
    categories: ["News", "Wallet"],
  },
  {
    id: "the-merge",
    title: "The Merge",
    excerpt:
      "The Merge is finally here. While the Ethereum community celebrates the coming of the Merge, some people are still wondering how we got here, what the Merge actually is, and what it all means for the future of Ethereum. Let's jump right in.",
    date: "15 Sep, 2022",
    categories: ["News"],
  },
];

const filters = ["All", "News", "Wallet"];

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredPosts = blogPosts.filter(
    (post) => activeFilter === "All" || post.categories.includes(activeFilter),
  );

  return (
    <div className="min-h-screen bg-white text-[#343433] font-sans selection:bg-[#D8ECFC] selection:text-[#008cff]">
      <div className="max-w-[67rem] mx-auto px-6 pt-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between py-20 gap-6">
          <div className="flex flex-col gap-5">
            <h1 className="text-[44px] font-medium leading-[48px] tracking-[-1.35px] text-[#343433]">
              Blog
            </h1>
            <p className="text-[15px] leading-[22px] tracking-[-0.13px] text-[#848281]">
              The latest news from Family
            </p>
          </div>

          <div className="pt-2">
            <ul className="flex gap-2 m-0 p-0 list-none">
              {filters.map((filter) => (
                <li key={filter} className="inline-block">
                  <button
                    onClick={() => setActiveFilter(filter)}
                    className={`relative inline-block overflow-hidden px-3 py-[0.45rem] rounded-[2rem] text-[15px] font-medium select-none cursor-pointer transition-all duration-200 ${
                      activeFilter === filter
                        ? "bg-[#EAEAEA] text-[#343433]"
                        : "bg-[#FBFAF9] text-[#848281] hover:bg-[#EAEAEA]"
                    }`}
                  >
                    {filter}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Blog List Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          {filteredPosts.map((post) => (
            <motion.div key={post.id} variants={fadeInUp}>
              <Link
                href={`/blog/${post.id}`}
                className="grid grid-cols-1 md:grid-cols-[0.85fr_1.75fr_2.5fr] gap-8 py-[4.5rem] md:pt-[6rem] md:pb-[4.5rem] border-b border-[#f2f0ed] relative hover:opacity-75 transition-opacity duration-200"
              >
                {/* Column 1: Date */}
                <p className="text-[15px] font-normal leading-[22px] tracking-[-0.13px] text-[#848281]">
                  {post.date}
                  <span className="md:hidden block mt-1">
                    <span className="mr-1">•</span> {post.categories.join(", ")}
                  </span>
                </p>

                {/* Column 2: Title & Category */}
                <div className="flex flex-col justify-start items-start gap-[14px] w-full">
                  <h5 className="text-[23px] font-medium leading-[25px] tracking-[-0.44px] text-[#343433]">
                    {post.title}
                  </h5>
                  <p className="text-[15px] font-normal leading-[22px] tracking-[-0.13px] text-[#848281] hidden md:block">
                    {post.categories.join(", ")}
                  </p>
                </div>

                {/* Column 3: Excerpt */}
                <div className="relative md:-top-[3px] overflow-hidden text-ellipsis">
                  <p className="text-[17px] font-normal leading-[26px] tracking-[-0.22px] text-[#494440] line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
