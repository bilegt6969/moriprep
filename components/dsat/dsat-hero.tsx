"use client";

import { motion } from "framer-motion";

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

const textVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: customEase },
  },
};

export function DSATHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-linear-to-br from-neutral-50 via-white to-neutral-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px]"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20"
      >
        <motion.div variants={textVariants} className="mb-6">
          <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-sm font-medium text-purple-700 mb-6">
            DSAT Practice Platform
          </span>
        </motion.div>

        <motion.h1
          variants={textVariants}
          className="text-5xl md:text-7xl font-slim tracking-tighter text-neutral-900 mb-6 leading-[1.1] font-eb-garamond"
        >
          Master the
          <br />
          <span className="text-neutral-900">Digital SAT.</span>
        </motion.h1>

        <motion.p
          variants={textVariants}
          className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Comprehensive practice with real exam-style questions. Track your
          progress, identify weaknesses, and achieve your target score.
        </motion.p>
      </motion.div>
    </section>
  );
}
