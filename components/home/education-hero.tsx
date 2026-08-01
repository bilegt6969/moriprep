"use client";

import WaitlistButton from "@/components/home/waitlist-button";
import { motion } from "framer-motion";
import { auth } from "lib/firebase";
import { useEffect, useState } from "react";
import { SlotText } from "slot-text/react";
import "slot-text/style.css";

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

export function EducationHero() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rotatingWord, setRotatingWord] = useState("Premium");
  const words = ["Free", "Super", "Open"];
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
      ? "/home"
      : "/sign-in";

  return (
    <section className="relative min-h-[100dvh] w-full bg-white overflow-hidden">
      {/* Ambient Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[15%] left-[10%] w-[600px] h-[600px] bg-neutral-200/20 rounded-full blur-[150px] will-change-transform"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[15%] right-[10%] w-[700px] h-[700px] bg-neutral-300/15 rounded-full blur-[150px] will-change-transform"
        />
      </div>

      {/* Text Layer */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 z-10 flex flex-col items-center justify-center -translate-y-[10vh] max-w-5xl mx-auto px-6 text-center w-full"
      >
        <motion.div variants={textVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-neutral-200 text-sm font-medium text-neutral-800 relative">
            ene hesegdeer logo go shaa
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-neutral-200 rotate-45"></div>
          </div>
        </motion.div>

        <motion.h1
          variants={textVariants}
          className="text-5xl md:text-7xl font-slim tracking-tighter text-neutral-900 mb-6 leading-[1.05] font-eb-garamond"
        >
          at <span className="">mori</span> Prep
          <br />
          everything is{" "}
          <SlotText
            text={rotatingWord}
            options={{ direction: wordIndex % 2 === 0 ? "up" : "down" }}
          />
        </motion.h1>

        <motion.p
          variants={textVariants}
          className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-tight font-medium"
        >
          Хамгийн үнэгүйгээр DSAT-д суралцахуй.. <br /> kshoh
        </motion.p>

        <motion.div variants={buttonVariants}>
          <WaitlistButton href={buttonHref} />
        </motion.div>
      </motion.div>

      {/* Illustration Layer */}
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 left-0 right-0 w-full z-0 pointer-events-none"
      >
        {/* Changed w-full to w-[85%] and added mx-auto to center it */}
        <img
          src="/home/68e8f533b2d110c6d06c6afd_Group 1261154922 (2).avif"
          alt="School logos"
          className="w-[95%] mx-auto h-auto block translate-y-[15%]"
        />

        {/* The White Fade Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </motion.div>
    </section>
  );
}
