"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

// --- Category Folder Card Component ---
export function CategoryFolderCard({
  title = "Productivity",
  appCount = 76,
  href = "/category/productivity",
  icons = [
    "https://wdxytpvizqbpjhmiaedj.supabase.co/storage/v1/object/public/app-images/f02d6615-a585-4eb9-873a-d8bbf92d649f/icon-1783882472369.webp",
    "https://wdxytpvizqbpjhmiaedj.supabase.co/storage/v1/object/public/app-images/396d0438-2036-4031-a21e-9ae418bdfb8b/icon-1783882477719.webp",
    "https://wdxytpvizqbpjhmiaedj.supabase.co/storage/v1/object/public/app-images/submissions/icon-90f71e8b-633c-477f-a0f3-9562fdab5d42.png",
  ],
}) {
  return (
    <div
      className="transition-[opacity,transform] duration-700 ease-out opacity-100 translate-y-0"
      style={{ willChange: "opacity, transform" }}
    >
      <Link
        href={href}
        aria-label={`${title} — ${appCount} apps`}
        className="group relative block"
      >
        <div className="relative">
          {/* Top Folder Tab */}
          <div className="absolute -top-3 left-5 h-6 w-24 rounded-t-xl bg-secondary border border-border border-b-0"></div>

          {/* Main Folder Body */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl rounded-tl-xl border border-border bg-gradient-to-br from-secondary/80 to-secondary">
            {/* Icon Stack Wrapper */}
            <div className="absolute inset-x-0 top-[42%] flex -translate-y-1/2 items-center justify-center">
              <div className="relative h-24 w-24">
                {/* Left Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="-rotate-[14deg] -translate-x-10 -translate-y-1">
                    <img
                      alt=""
                      className="h-20 w-20 rounded-2xl bg-white object-cover shadow-xl ring-1 ring-black/5"
                      src={icons[0]}
                    />
                  </div>
                </div>

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="rotate-0 translate-y-1">
                    <img
                      alt=""
                      className="h-20 w-20 rounded-2xl bg-white object-cover shadow-xl ring-1 ring-black/5"
                      src={icons[1]}
                    />
                  </div>
                </div>

                {/* Right Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="rotate-[14deg] translate-x-10 -translate-y-1">
                    <img
                      alt=""
                      className="h-20 w-20 rounded-2xl bg-white object-cover shadow-xl ring-1 ring-black/5"
                      src={icons[2]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-5 text-center">
              <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              <span className="mt-1 text-[13px] text-muted-foreground">
                {appCount} apps
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

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
  sm: 0.5,
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
        className="relative"
        style={{
          width: BASE_WIDTH * scale,
          height: BASE_HEIGHT * scale,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
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
                  y: -15,
                  rotate: 0,
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
                    y: -10,
                    x: 40,
                    rotate: 10,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 13,
                    delay: 0,
                  }}
                >
                  {renderCard(1)}
                </motion.div>
                <motion.div
                  className="absolute"
                  animate={{
                    y: -20,
                    x: 3,
                    rotate: 2,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 13,
                    delay: 0,
                  }}
                >
                  {renderCard(2)}
                </motion.div>
                <motion.div
                  className="absolute"
                  animate={{
                    y: -22,
                    x: -40,
                    rotate: -5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 13,
                    delay: 0,
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
            animate={{ rotateX: -5 }}
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
      {/* Header Section */}
      <section className="w-full pt-24 pb-16 px-6 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
            className="text-4xl font-medium text-neutral-900 tracking-tight mb-4"
          >
            Resources
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: customEase, delay: 0.1 }}
            className="text-neutral-500 max-w-2xl"
          >
            Access study materials, cheatsheets, practice tests, and guides for
            Digital SAT prep and college applications.
          </motion.p>
        </div>
      </section>

      {/* Resources Grid Section */}
      <section className="py-16 px-6 bg-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          {/* Folders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-4">
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center group"
            >
              <Link
                href="https://drive.google.com/drive/folders/1To4VgOSligMHWE-A6M1zYmagvboKqj18?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform duration-300 group-hover:scale-105"
              >
                <Folder color="blue" size="sm" />
              </Link>
              <div className="mt-4 text-center">
                <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
                  DSAT MATH
                </h3>
                <span className="mt-1 text-[13px] text-muted-foreground">
                  Math Resources
                </span>
              </div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center group"
            >
              <Link
                href="https://drive.google.com/drive/folders/1MzQS12r3xIh5svSQZpSZcCA8RV6XGWeN?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform duration-300 group-hover:scale-105"
              >
                <Folder color="purple" size="sm" />
              </Link>
              <div className="mt-4 text-center">
                <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
                  DSAT RW
                </h3>
                <span className="mt-1 text-[13px] text-muted-foreground">
                  Reading & Writing
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center group"
            >
              <Link
                href="https://drive.google.com/drive/folders/1TXd3Ka7wgj6QmY6E1eAqEVOFwgRRS2Mk?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform duration-300 group-hover:scale-105"
              >
                <Folder color="blue" size="sm" />
              </Link>
              <div className="mt-4 text-center">
                <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
                  Application Process
                </h3>
                <span className="mt-1 text-[13px] text-muted-foreground">
                  College Applications
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
