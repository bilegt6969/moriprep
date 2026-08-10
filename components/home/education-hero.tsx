"use client";

import ShowInMapsBadge from "@/components/home/show-in-maps-badge";
import WaitlistButton from "@/components/home/waitlist-button";
import { motion, Variants } from "framer-motion";
import { auth } from "lib/firebase";
import { memo, useEffect, useState } from "react";
import { SlotText } from "slot-text/react";
import "slot-text/style.css";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 15, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.1 },
  },
};

const schools = [
  { logo: "harvard.png", url: "https://www.harvard.edu" },
  { logo: "mit.avif", url: "https://www.mit.edu" },
  { logo: "stanford.png", url: "https://www.stanford.edu" },
  { logo: "yale.avif", url: "https://www.yale.edu" },
  { logo: "princeton.png", url: "https://www.princeton.edu" },
  { logo: "1.png", url: "yonsei" },
  { logo: "2.png", url: "kaist" },
  { logo: "3.png", url: "reed college" },
  { logo: "4.png", url: "sewanee uni of south" },
  { logo: "5.png", url: "cwru" },
  { logo: "6.png", url: "wake forest" },
  { logo: "7.png", url: "nyu shanghai" },
  { logo: "8.png", url: "uoft" },
  { logo: "9.png", url: "duke khusnshan" },
];

// ==========================================
// 1. ISOLATED TICKER COMPONENT
// Memoized so it NEVER re-renders when the text changes
// ==========================================
const LogoTicker = memo(() => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[75px] sm:h-[85px] md:h-[100px] w-full bg-transparent flex flex-col justify-center z-20">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes infinite-scroll {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .animate-infinite-scroll {
              animation: infinite-scroll 35s linear infinite;
              will-change: transform;
            }
          `,
        }}
      />
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.5,
          }}
          className="text-[9px] sm:text-[11px] md:text-xs font-medium tracking-tight text-neutral-400 text-center mb-2"
        >
          Trusted by students admitted to
        </motion.p>

        <div className="w-full relative overflow-hidden flex items-center group">
          {/* Frosted Fade Left */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-white via-white/90 to-transparent" />

          {/* The Wrapper that Animates */}
          <div className="flex w-max animate-infinite-scroll group-hover:[animation-play-state:paused]">
            {/* Group 1 */}
            <div className="flex items-center px-4">
              {schools.map((school, index) => (
                <a
                  key={`group1-${index}`}
                  href={school.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-40 sm:w-52 md:w-64 px-6 sm:px-10 md:px-14 flex items-center justify-center active:scale-95 transition-transform duration-100"
                >
                  <img
                    src={`/schools/${school.logo}`}
                    alt="University Logo"
                    width="150"
                    height="60"
                    decoding="async"
                    className="h-9 sm:h-10 md:h-12 w-auto object-contain grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-opacity duration-300"
                  />
                </a>
              ))}
            </div>

            {/* Group 2 (Exact Duplicate) */}
            <div className="flex items-center px-4" aria-hidden="true">
              {schools.map((school, index) => (
                <a
                  key={`group2-${index}`}
                  href={school.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  className="flex-shrink-0 w-40 sm:w-52 md:w-64 px-6 sm:px-10 md:px-14 flex items-center justify-center active:scale-95 transition-transform duration-100"
                >
                  <img
                    src={`/schools/${school.logo}`}
                    alt="University Logo"
                    width="150"
                    height="60"
                    decoding="async"
                    className="h-9 sm:h-10 md:h-12 w-auto object-contain grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-opacity duration-300"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Frosted Fade Right */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-white via-white/90 to-transparent" />
        </div>
      </div>
    </div>
  );
});

LogoTicker.displayName = "LogoTicker";

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export function EducationHero() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rotatingWord, setRotatingWord] = useState("Premium");
  const words = ["Free", "Super", "Open"];
  const [wordIndex, setWordIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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

  // Because the ticker is now separated, this 2-second interval
  // will no longer cause the ticker animation to lag or jump.
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setRotatingWord(words[wordIndex] || "Premium");
  }, [wordIndex]);

  const buttonHref = "/practice";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: isMounted ? 1 : 0 }}
      transition={{ duration: 0.8, ease: customEase }}
      className="relative h-[100dvh] min-h-[650px] w-full bg-white overflow-hidden flex flex-col"
    >
      {/* Ambient Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-neutral-200/30 rounded-full blur-[80px] transform-gpu will-change-transform"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-neutral-300/20 rounded-full blur-[80px] transform-gpu will-change-transform"
        />
      </div>

      {/* Top Navbar Spacer */}
      <div className="h-[70px] sm:h-[90px] shrink-0" />

      {/* TEXT Section */}
      <div className="absolute left-0 right-0 top-[45%] -translate-y-1/2 z-20 pointer-events-none px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="pointer-events-auto flex flex-col items-center justify-center max-w-5xl mx-auto w-full text-center"
        >
          <motion.div variants={textVariants} className="mb-4">
            <ShowInMapsBadge />
          </motion.div>
          <motion.h1
            variants={textVariants}
            className="text-5xl sm:text-6xl md:text-[5rem] font-slim tracking-tight text-neutral-900 mb-3 sm:mb-5 leading-[1.05] font-eb-garamond"
          >
            at <span>mori</span> Prep
            <br />
            everything is{" "}
            <SlotText
              text={rotatingWord}
              options={{ direction: wordIndex % 2 === 0 ? "up" : "down" }}
            />
          </motion.h1>

          <motion.p
            variants={textVariants}
            className="text-[15px] sm:text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-6 sm:mb-8 leading-snug font-medium"
          >
            Хамгийн үнэгүйгээр DSAT-д суралцахуй.. <br /> kshoh
          </motion.p>

          <motion.div variants={buttonVariants}>
            <WaitlistButton href={buttonHref} />
          </motion.div>
        </motion.div>
      </div>

      {/* ILLUSTRATION */}
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 left-0 right-0 z-10 w-full pointer-events-none"
      >
        <img
          src="/home/68e8f533b2d110c6d06c6afd_Group 1261154922 (2).avif"
          alt="Illustration"
          className="w-[95%] sm:w-[90%] md:max-w-[1500px] mx-auto h-auto block translate-y-[6%]"
        />
        <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-white/90 from-30% via-white/80 via-60% to-transparent" />
      </motion.div>

      {/* RENDER ISOLATED TICKER */}
      <LogoTicker />
    </motion.section>
  );
}
