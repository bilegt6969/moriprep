"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowDownToLine, DollarSign, Flame, Repeat2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BackupButton from "../../components/BackupButton";

const COLORS = {
  blue: "#018DFF",
  gray: "#747484",
  green: "#34C759",
  pink: "#F966AC",
  purple: "#9553F9",
  yellow: "#FFBE4C",
  orange: "#FF5310",
  red: "#EF4444",
  heading: "#343433",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const headingStyle = { color: COLORS.heading, letterSpacing: "-0.02em" };
const bodyStyle = { letterSpacing: "-0.01em" };

function CardFooter({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-xl font-medium" style={headingStyle}>
        {title}
      </h3>
      <p
        className="mt-1.5 text-[15px] leading-snug text-gray-600"
        style={bodyStyle}
      >
        {description}
      </p>
    </div>
  );
}

// -----------------------------------------------------
// Animated Features List (All-In-One Card)
// -----------------------------------------------------
const FEATURES_DATA = [
  {
    id: "practice",
    title: "Practice Bank",
    description: "Official College Board DSAT questions by domain.",
    color: COLORS.blue,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        className="h-4 w-4 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12h14M12 5l7 7-7 7"
        />
      </svg>
    ),
    hoverAnim: { x: 5, scale: 1.15 },
  },
  {
    id: "review",
    title: "Smart Review",
    description: "Target missed questions with adaptive review loops.",
    color: COLORS.gray,
    icon: <Repeat2 className="h-4 w-4 text-white" strokeWidth={2.5} />,
    hoverAnim: { rotate: 180, scale: 1.15 },
  },
  {
    id: "resources",
    title: "Free Resources",
    description: "Download prep books, cheat sheets, and strategy guides.",
    color: COLORS.green,
    icon: <ArrowDownToLine className="h-4 w-4 text-white" strokeWidth={2.5} />,
    hoverAnim: { scale: 1.15 },
  },
  {
    id: "open",
    title: "100% Open",
    badge: "Free",
    description: "Zero paywalls or subscriptions—powered by Bytecode.",
    color: COLORS.pink,
    icon: <DollarSign className="h-4 w-4 text-white" strokeWidth={2.5} />,
    hoverAnim: { rotateY: 180, scale: 1.15 },
  },
];

function AnimatedFeaturesCard() {
  return (
    <div className="flex flex-col gap-2">
      {FEATURES_DATA.map((feature, index) => (
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1 + 0.2,
            ease: "easeOut",
          }}
          whileHover="hover"
          whileTap="tap"
          className="group flex cursor-pointer items-start gap-3 rounded-2xl bg-[#111111] p-3.5 transition-colors hover:bg-[#1a1a1a]"
        >
          <motion.div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: feature.color }}
            variants={{
              hover: feature.hoverAnim,
              tap: { scale: 0.9 },
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
          >
            {feature.icon}
          </motion.div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p
                className="text-[15px] font-semibold text-white transition-colors group-hover:text-gray-200"
                style={bodyStyle}
              >
                {feature.title}
              </p>
              {feature.badge && (
                <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-medium text-white/60">
                  {feature.badge}
                </span>
              )}
            </div>
            <p
              className="mt-0.5 text-[13px] leading-snug text-white/45 transition-colors group-hover:text-white/60"
              style={bodyStyle}
            >
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AnimatedTimelineCard() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 12);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      label: "Reading & Writing",
      date: "",
      time: "1669 questions",
      dotTick: 1,
      lineTick: 2,
    },
    {
      label: "Math Domains",
      date: "Desmos",
      time: "2890 questions",
      dotTick: 3,
      lineTick: 4,
    },
    {
      label: "Bluebook UI",
      date: "Aug 11 2026",
      time: "14:42",
      dotTick: 5,
      lineTick: 99,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const isDotCompleted = tick >= step.dotTick;
        const isLineCompleted = tick >= step.lineTick;

        return (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <motion.div
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                animate={{
                  backgroundColor: isDotCompleted ? COLORS.blue : "#E5E7EB",
                  scale: isDotCompleted ? 1.25 : 1, // Fixed: single target for spring compatibility
                }}
                transition={{
                  duration: 0.35,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <motion.svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-2.5 w-2.5 text-white"
                >
                  <motion.path
                    d="M4.5 12.5L9 17L19.5 6.5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: isDotCompleted ? 1 : 0,
                      opacity: isDotCompleted ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                  />
                </motion.svg>
              </motion.div>

              {!isLast && (
                <div className="relative my-1 w-[2px] flex-1 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    className="absolute inset-0 w-full origin-top"
                    style={{ backgroundColor: COLORS.blue }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isLineCompleted ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>

            <div
              className={`flex flex-1 items-center justify-between ${isLast ? "" : "pb-4"}`}
            >
              <motion.span
                className="text-[15px] font-semibold"
                animate={{ color: isDotCompleted ? COLORS.blue : "#9CA3AF" }}
                transition={{ duration: 0.35 }}
                style={bodyStyle}
              >
                {step.label}
              </motion.span>
              <motion.span
                className="text-xs"
                animate={{ color: isDotCompleted ? "#9CA3AF" : "#D1D5DB" }}
                transition={{ duration: 0.35 }}
                style={bodyStyle}
              >
                {step.date ? `${step.date} · ` : ""}
                {step.time}
              </motion.span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AnimatedSessionsCard() {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const controls = animate(count, 23, {
      type: "tween",
      duration: 3.5,
      ease: [0.25, 1, 0.5, 1],
      onComplete: () => setIsDone(true),
    });
    return controls.stop;
  }, [count]);

  return (
    <div className="relative flex items-center justify-between overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-orange-50/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDone ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      />

      <span
        className="relative z-10 text-lg font-semibold"
        style={{ color: COLORS.heading, ...bodyStyle }}
      >
        Sessions
      </span>

      <div className="relative z-10 flex items-center gap-1.5">
        <span
          className="flex items-center gap-1 text-sm font-medium text-gray-500"
          style={bodyStyle}
        >
          ~{" "}
          <motion.span
            className="inline-block min-w-[1.15rem] text-center font-bold"
            animate={
              isDone
                ? { scale: 1.2, color: COLORS.orange }
                : { color: "#6B7280", scale: 1 }
            }
            transition={{ duration: 0.4, type: "spring", stiffness: 400 }}
          >
            {rounded}
          </motion.span>{" "}
          days
        </span>

        <div className="relative flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-orange-400 blur-md"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: isDone ? [0.15, 0.35, 0.15] : 0,
              scale: isDone ? [1, 1.4, 1] : 0.5,
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, -2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10 origin-bottom"
          >
            <Flame
              className="h-5 w-5 drop-shadow-sm"
              style={{ color: COLORS.orange }}
              fill={COLORS.orange}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const ALL_FUN_BUBBLES: { emoji: string; color: string }[] = [
  { emoji: "🎩", color: COLORS.purple },
  { emoji: "🐙", color: COLORS.blue },
  { emoji: "🤝", color: COLORS.green },
  { emoji: "😎", color: COLORS.blue },
  { emoji: "❤️‍🔥", color: COLORS.red },
  { emoji: "😋", color: COLORS.yellow },
  { emoji: "🦊", color: COLORS.orange },
  { emoji: "👽", color: COLORS.pink },
];

function AnimatedFunCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(ALL_FUN_BUBBLES.length);

  useEffect(() => {
    const calculateVisibleBubbles = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      // Math breakdown:
      // First bubble = 56px (w-14)
      // Remaining space = containerWidth - 56px
      // Each additional bubble takes 40px (56px width - 16px negative margin)
      if (containerWidth < 56) {
        setVisibleCount(1);
        return;
      }

      const additionalBubbles = Math.floor((containerWidth - 56) / 40);
      const maxBubbles = 1 + additionalBubbles;

      // Clamp the number between 1 and the total available emojis
      setVisibleCount(
        Math.max(1, Math.min(maxBubbles, ALL_FUN_BUBBLES.length)),
      );
    };

    // Run calculation on mount
    calculateVisibleBubbles();

    // Attach ResizeObserver to dynamically adjust on window/container resize
    const observer = new ResizeObserver(() => {
      calculateVisibleBubbles();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Slice the array based on the dynamic calculation
  const visibleBubbles = ALL_FUN_BUBBLES.slice(0, visibleCount);

  return (
    <div
      ref={containerRef}
      className="flex items-center overflow-visible py-2 w-full"
    >
      {visibleBubbles.map((bubble, index) => (
        <motion.div
          key={bubble.emoji} // Better to use a unique property than array index
          drag
          dragSnapToOrigin
          dragElastic={0.2}
          whileHover={{
            scale: 1.15,
            zIndex: 40,
            rotate: index % 2 === 0 ? 10 : -10,
            transition: { type: "spring", stiffness: 400, damping: 10 },
          }}
          whileTap={{ scale: 0.9, cursor: "grabbing" }}
          initial={{ opacity: 0, scale: 0, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 20,
            delay: index * 0.05 + 0.3,
          }}
          // Notice we removed the "hidden md:flex" and "md:hidden" logic entirely
          className="relative flex h-14 w-14 shrink-0 select-none cursor-grab items-center justify-center rounded-full text-2xl shadow-sm ring-4 ring-[#fafafa]"
          style={{
            backgroundColor: bubble.color,
            marginLeft: index === 0 ? 0 : -16,
            zIndex: visibleBubbles.length - index,
          }}
        >
          {bubble.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export function Explore() {
  return (
    <section className="px-4 py-16 md:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.h1
          className="mb-8 text-center text-[2.5rem] font-medium leading-[1.05] tracking-tighter md:text-[3.25rem]"
          style={headingStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          DSAT prep made easier
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-[#fafafa] p-5 md:row-span-2 md:p-6"
            variants={itemVariants}
          >
            <AnimatedFeaturesCard />
            <CardFooter
              title="All-In-One"
              description="Everything you need for a 1500+ score in one dashboard."
            />
          </motion.div>

          <motion.div
            className="flex flex-col justify-between gap-5 rounded-3xl bg-[#fafafa] p-5 md:p-6"
            variants={itemVariants}
          >
            <div className="flex h-28 items-center justify-center rounded-2xl bg-[#eaf8ee]">
              <BackupButton />
            </div>
            <CardFooter
              title="Non-Profit"
              description="Powered by bytecode. Built by students, for students"
            />
          </motion.div>

          <motion.div
            className="flex flex-col justify-between gap-5 rounded-3xl bg-[#fafafa] p-5 md:p-6"
            variants={itemVariants}
          >
            <AnimatedTimelineCard />
            <CardFooter
              title="College Board Aligned"
              description="Real exam difficulty, adaptive structure, and domain breakdowns."
            />
          </motion.div>

          <motion.div
            className="flex flex-col justify-between gap-5 rounded-3xl bg-[#fafafa] p-5 md:p-6"
            variants={itemVariants}
          >
            <AnimatedSessionsCard />
            <CardFooter
              title="Reward system"
              description="Pinpoint weak spots in specific math concepts or grammar rules instantly."
            />
          </motion.div>

          <motion.div
            className="flex flex-col justify-between gap-5 rounded-3xl bg-[#fafafa] p-5 md:p-6"
            variants={itemVariants}
          >
            <AnimatedFunCard />
            <CardFooter
              title="Fun"
              description="bytecode family takes fun seriously. Delightful interactions with every tap."
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
