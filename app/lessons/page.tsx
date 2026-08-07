"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

// --- Utilities & Animations ---
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));
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

// --- Folder & Card Components ---
const themes = {
  black: {
    backFill: "black",
    backInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.37 0",
    backInsetShadow: "inset 0 0 6px 2px rgba(255,255,255,0.37)",
    flapFill: "#292929",
    flapFillOpacity: 0.25,
    flapStroke: "#979797",
    flapInsetColor: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0",
    cardFill: "#F1F1F1",
    cardStroke: "#E0E0E0",
    cardLineFill: "#D4D4D4",
    cardInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0",
  },
  white: {
    backFill: "#ffffff",
    backInsetColor: "0 0 0 0 0.7 0 0 0 0 0.7 0 0 0 0 0.7 0 0 0 0.25 0",
    backInsetShadow: "inset 0 0 6px 2px rgba(178,178,178,0.25)",
    flapFill: "#f5f5f5",
    flapFillOpacity: 0.85,
    flapStroke: "#d4d4d4",
    flapInsetColor: "0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 0.15 0",
    cardFill: "#262626",
    cardStroke: "#404040",
    cardLineFill: "#737373",
    cardInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0",
  },
  blue: {
    backFill: "#50B1FD",
    backInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0",
    backInsetShadow: "inset 0 0 6px 2px rgba(255,255,255,0.35)",
    flapFill: "#3a9ae8",
    flapFillOpacity: 0.45,
    flapStroke: "#7ec8ff",
    flapInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0",
    cardFill: "#F1F1F1",
    cardStroke: "#E0E0E0",
    cardLineFill: "#D4D4D4",
    cardInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0",
  },
  purple: {
    backFill: "#8a2be2",
    backInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.37 0",
    backInsetShadow: "inset 0 0 6px 2px rgba(255,255,255,0.37)",
    flapFill: "#7b1fa2",
    flapFillOpacity: 0.3,
    flapStroke: "#e0e0e0",
    flapInsetColor: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0",
    cardFill: "#ffffff",
    cardStroke: "#eeeeee",
    cardLineFill: "#d1c4e9",
    cardInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0",
  },
} as const;

const sizeScales = {
  sm: 0.65,
  md: 1,
  lg: 1.35,
} as const;

type FolderComponentProps = Omit<React.ComponentProps<"div">, "color"> & {
  color?: keyof typeof themes;
  size?: keyof typeof sizeScales;
  singleCardMode?: boolean;
};

const BASE_WIDTH = 321;
const BASE_HEIGHT = 270;

const FLAP_PATH =
  "M0 25C0 11.1929 11.1929 0 25 0H136.084C143.044 0 149.689 2.90139 154.42 8.00608L178.08 33.5343C182.811 38.639 189.456 41.5404 196.416 41.5404H296C309.807 41.5404 321 52.7333 321 66.5404V216C321 229.807 309.807 241 296 241H25C11.1929 241 0 229.807 0 216V25Z";

const Folder = ({
  color = "black",
  size = "md",
  singleCardMode = false,
  className,
  ...props
}: FolderComponentProps) => {
  const theme = themes[color] ?? themes.black;
  const scale = sizeScales[size];
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const renderCard = (id: number) => {
    return singleCardMode ? (
      <Card id={id} theme={theme} simplified={true} />
    ) : (
      <Card id={id} theme={theme} />
    );
  };

  return (
    <div
      data-slot="folder"
      className={cn(
        "relative flex items-center justify-center select-none",
        className,
      )}
      {...props}
    >
      <div
        className="relative cursor-pointer"
        style={{
          width: BASE_WIDTH * scale,
          height: BASE_HEIGHT * scale,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsOpen(false);
        }}
        onClick={() => setIsOpen((o) => !o)}
      >
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            transform: `translate(-50%, -50%) scale(${scale})`,
            perspective: 800 * scale,
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              style={{
                width: BASE_WIDTH,
                height: BASE_HEIGHT,
                borderRadius: 25,
                backgroundColor: theme.backFill,
                boxShadow: theme.backInsetShadow,
              }}
            />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {singleCardMode ? (
              <motion.div
                className="absolute"
                animate={{
                  y: isOpen ? -170 : isHovered ? -35 : -15,
                  rotate: isOpen ? -1 : 0,
                  x: 0,
                }}
                transition={{ duration: 0.6, ease: customEase }}
              >
                {renderCard(1)}
              </motion.div>
            ) : (
              <>
                <motion.div
                  className="absolute"
                  animate={{
                    y: isOpen ? -160 : isHovered ? -30 : -10,
                    x: isOpen ? 70 : 40,
                    rotate: isOpen ? 18 : isHovered ? 14 : 10,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 13,
                    delay: isOpen ? 0.1 : isHovered ? 0.12 : 0,
                  }}
                >
                  {renderCard(1)}
                </motion.div>
                <motion.div
                  className="absolute"
                  animate={{
                    y: isOpen ? -180 : isHovered ? -35 : -20,
                    x: isOpen ? 0 : 3,
                    rotate: isOpen ? -3 : isHovered ? -1 : 2,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 13,
                    delay: isOpen ? 0.05 : isHovered ? 0.06 : 0,
                  }}
                >
                  {renderCard(2)}
                </motion.div>
                <motion.div
                  className="absolute"
                  animate={{
                    y: isOpen ? -170 : isHovered ? -44 : -22,
                    x: isOpen ? -65 : -40,
                    rotate: isOpen ? -14 : isHovered ? -9 : -5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 13,
                    delay: isOpen ? 0 : 0,
                  }}
                >
                  {renderCard(3)}
                </motion.div>
              </>
            )}
          </div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4"
            style={{
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
              width: 321,
              height: 241,
            }}
            animate={{ rotateX: isOpen ? -55 : isHovered ? -45 : -15 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <div
              className="absolute inset-0"
              style={{
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                clipPath: `path('${FLAP_PATH}')`,
                WebkitClipPath: `path('${FLAP_PATH}')`,
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                willChange: "transform",
              }}
            />
            <svg
              className="absolute inset-0"
              width="321"
              height="241"
              viewBox="0 0 321 241"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_i_171_13)">
                <path
                  d={FLAP_PATH}
                  fill={theme.flapFill}
                  fillOpacity={theme.flapFillOpacity}
                />
                <path
                  d="M25 0.5H136.084C142.905 0.5 149.417 3.3431 154.054 8.3457L177.713 33.874C182.539 39.0808 189.317 42.04 196.416 42.04H296C309.531 42.04 320.5 53.0092 320.5 66.54V216C320.5 229.531 309.531 240.5 296 240.5H25C11.469 240.5 0.5 229.531 0.5 216V25C0.5 11.469 11.469 0.5 25 0.5Z"
                  stroke={theme.flapStroke}
                />
              </g>
              <defs>
                <filter
                  id="filter0_i_171_13"
                  x="-25.4"
                  y="-25.4"
                  width="371.8"
                  height="291.8"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2.65" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix type="matrix" values={theme.flapInsetColor} />
                  <feBlend
                    mode="normal"
                    in2="shape"
                    result="effect1_innerShadow_171_13"
                  />
                </filter>
              </defs>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

type Theme = (typeof themes)[keyof typeof themes];

interface CardProps {
  id: number;
  theme: Theme;
  simplified?: boolean;
}

const Card = ({ id, theme, simplified = false }: CardProps) => {
  const filterId = `filter0_i_card_${id}`;
  return (
    <div data-slot="folder-card">
      <svg
        width="164"
        height="214"
        viewBox="0 0 164 214"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={`url(#${filterId})`}>
          <rect
            width="163.078"
            height="213.262"
            rx="20"
            fill={theme.cardFill}
          />
        </g>
        <rect
          x="0.5"
          y="0.5"
          width="162.078"
          height="212.262"
          rx="19.5"
          stroke={theme.cardStroke}
        />
        {simplified ? (
          <rect
            x="14.1193"
            y="31.2091"
            width="134.84"
            height="11.8892"
            rx="5.94459"
            fill={theme.cardLineFill}
          />
        ) : (
          <>
            <rect
              x="14.1193"
              y="31.2091"
              width="134.84"
              height="11.8892"
              rx="5.94459"
              fill={theme.cardLineFill}
            />
            {Array.from({ length: 10 }).map((_, i) => (
              <React.Fragment key={i}>
                <rect
                  width="64.5183"
                  height="5.88276"
                  rx="2.94138"
                  transform={`matrix(1 -0.000409158 0.00201956 0.999998 14.8253 ${60.9939 + i * 14.1183})`}
                  fill={theme.cardLineFill}
                />
                <rect
                  width="64.5183"
                  height="5.88276"
                  rx="2.94138"
                  transform={`matrix(1 -0.000461045 0.00179228 0.999998 84.4303 ${60.9617 + i * 14.1183})`}
                  fill={theme.cardLineFill}
                />
              </React.Fragment>
            ))}
          </>
        )}
        <defs>
          <filter
            id={filterId}
            x="0"
            y="0"
            width="166.078"
            height="218.262"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="2"
              operator="erode"
              in="SourceAlpha"
              result={`effect1_innerShadow_${id}`}
            />
            <feOffset dx="3" dy="5" />
            <feGaussianBlur stdDeviation="3.05" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values={theme.cardInsetColor} />
            <feBlend
              mode="normal"
              in2="shape"
              result={`effect1_innerShadow_${id}`}
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

// --- Page Layout & Data ---
const MoriPrepLogo = () => (
  <div className="flex items-center gap-2">
    <img src="/morin.svg" alt="Mori Prep" className="h-8 w-auto" />
  </div>
);

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
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full pt-32 pb-24 flex items-center justify-center px-6 border-b border-neutral-100">
        <div className="w-full max-w-5xl flex items-center justify-between gap-8 md:gap-12 font-medium tracking-tighter text-black text-[22px] leading-tight">
          {/* Left Text and Logo */}
          <div className="flex-1 text-right">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.3 }}
              className="inline-block"
            >
              <MoriPrepLogo />
            </motion.div>
          </div>

          {/* Central Folder Element */}
          <div className="flex-none flex flex-col items-center gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: customEase }}
              className="text-neutral-900"
            >
              Introducing
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.1 }}
            >
              {/* Note: singleCardMode is removed so it defaults to false and fans out cards */}
              <Folder color="blue" size="md" />
            </motion.div>
          </div>

          {/* Right Text */}
          <div className="flex-1 text-left">
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.3 }}
              className="inline-block font-medium text-black"
            >
              Lessons
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Lessons Grid Section */}
      <section className="py-24 px-6 bg-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-12 text-center">
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-medium text-neutral-900 tracking-tight mb-4"
            >
              Available Lessons
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-neutral-500 max-w-2xl mx-auto"
            >
              Structured learning paths to master every section of the Digital
              SAT.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <motion.div
                key={lesson.id}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: customEase }}
              >
                <Link href={`/lessons/${lesson.id}`}>
                  <article className="h-full bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-xl hover:border-blue-200/50 transition-all duration-300 group">
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden relative">
                      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-300" />
                      <img
                        src={lesson.image}
                        alt={lesson.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                          {lesson.category}
                        </span>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {lesson.duration}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold text-neutral-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
                        {lesson.title}
                      </h2>
                      <p className="text-sm text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
                        {lesson.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                        <span className="text-xs font-medium text-neutral-400 bg-neutral-50 px-2 py-1 rounded">
                          {lesson.level}
                        </span>
                        <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-colors">
                          Start
                          <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
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
    </main>
  );
}
