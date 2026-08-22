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
    id: "closing-dsat-information-gap",
    title: "Closing the DSAT Information Gap in Mongolia",
    excerpt:
      "Mongolian students are not lacking ability. They are lacking equal access to information. And Mori Prep is Bytecode's attempt to remove money as the bridge across that gap. Learn how we're building a non-profit SAT preparation infrastructure to ensure financial status never stands between a Mongolian student and world-class higher education.",
    date: "13 May, 2026",
    categories: ["News", "Education"],
  },
  {
    id: "integrating-college-board-question-bank",
    title: "Integrating the Official College Board Question Bank",
    excerpt:
      "How we brought thousands of official Digital SAT practice questions, multi-stage adaptive testing logic, and curated prep resources under one seamless, 100% free dashboard built for student success.",
    date: "2 April, 2026",
    categories: ["News", "Education"],
  },
];

const filters = ["All", "News", "Education"];

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
              The latest news from bytecode | mori Prep Family
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
