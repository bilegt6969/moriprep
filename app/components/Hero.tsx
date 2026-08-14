"use client";
import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { SlotText } from "slot-text/react";
import "slot-text/style.css";

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
// ISOLATED TICKER COMPONENT
// Memoized so it NEVER re-renders when the text changes
// ==========================================
const LogoTicker = memo(() => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-18.75 sm:h-21.25 md:h-25 w-full bg-transparent flex flex-col justify-center z-20">
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
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 z-10 pointer-events-none bg-linear-to-r from-white via-white/90 to-transparent" />

          {/* The Wrapper that Animates */}
          <div className="flex w-max animate-infinite-scroll group-hover:paused">
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
                  className="shrink-0 w-40 sm:w-52 md:w-64 px-6 sm:px-10 md:px-14 flex items-center justify-center active:scale-95 transition-transform duration-100"
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

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev: number) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setRotatingWord(words[wordIndex] || "Free");
  }, [wordIndex]);

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
            <span
              className="text-[1.35em] tracking-tighter font-light"
              style={{ fontFamily: "EB Garamond, Georgia, serif" }}
            >
              mori
            </span>{" "}
            Prep
            <br />
            everything is{" "}
            <SlotText
              text={rotatingWord}
              options={{ direction: wordIndex % 2 === 0 ? "up" : "down" }}
            />
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
                href="download.html"
                target="_blank"
                rel="noopener noreferrer"
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
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-5"
                  style={{ transform: "translateY(-1px)" }}
                >
                  <path
                    d="M13.3636 10.6359C13.3832 9.09202 14.1985 7.63115 15.4918 6.82249C14.6759 5.6374 13.3092 4.88602 11.8874 4.84078C10.3708 4.67889 8.90062 5.76366 8.12782 5.76366C7.34007 5.76366 6.15022 4.85685 4.86895 4.88366C3.19887 4.93853 1.64194 5.90417 0.82941 7.38906C-0.917205 10.4644 0.385612 14.9841 2.05872 17.47C2.89582 18.6873 3.87414 20.047 5.15425 19.9988C6.40692 19.9459 6.87477 19.1864 8.38684 19.1864C9.88489 19.1864 10.3238 19.9988 11.6299 19.9681C12.9741 19.9459 13.821 18.7454 14.6287 17.5166C15.2301 16.6493 15.693 15.6907 16 14.6763C14.4204 13.9969 13.3654 12.3802 13.3636 10.6359Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M10.8966 3.20595C11.6295 2.31119 11.9906 1.16113 11.9031 0C10.7834 0.1196 9.74914 0.663834 9.00635 1.52426C8.27999 2.36494 7.90199 3.49477 7.97345 4.61152C9.09356 4.62325 10.1947 4.09376 10.8966 3.20595Z"
                    fill="currentColor"
                  ></path>
                </svg>
                Start Practicing
              </a>
            </div>
            <button
              className="flex items-center justify-center gap-3 px-5 py-3 rounded-full font-medium text-[17px] leading-none tracking-tight transition-colors duration-100"
              style={{
                borderRadius: "32px",
                height: "3rem",
                letterSpacing: "-0.01375rem",
                backgroundColor: "#F6F4EF",
                color: "#121212",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#EAE6DD";
              }}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#F6F4EF")
              }
            >
              <svg
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4.5 h-5"
              >
                <path
                  d="M0.5 3.29857L0.499999 16.7014C0.499998 19.0333 3.04392 20.4736 5.04349 19.2739L16.2125 12.5725C18.1546 11.4073 18.1546 8.59273 16.2125 7.42752L5.04349 0.726094C3.04392 -0.47365 0.5 0.966686 0.5 3.29857Z"
                  fill="currentColor"
                ></path>
              </svg>
              Watch Demo
            </button>
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
          className="w-[95%] sm:w-[90%] md:max-w-375 mx-auto h-auto block translate-y-[6%]"
        />
        <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-linear-to-t from-white/90 from-30% via-white/80 via-60% to-transparent" />
      </motion.div>

      {/* RENDER ISOLATED TICKER */}
      <LogoTicker />
    </section>
  );
}
