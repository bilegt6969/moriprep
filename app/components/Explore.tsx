"use client";

import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  DollarSign,
  Flame,
  Repeat2
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
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

function ActionRow({
  icon,
  color,
  title,
  description,
  badge,
}: {
  icon: ReactNode;
  color: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#111111] p-3.5">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[15px] font-semibold text-white" style={bodyStyle}>
            {title}
          </p>
          {badge && (
            <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-medium text-white/60">
              {badge}
            </span>
          )}
        </div>
        <p
          className="mt-0.5 text-[13px] leading-snug text-white/45"
          style={bodyStyle}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function AnimatedTimelineCard() {
  const [tick, setTick] = useState(0);

  // A precise state-engine for the waterfall animation.
  // 0: Reset, 1: Dot1, 2: Line1, 3: Dot2, 4: Line2, 5: Dot3. (6-11: hold state to read)
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 12);
    }, 400); // 400ms pace feels very natural
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
            {/* Visual Indicator Column */}
            <div className="flex flex-col items-center">
              {/* The Dot */}
              <motion.div
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                animate={{
                  backgroundColor: isDotCompleted ? COLORS.blue : "#E5E7EB",
                  scale: isDotCompleted ? [1, 1.25, 1] : 1, // Subtle satisfying tactile pop
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {/* SVG stays in DOM to prevent layout thrashing; only path draws */}
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

              {/* The Connecting Line */}
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

            {/* Text Column */}
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

const FUN_BUBBLES: { emoji: string; color: string }[] = [
  { emoji: "\u{1F3A9}", color: COLORS.purple },
  { emoji: "\u{1F419}", color: COLORS.blue },
  { emoji: "\u{1F91D}", color: COLORS.green },
  { emoji: "\u{1F60E}", color: COLORS.blue },
  { emoji: "\u{2764}\u{FE0F}\u{200D}\u{1F525}", color: COLORS.red },
  { emoji: "\u{1F60B}", color: COLORS.yellow },
  { emoji: "\u{1F98A}", color: COLORS.orange },
  { emoji: "\u{1F47D}", color: COLORS.pink },
];

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
          {/* Easy Card - Spans 2 rows */}
          <motion.div
            className="flex flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-[#fafafa] p-5 md:row-span-2 md:p-6"
            variants={itemVariants}
          >
            <div className="flex flex-col gap-2">
              <ActionRow
                icon={
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
                }
                color={COLORS.blue}
                title="Practice Bank"
                description="Official College Board DSAT questions by domain."
              />
              <ActionRow
                icon={
                  <Repeat2 className="h-4 w-4 text-white" strokeWidth={2.5} />
                }
                color={COLORS.gray}
                title="Smart Review"
                description="Target missed questions with adaptive review loops."
              />
              <ActionRow
                icon={
                  <ArrowDownToLine
                    className="h-4 w-4 text-white"
                    strokeWidth={2.5}
                  />
                }
                color={COLORS.green}
                title="Free Resources"
                description="Download prep books, cheat sheets, and strategy guides."
              />
              <ActionRow
                icon={
                  <DollarSign
                    className="h-4 w-4 text-white"
                    strokeWidth={2.5}
                  />
                }
                color={COLORS.pink}
                title="100% Open"
                badge="Free"
                description="Zero paywalls or subscriptions—powered by Bytecode."
              />
            </div>
            <CardFooter
              title="All-In-One"
              description="Everything you need for a 1500+ score in one dashboard."
            />
          </motion.div>

          {/* Secure Card */}
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

          {/* College Board Aligned Card - Now Smoothed Out */}
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

          {/* Powerful Card */}
          <motion.div
            className="flex flex-col justify-between gap-5 rounded-3xl bg-[#fafafa] p-5 md:p-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <span
                className="text-lg font-semibold"
                style={{ color: COLORS.heading, ...bodyStyle }}
              >
                Sessions
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-sm font-medium text-gray-500"
                  style={bodyStyle}
                >
                  ~ 23 days
                </span>
                <Flame
                  className="h-5 w-5"
                  style={{ color: COLORS.orange }}
                  fill={COLORS.orange}
                />
              </div>
            </div>
            <CardFooter
              title="Reward system"
              description="Pinpoint weak spots in specific math concepts or grammar rules instantly."
            />
          </motion.div>

          {/* Fun Card */}
          <motion.div
            className="flex flex-col justify-between gap-5 rounded-3xl bg-[#fafafa] p-5 md:p-6"
            variants={itemVariants}
          >
            <div className="flex items-center overflow-hidden">
              {FUN_BUBBLES.map((bubble, index) => (
                <div
                  key={index}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl ring-4 ring-[#fafafa]"
                  style={{
                    backgroundColor: bubble.color,
                    marginLeft: index === 0 ? 0 : -16,
                  }}
                >
                  {bubble.emoji}
                </div>
              ))}
            </div>
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
