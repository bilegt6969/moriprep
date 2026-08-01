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

const lessons = [
  {
    id: "craft-and-structure",
    title: "Craft and Structure Fundamentals",
    excerpt:
      "Learn how to analyze text structure, identify main ideas, and understand author's craft in the Digital SAT reading section.",
    duration: "45 min",
    category: "Reading",
    level: "Beginner",
    image: "/home/analytics.png",
  },
  {
    id: "information-and-ideas",
    title: "Information and Ideas Mastery",
    excerpt:
      "Deep dive into extracting information, making inferences, and synthesizing ideas across complex passages.",
    duration: "60 min",
    category: "Reading",
    level: "Intermediate",
    image: "/home/calendar.png",
  },
  {
    id: "standard-english",
    title: "Standard English Conventions",
    excerpt:
      "Master grammar rules, punctuation, and sentence structure to ace the writing and language section.",
    duration: "50 min",
    category: "Writing",
    level: "Beginner",
    image: "/home/browser.png",
  },
  {
    id: "expression-of-ideas",
    title: "Expression of Ideas",
    excerpt:
      "Learn to improve text effectiveness, clarity, and style through strategic editing and revision techniques.",
    duration: "55 min",
    category: "Writing",
    level: "Advanced",
    image: "/home/analytics.png",
  },
  {
    id: "algebra-functions",
    title: "Algebra and Functions",
    excerpt:
      "Comprehensive coverage of linear equations, systems of equations, and functions for SAT Math success.",
    duration: "70 min",
    category: "Math",
    level: "Intermediate",
    image: "/home/calendar.png",
  },
  {
    id: "advanced-problem-solving",
    title: "Advanced Problem Solving",
    excerpt:
      "Tackle complex word problems, data analysis, and advanced geometry with proven problem-solving strategies.",
    duration: "65 min",
    category: "Math",
    level: "Advanced",
    image: "/home/browser.png",
  },
];

export default function LessonsPage() {
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
            Lessons
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed"
          >
            Structured learning paths to master every section of the Digital
            SAT.
          </motion.p>
        </motion.div>
      </section>

      {/* Lessons Grid */}
      <section className="py-16 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson) => (
              <motion.div
                key={lesson.id}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: customEase }}
              >
                <Link href={`/lessons/${lesson.id}`}>
                  <article className="h-full bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-video bg-neutral-100 overflow-hidden">
                      <img
                        src={lesson.image}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
                          {lesson.category}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {lesson.duration}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-neutral-900 mb-2 leading-tight">
                        {lesson.title}
                      </h2>
                      <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
                        {lesson.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">
                          {lesson.level}
                        </span>
                        <span className="text-xs font-medium text-black">
                          Start Lesson →
                        </span>
                      </div>
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
