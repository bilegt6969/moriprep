"use client";

import { motion, useReducedMotion } from "framer-motion";
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

const moriMorphDuration = 1400;
const moriMorphHold = 2200;

function GooMorphMori() {
  const reduceMotion = useReducedMotion();
  const [currentWord, setCurrentWord] = useState("mori");
  const [nextWord, setNextWord] = useState("морь");
  const [isMorphing, setIsMorphing] = useState(false);
  const wordMeasureRef = useRef<HTMLSpanElement>(null);
  const [wordWidths, setWordWidths] = useState<{
    mori: number;
    cyrillic: number;
  }>();

  useEffect(() => {
    if (reduceMotion) return;

    let morphTimeout: number | undefined;
    const holdTimeout = window.setTimeout(() => {
      setIsMorphing(true);
      morphTimeout = window.setTimeout(() => {
        setCurrentWord(nextWord);
        setNextWord(currentWord);
        setIsMorphing(false);
      }, moriMorphDuration);
    }, moriMorphHold);

    return () => {
      if (morphTimeout) window.clearTimeout(morphTimeout);
      window.clearTimeout(holdTimeout);
    };
  }, [currentWord, nextWord, reduceMotion]);

  useEffect(() => {
    const measureElement = wordMeasureRef.current;
    if (!measureElement) return;

    const mori = measureElement.children[0];
    const cyrillic = measureElement.children[1];
    const measureWords = () => {
      setWordWidths({
        mori: mori.getBoundingClientRect().width,
        cyrillic: cyrillic.getBoundingClientRect().width,
      });
    };

    measureWords();
    const resizeObserver = new ResizeObserver(measureWords);
    resizeObserver.observe(mori);
    resizeObserver.observe(cyrillic);

    return () => resizeObserver.disconnect();
  }, []);

  const cyrillicScale =
    wordWidths && wordWidths.cyrillic > 0
      ? wordWidths.mori / wordWidths.cyrillic
      : undefined;
  const cyrillicFontSize =
    cyrillicScale === undefined
      ? undefined
      : { fontSize: `${cyrillicScale * 100}%` };
  const horizontalPadding =
    wordWidths === undefined ? undefined : Math.max(2, wordWidths.mori * 0.025);

  return (
    <>
      <svg className="hero-goo-filter" aria-hidden="true">
        <filter id="mori-goo-morph">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
          />
        </filter>
      </svg>
      <span
        className={`hero-goo-morph text-[1.35em] font-eb-garamond font-light${isMorphing ? " is-melting" : ""}`}
        role="status"
        aria-live="polite"
        aria-label={isMorphing ? nextWord : currentWord}
        style={
          wordWidths === undefined || horizontalPadding === undefined
            ? undefined
            : {
                width: `${wordWidths.mori + horizontalPadding * 2}px`,
                paddingLeft: `${horizontalPadding}px`,
                paddingRight: `${horizontalPadding}px`,
              }
        }
      >
        <span
          className={`hero-goo-word hero-goo-word-current${currentWord === "морь" ? " hero-goo-word-cyrillic" : ""}`}
          aria-hidden="true"
          style={currentWord === "морь" ? cyrillicFontSize : undefined}
        >
          <span className="hero-goo-word-text">{currentWord}</span>
        </span>
        <span
          className={`hero-goo-word hero-goo-word-next${nextWord === "морь" ? " hero-goo-word-cyrillic" : ""}`}
          aria-hidden="true"
          style={nextWord === "морь" ? cyrillicFontSize : undefined}
        >
          <span className="hero-goo-word-text">{nextWord}</span>
        </span>
        <span
          ref={wordMeasureRef}
          className="hero-goo-measure"
          aria-hidden="true"
        >
          <span className="hero-goo-word-text">mori</span>
          <span className="hero-goo-word-text">морь</span>
        </span>
      </span>
    </>
  );
}

function MagneticStartButton() {
  const reduceMotion = useReducedMotion();
  const [offset, setOffset] = useState({
    buttonX: 0,
    buttonY: 0,
    labelX: 0,
    labelY: 0,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - bounds.left - bounds.width / 2;
    const dy = event.clientY - bounds.top - bounds.height / 2;
    const distance = Math.hypot(dx, dy);
    const pull = distance < 130 ? 1 - (distance / 130) * 0.35 : 0;

    setOffset({
      buttonX: dx * 0.32 * pull,
      buttonY: dy * 0.38 * pull,
      labelX: dx * 0.14 * pull,
      labelY: dy * 0.18 * pull,
    });
  };

  return (
    <div
      className="relative inline-block p-1.5"
      onMouseMove={handleMouseMove}
      onMouseLeave={() =>
        setOffset({ buttonX: 0, buttonY: 0, labelX: 0, labelY: 0 })
      }
    >
      <div
        className="relative will-change-transform"
        style={{
          transform: `translate3d(${offset.buttonX}px, ${offset.buttonY}px, 0)`,
          transition: reduceMotion
            ? undefined
            : "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          aria-hidden="true"
          style={{
            border: "1px solid rgba(156, 163, 175, 0.4)",
            zIndex: -1,
          }}
        />
        <motion.a
          href="/question-rush"
          className="relative z-10 flex h-12 items-center justify-center rounded-full px-6 text-[17px] font-medium leading-none tracking-tight text-white transition-colors duration-100"
          style={{
            borderRadius: "32px",
            letterSpacing: "-0.01375rem",
            backgroundColor: "rgba(23, 23, 23, 0.8)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          onMouseEnter={(event) =>
            (event.currentTarget.style.backgroundColor =
              "rgba(18, 18, 18, 0.9)")
          }
          onMouseLeave={(event) =>
            (event.currentTarget.style.backgroundColor =
              "rgba(23, 23, 23, 0.8)")
          }
        >
          <span
            className="inline-flex items-center gap-3"
            style={{
              transform: `translate3d(${offset.labelX}px, ${offset.labelY}px, 0)`,
              transition: reduceMotion
                ? undefined
                : "transform 150ms cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            Start Practicing
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h13M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </motion.a>
      </div>
    </div>
  );
}

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
      setWordIndex((previous) => (previous + 1) % words.length);
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
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-white px-4 py-20 md:h-screen md:min-h-0 md:px-10 md:py-0 lg:px-10"
    >
      {/* Background gradient/glow effect */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-orange-50 opacity-50" />

      {/* Main content container */}
      <div className="container mx-auto px-4 md:px-6 lg:px-10 relative z-20">
        <motion.div
          className="mx-auto max-w-6xl text-center md:-translate-y-24"
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
            className="mb-4 text-[clamp(2.5rem,10vw,2.75rem)] font-medium leading-[1.1] tracking-tighter text-primary md:text-[68px]"
            style={{
              color: "var(--heading)",
            }}
            variants={itemVariants}
          >
            at <GooMorphMori /> Prep
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
            <MagneticStartButton />
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
            src="/overview/hero-illustration.avif"
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
            className="mx-auto flex items-center justify-center
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
