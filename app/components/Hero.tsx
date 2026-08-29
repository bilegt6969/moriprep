"use client";

import { motion } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
import { SlotText } from "slot-text/react";
import "slot-text/style.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 15, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

const headingStyle = {
  color: "#343433",
  letterSpacing: "-0.02em",
};

const bodyStyle = {
  letterSpacing: "-0.01em",
};

const schools = [
  { logo: "harvard.png", url: "https://www.harvard.edu" },
  { logo: "mit.avif", url: "https://www.mit.edu" },
  { logo: "stanford.png", url: "https://www.stanford.edu" },
  { logo: "yale.avif", url: "https://www.yale.edu" },
  { logo: "princeton.png", url: "https://www.princeton.edu" },
  { logo: "1.png", url: "https://www.yonsei.ac.kr" },
  { logo: "2.png", url: "https://www.kaist.ac.kr" },
  { logo: "3.png", url: "https://www.reed.edu" },
  { logo: "4.png", url: "https://www.sewanee.edu" },
  { logo: "5.png", url: "https://www.case.edu" },
  { logo: "6.png", url: "https://www.wfu.edu" },
  { logo: "7.png", url: "https://shanghai.nyu.edu" },
  { logo: "8.png", url: "https://www.utoronto.ca" },
  { logo: "9.png", url: "https://dukekunshan.edu.cn" },
];

// ==========================================
// ISOLATED TICKER COMPONENT
// Memoized so it NEVER re-renders when the text changes.
//
// NOTE: previously this tracked per-image "loaded" state via a Set that was
// never read anywhere (dead code), and was additionally broken because both
// duplicated ticker tracks reused the same 0..N index, so load events from
// group 2 collided with group 1 in the Set. Removed entirely — the ticker
// doesn't need to react to individual image load state, and if we ever do
// want per-logo load state again, group1/group2 need distinct key namespaces
// (e.g. `g1-${index}` / `g2-${index}`) rather than colliding on `index`.
// ==========================================
const LogoTicker = memo(() => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-18.75 sm:h-21.25 md:h-25 w-full bg-transparent flex flex-col justify-center z-20">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.8,
          }}
          className="text-[9px] sm:text-[11px] md:text-xs font-medium tracking-tight text-neutral-400 text-center mb-2"
        >
          Trusted by students admitted to
        </motion.p>

        <div className="w-full relative overflow-hidden flex items-center group">
          {/* Frosted Fade Left */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 pointer-events-none bg-linear-to-r from-white via-white/90 to-transparent" />

          {/* The Wrapper that Animates */}
          <motion.div
            className="flex"
            animate={{
              x: [0, -1500],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Group 1 */}
            <div className="flex items-center px-4">
              {schools.map((school, index) => (
                <a
                  key={`group1-${index}`}
                  href={school.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-40 sm:w-52 md:w-64 px-6 sm:px-10 md:px-14 flex items-center justify-center active:scale-95 transition-transform duration-100"
                >
                  <div className="relative h-9 sm:h-10 md:h-12 w-auto">
                    <img
                      src={`/schools/${school.logo}`}
                      alt="University Logo"
                      width="150"
                      height="60"
                      loading="eager"
                      className="h-9 sm:h-10 md:h-12 w-auto object-contain grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-opacity duration-300"
                      // If a logo fails to load, hide it instead of leaving a
                      // broken-image glyph floating in the ticker.
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  </div>
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
                  className="shrink-0 w-40 sm:w-52 md:w-64 px-6 sm:px-10 md:px-14 flex items-center justify-center active:scale-95 transition-transform duration-100"
                >
                  <div className="relative h-9 sm:h-10 md:h-12 w-auto">
                    <img
                      src={`/schools/${school.logo}`}
                      alt="University Logo"
                      width="150"
                      height="60"
                      loading="eager"
                      className="h-9 sm:h-10 md:h-12 w-auto object-contain grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-opacity duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Frosted Fade Right */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 pointer-events-none bg-linear-to-l from-white via-white/90 to-transparent" />
        </div>
      </div>
    </div>
  );
});

LogoTicker.displayName = "LogoTicker";

export function Hero() {
  const [rotatingWord, setRotatingWord] = useState("Free");
  const words = ["Free", "Super", "Open"];
  const [wordIndex, setWordIndex] = useState(0);

  // Track image load state.
  // imgLoaded === true  -> render the real <img>, hide skeleton
  // imgError  === true  -> render a graceful fallback, hide skeleton
  // both false           -> still loading, show skeleton
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev: number) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setRotatingWord(words[wordIndex] || "Free");
  }, [wordIndex]);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    // Handles the case where the browser already resolved the image
    // (cached, or resolved before React attached the onLoad listener).
    if (el.complete) {
      if (el.naturalWidth > 0) {
        setImgLoaded(true);
      } else {
        // complete but naturalWidth 0 means it errored
        setImgError(true);
      }
      return;
    }

    // Safety net: if neither load nor error fires within a few seconds
    // (flaky network, dropped event, etc.), fall back to the error state
    // rather than forcing opacity-100 on an <img> that never actually
    // resolved (which previously showed a broken-image icon).
    const timeout = setTimeout(() => {
      if (el.complete && el.naturalWidth > 0) {
        setImgLoaded(true);
      } else {
        setImgError(true);
      }
    }, 6000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      id="join"
      className="relative h-screen flex items-center justify-center bg-white overflow-hidden px-4 md:px-10 lg:px-10"
    >
      {/* Background gradient/glow effect */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-orange-50 opacity-50" />

      {/* Main content container */}
      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-20">
        <motion.div
          className="max-w-6xl mx-auto text-center -translate-y-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo/Graphic */}
          <motion.div
            className="flex justify-center mb-4"
            variants={itemVariants}
          >
            <svg
              width="2376"
              height="548"
              viewBox="0 0 2376 548"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-4xl h-auto max-h-24"
            >
              <g opacity="1">
                <circle
                  cx="1188"
                  cy="274"
                  r="200"
                  fill="var(--graphic-yellow-pale)"
                />
                <circle cx="900" cy="200" r="100" fill="var(--graphic-blue)" />
                <circle cx="1400" cy="300" r="80" fill="var(--graphic-green)" />
              </g>
            </svg>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-[44px] md:text-[68px] font-medium leading-[1.1] tracking-tighter text-primary mb-4"
            style={{
              color: "var(--heading)",
            }}
            variants={itemVariants}
          >
            at{" "}
            <span className="text-[1.35em] font-eb-garamond tracking-tighter font-light">
              mori
            </span>{" "}
            Prep
            <br />
            everything is{" "}
            <SlotText
              text={rotatingWord}
              options={{ direction: wordIndex % 2 === 0 ? "up" : "down" }}
            />
            {""}!
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl font-eb-garamond text-body-muted max-w-2xl mx-auto mb-8"
            style={bodyStyle}
            variants={itemVariants}
          >
            Mongolia’s first open Digital SAT platform. Practice with official
            College Board questions, structured open lessons, and curated prep
            books—100% free.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            variants={itemVariants}
          >
            <div className="relative inline-block p-1.5">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "1px solid rgba(156, 163, 175, 0.4)",
                  zIndex: -1,
                }}
              />
              <a
                href="/practice"
                className="flex items-center justify-center gap-3 px-6 py-3 text-white rounded-full font-medium text-[17px] leading-none tracking-tight transition-colors duration-100 relative z-10"
                style={{
                  borderRadius: "32px",
                  height: "3rem",
                  letterSpacing: "-0.01375rem",
                  backgroundColor: "rgba(23, 23, 23, 0.8)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(18, 18, 18, 0.9)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(23, 23, 23, 0.8)")
                }
              >
                Start Practicing
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ILLUSTRATION */}
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 left-0 right-0 z-10 w-full pointer-events-none flex justify-center"
      >
        {/* Skeleton stays up until we know we're loaded OR failed */}
        {!imgLoaded && !imgError && (
          <div
            className="block mx-auto
            w-[150%] max-w-[150%] h-[35vh] bg-neutral-100
            sm:w-[90%] sm:max-w-none sm:h-auto sm:aspect-[375/280] md:max-w-375
            animate-pulse
          "
          />
        )}

        {!imgError && (
          <img
            ref={imgRef}
            src="/home/hero-illustration.avif"
            alt="Illustration"
            width="1200"
            height="800"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`block mx-auto transition-opacity duration-700 ease-out
              w-[150%] max-w-[150%] h-[35vh] object-cover object-top translate-y-[15%]
              sm:w-[90%] sm:max-w-none sm:h-auto sm:object-contain sm:translate-y-[6%] md:max-w-375
              ${imgLoaded ? "opacity-100" : "opacity-0 absolute"}
            `}
          />
        )}

        {/* Graceful fallback: previously an error left this whole region
            completely blank (both the skeleton and the <img> branches were
            false). Now we at least keep the layout height and show a subtle
            placeholder instead of a hole in the page. */}
        {imgError && (
          <div
            className="block mx-auto flex items-center justify-center
            w-[150%] max-w-[150%] h-[35vh] bg-neutral-50
            sm:w-[90%] sm:max-w-none sm:h-auto sm:aspect-[375/280] md:max-w-375
          "
            role="img"
            aria-label="Illustration failed to load"
          />
        )}

        <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-linear-to-t from-white/90 from-30% via-white/80 via-60% to-transparent pointer-events-none" />
      </motion.div>

      {/* RENDER ISOLATED TICKER */}
      <LogoTicker />
    </section>
  );
}
