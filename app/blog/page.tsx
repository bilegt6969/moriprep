"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: customEase },
  },
};

const blogPosts = [
  {
    id: 1,
    title: "How to Ace the Digital SAT Reading Section",
    excerpt:
      "Learn proven strategies for tackling the new digital SAT reading format with confidence.",
    date: "July 28, 2026",
    category: "Reading",
    readTime: "5 min read",
    image: "/home/analytics.png",
  },
  {
    id: 2,
    title: "Mastering SAT Math: From Algebra to Advanced Problems",
    excerpt: "A comprehensive guide to conquering every math topic on the SAT.",
    date: "July 25, 2026",
    category: "Math",
    readTime: "8 min read",
    image: "/home/calendar.png",
  },
  {
    id: 3,
    title: "The Ultimate SAT Study Schedule for 2026",
    excerpt:
      "Plan your preparation with our optimized study timeline for maximum results.",
    date: "July 20, 2026",
    category: "Strategy",
    readTime: "6 min read",
    image: "/home/browser.png",
  },
  {
    id: 4,
    title: "Understanding Standard English Conventions",
    excerpt: "Break down grammar rules and learn to identify common SAT traps.",
    date: "July 15, 2026",
    category: "Writing",
    readTime: "4 min read",
    image: "/home/analytics.png",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-medium tracking-tight text-neutral-900 mb-6 leading-[1.05]"
          >
            Blog
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed"
          >
            Tips, strategies, and insights to help you master the SAT.
          </motion.p>
        </motion.div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: customEase }}
              >
                <Link href={`/blog/${post.id}`}>
                  <article className="h-full bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-video bg-neutral-100 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-neutral-900 mb-2 leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <p className="text-xs text-neutral-400">{post.date}</p>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
