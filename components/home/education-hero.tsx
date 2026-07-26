"use client";

import { motion } from "framer-motion";
import { auth } from "lib/firebase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SlotText } from "slot-text/react";
import "slot-text/style.css";

// Using a slightly more dramatic easing curve for that "expensive" feel
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
  // Reduced the Y drop slightly but kept the blur for a softer landing
  hidden: { opacity: 0, y: 15, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: customEase },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: customEase, delay: 0.4 },
  },
};

const universities = [
  { name: "Stanford University", src: "/stanford.png" },
  { name: "MIT", src: "/mit.avif" },
  { name: "Harvard University", src: "/harvard.png" },
  { name: "Princeton University", src: "/princeton.png" },
  { name: "Yale University", src: "/yale.avif" },
];

export function EducationHero() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rotatingWord, setRotatingWord] = useState("Premium");
  const words = ["Premium", "Clean", "Smooth"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setRotatingWord(words[wordIndex] || "Premium");
  }, [wordIndex]);

  const buttonHref = isLoading
    ? "/signup"
    : isAuthenticated
      ? "/dsat"
      : "/sign-in";

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-50 overflow-hidden">
      {/* 
        Improved Animated background: 
        Larger blur, lower opacity, and slower movement so it acts as ambient light 
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[15%] left-[10%] w-[600px] h-[600px] bg-neutral-200/20 rounded-full blur-[150px] will-change-transform"
        />
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-[15%] right-[10%] w-[700px] h-[700px] bg-neutral-300/15 rounded-full blur-[150px] will-change-transform"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20"
      >
        <motion.div variants={textVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-neutral-100 to-neutral-50 border border-neutral-200/80 text-sm font-medium text-neutral-600 mb-6 transition-all duration-300 hover:shadow-md hover:border-neutral-300 hover:from-neutral-200 hover:to-neutral-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
            </span>
            Previously bytecode
          </span>
        </motion.div>

        <motion.h1
          variants={textVariants}
          className="text-5xl md:text-7xl font-slim tracking-tighter text-neutral-900 mb-6 leading-[1.05] font-eb-garamond"
        >
          at mori Prep
          <br />
          everything thing feels{" "}
          <SlotText
            text={rotatingWord}
            options={{ direction: wordIndex % 2 === 0 ? "up" : "down" }}
          />
        </motion.h1>

        <motion.p
          variants={textVariants}
          className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-snug font-normal"
        >
          Master the Digital SAT. Without the price tag
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div variants={buttonVariants}>
            <Link
              href={buttonHref}
              className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-neutral-900 text-white font-medium text-lg hover:bg-black transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10"
            >
              Start Learning for Free
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={textVariants} className="mt-20">
          <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-16">
            <h2 className="mb-8 text-balance text-center font-slim text-base text-neutral-400 tracking-wide sm:mb-10 sm:text-lg">
              mori prep helps students get into top schools
            </h2>
            <div className="relative min-h-24 w-full lg:min-h-12">
              <ul className="mx-auto grid w-full max-w-sm grid-cols-2 items-center justify-items-center gap-x-6 gap-y-8 lg:flex lg:max-w-none lg:justify-between lg:gap-x-3 lg:gap-y-0 xl:gap-x-6">
                {universities.map((uni) => (
                  <li
                    key={uni.name}
                    className="flex w-full items-center justify-center lg:flex-1"
                  >
                    <img
                      alt={uni.name}
                      width="220"
                      height="64"
                      decoding="async"
                      className="h-8 w-full max-w-[7.5rem] object-contain opacity-60 grayscale mix-blend-multiply sm:h-9 sm:max-w-[8.5rem] md:h-10 lg:h-11 lg:max-w-44 transition-opacity duration-300 hover:opacity-100 dark:opacity-70 dark:mix-blend-screen dark:invert dark:grayscale-0"
                      src={uni.src}
                      style={{ color: "transparent" }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
