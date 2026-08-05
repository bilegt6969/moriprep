"use client";

import Navbar from "components/Heading/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: customEase },
  },
};

export default function MissionPage() {
  return (
    <>
      <Navbar siteName="Byte" categories={[]} />
      <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        >
          {/* Illustration */}
          <motion.div variants={textVariants} className="mb-12">
            <img
              src="/profit.jpg"
              alt="Education > Profit"
              className="w-2/5 aspect-square object-cover rounded-3xl mx-auto"
            />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={textVariants}
            className="text-4xl md:text-6xl font-slim tracking-tighter text-neutral-900 mb-6 leading-[1.1] font-eb-garamond"
          >
            Open Education For All.
          </motion.h1>

          {/* Content Paragraphs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left text-base md:text-lg text-neutral-600 max-w-2xl mx-auto space-y-6 leading-relaxed"
          >
            <motion.p variants={textVariants}>
              Every student has questions they want to answer, problems they
              want to solve, and ideas they want to build.
            </motion.p>
            <motion.p variants={textVariants}>
              But access to quality education is still limited by language,
              location, and cost.
            </motion.p>
            <motion.p variants={textVariants}>
              We started{" "}
              <Link
                href="https://moriprep.xyz/"
                className="underline font-medium decoration-2 decoration-gray-400 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                Mori Prep
              </Link>{" "}
              in the summer of 2023 with a simple belief:
            </motion.p>
            <motion.p
              variants={textVariants}
              className="text-4xl font-eb-garamond font-slim italic tracking-tight text-neutral-1000"
            >
              "A student's potential should never depend on their ability to
              pay."
            </motion.p>
            <motion.p variants={textVariants}>
              We saw talented Mongolian students struggle to learn programming
              because the best resources were often inaccessible. Later, we
              discovered the same challenge existed in test preparation —
              especially for the SAT, where quality guidance often comes with a
              high price tag.
            </motion.p>
            <motion.p variants={textVariants}>
              So we built the platform we wished we had.
            </motion.p>
            <motion.p variants={textVariants}>
              Mori Prep is a free, non-profit learning platform helping students
              prepare for the Digital SAT and develop the skills to create,
              innovate, and solve problems.
            </motion.p>
            <motion.p variants={textVariants}>
              We don't believe education is about memorizing answers.
            </motion.p>
            <motion.p variants={textVariants}>
              It's about learning how to think.
            </motion.p>
            <motion.p variants={textVariants}>
              How to solve difficult problems.
            </motion.p>
            <motion.p variants={textVariants}>
              How to learn independently.
            </motion.p>
            <motion.p variants={textVariants}>
              How to build things that matter.
            </motion.p>
            <motion.p
              variants={textVariants}
              className="text-3xl  font-eb-garamond font-slim italic tracking-tight  text-neutral-900"
            >
              Built by students, for students.
            </motion.p>
            <motion.p variants={textVariants}>
              We believe the next generation of engineers, founders, and
              creators can come from anywhere.
            </motion.p>
            <motion.p variants={textVariants}>
              And we're here to make sure they have the opportunity to prove it.
            </motion.p>
            <motion.p
              variants={textVariants}
              className="text-3xl font-eb-garamond font-slim italic tracking-tight  text-neutral-900"
            >
              Want to build with us?
            </motion.p>
            <motion.p variants={textVariants}>
              We seasonally welcome students who want to contribute to our
              mission — whether through coding, design, content creation,
              curriculum development, or new ideas. Every contribution helps us
              make education more accessible for the next generation of
              learners.
            </motion.p>
            <motion.p variants={textVariants}>
              Together, we can build something that matters.
            </motion.p>
            <motion.p variants={textVariants}>
              Welcome to the future of learning.
            </motion.p>
            <motion.p
              variants={textVariants}
              className="mt-12 text-neutral-400 font-medium"
            >
              — Bilegt & Gundsambuu
            </motion.p>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
