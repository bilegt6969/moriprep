"use client";

import { MathPracticeConfigPopup } from "@/components/dsat/math-practice-config-popup";
import { RWPracticeConfigPopup } from "@/components/dsat/rw-practice-config-popup";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion";
import { useReducedMotion } from "hooks/use-reduced-motion";
import { ArrowRight, BookOpen, Calculator } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// --- Types ---
interface PracticeConfig {
  difficulties: string[];
  domains: string[];
  skills: string[];
  statusFilter?: string;
  attemptFilter?: string;
}

interface QuestionStats {
  rw: number;
  math: number;
  error: boolean;
}

// --- Design tokens (shared with the dashboard + landing page) ---
const C = {
  ink: "#1d1d1f",
  muted: "#86868b",
  blue: "#0080FF",
  green: "#10B981",
};

// --- Motion system: one easing curve, one spring ---
const ease = [0.22, 1, 0.36, 1] as const;
const spring = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.8,
} as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease },
  },
};

// --- Helpers ---
const buildPracticeUrl = (base: string, config: PracticeConfig) => {
  const params = new URLSearchParams();
  if (config.difficulties.length > 0)
    params.set("difficulties", config.difficulties.join(","));
  if (config.domains.length > 0)
    params.set("domains", config.domains.join(","));
  if (config.skills.length > 0) params.set("skills", config.skills.join(","));
  if (config.statusFilter && config.statusFilter !== "all")
    params.set("statusFilter", config.statusFilter);
  if (config.attemptFilter && config.attemptFilter !== "all")
    params.set("attemptFilter", config.attemptFilter);
  const qs = params.toString();
  return `${base}${qs ? `?${qs}` : ""}`;
};

// --- Subcomponents ---

/** Number that rolls up to its value once the data arrives. */
function CountUp({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 1.4, ease });
    return () => controls.stop();
  }, [value, reduce, mv]);

  return <motion.span className={className}>{text}</motion.span>;
}

interface PracticeCardProps {
  accent: string;
  icon: React.ReactNode;
  title: string;
  total: number;
  error: boolean;
  description: string;
  domains: string[];
  onStart: () => void;
  secondary?: { label: string; href: string };
}

function PracticeCard({
  accent,
  icon,
  title,
  total,
  error,
  description,
  domains,
  onStart,
  secondary,
}: PracticeCardProps) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  // soft light that follows the cursor across the card
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, ${accent}22, transparent 70%)`;

  return (
    <motion.article
      variants={item}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={spring}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] bg-[#f5f5f7] p-6 text-[#1d1d1f] transition-shadow duration-500 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)] md:p-8"
    >
      <motion.div
        aria-hidden="true"
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Title */}
        <div className="mb-6 flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: accent }}
          >
            {icon}
          </span>
          <h2 className="text-[24px] font-medium tracking-[-0.025em]">
            {title}
          </h2>
        </div>

        {/* Question count */}
        <div className="mb-6 flex items-end justify-between rounded-2xl bg-white px-5 py-5 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(0,0,0,0.06)]">
          <div>
            <p className="mb-2 text-[14px] font-medium tracking-[-0.01em] text-[#86868b]">
              Questions available
            </p>
            {error ? (
              <p className="text-[40px] font-medium leading-none tracking-[-0.04em] text-[#c7c7cc]">
                —
              </p>
            ) : total === null ? (
              <span className="inline-block h-[52px] w-40 animate-pulse rounded-2xl bg-black/[0.06]" />
            ) : (
              <CountUp
                value={total}
                className="text-[56px] font-medium leading-none tracking-[-0.045em] tabular-nums md:text-[64px]"
              />
            )}
          </div>
          {error && (
            <p className="max-w-[10rem] text-right text-[13px] leading-snug text-[#86868b]">
              Couldn&apos;t load the count. Practice still works.
            </p>
          )}
        </div>

        {/* Description */}
        <p
          className="mb-5 text-[16px] leading-[1.55] text-[#494440]"
          style={{ letterSpacing: "-0.01em" }}
        >
          {description}
        </p>

        {/* Domains */}
        <ul className="mb-8 flex flex-wrap gap-2">
          {domains.map((d) => (
            <li
              key={d}
              className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#1d1d1f] shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accent }}
              />
              {d}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="mt-auto flex flex-wrap items-center gap-x-1 gap-y-2">
          <motion.div
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className="relative -ml-1.5 inline-block p-1.5"
          >
            <div className="pointer-events-none absolute inset-0 rounded-full border border-gray-400/40" />
            <button
              type="button"
              onClick={onStart}
              className="group/btn relative z-10 flex h-12 items-center gap-3 rounded-[32px] border border-white/10 bg-[#171717]/80 px-6 text-[16px] font-medium leading-none tracking-[-0.01em] text-white backdrop-blur-[10px] transition-colors duration-150 hover:bg-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/50"
            >
              Start practicing
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          </motion.div>

          {secondary && (
            <motion.div
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className="inline-block"
            >
              <Link
                href={secondary.href}
                className="group/link flex h-12 items-center gap-3 rounded-full bg-white px-6 text-[15px] font-medium tracking-[-0.01em] text-[#1d1d1f] shadow-[0_0_0_1px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/40"
              >
                {secondary.label}
                <ArrowRight className="h-4 w-4 text-[#86868b] transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// --- Main component ---
export function DSATPracticeCards() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [isRWConfigPopupOpen, setIsRWConfigPopupOpen] = useState(false);
  const [isMathConfigPopupOpen, setIsMathConfigPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Static question counts
  const stats: QuestionStats = {
    rw: 1845,
    math: 150,
    error: false,
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartRWPractice = (config: PracticeConfig) =>
    router.push(buildPracticeUrl("/question-rush/rw", config));

  const handleStartMathPractice = (config: PracticeConfig) =>
    router.push(buildPracticeUrl("/question-rush/math", config));

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 py-4 font-sans antialiased sm:px-6 lg:px-10 h-full overflow-hidden">
        <motion.div
          variants={container}
          initial={reduce || !mounted ? false : "hidden"}
          animate={mounted ? "show" : false}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <motion.header variants={item} className="mb-6 md:mb-8">
            <h1 className="max-w-3xl text-[38px] font-medium leading-[1.05] tracking-[-0.035em] text-[#1d1d1f] md:text-[60px]">
              Practice, learn, review. All in one place.
            </h1>
            <p
              className="mt-4 max-w-xl font-eb-garamond text-lg text-[#86868b] md:text-xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              Pick a section, set your filters, and start with official-style
              Digital SAT questions.
            </p>
          </motion.header>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <PracticeCard
              accent={C.green}
              icon={<BookOpen className="h-5 w-5" />}
              title="Reading & Writing"
              total={stats.rw}
              error={stats.error}
              description="Master reading comprehension with adaptive questions across four domains."
              domains={[
                "Information and Ideas",
                "Craft and Structure",
                "Standard English Conventions",
                "Expression of Ideas",
              ]}
              onStart={() => setIsRWConfigPopupOpen(true)}
            />

            <PracticeCard
              accent={C.blue}
              icon={<Calculator className="h-5 w-5" />}
              title="Mathematics"
              total={stats.math}
              error={stats.error}
              description="Tackle complex math problems with advanced problem sets across five areas."
              domains={[
                "Algebra",
                "Advanced Math",
                "Geometry",
                "Statistics",
                "Data Analysis",
              ]}
              onStart={() => setIsMathConfigPopupOpen(true)}
              secondary={{
                label: "Question Bank",
                href: "/question-rush/math/question-bank",
              }}
            />
          </div>
        </motion.div>
      </section>

      <RWPracticeConfigPopup
        isOpen={isRWConfigPopupOpen}
        onClose={() => setIsRWConfigPopupOpen(false)}
        onStartPractice={handleStartRWPractice}
      />
      <MathPracticeConfigPopup
        isOpen={isMathConfigPopupOpen}
        onClose={() => setIsMathConfigPopupOpen(false)}
        onStartPractice={handleStartMathPractice}
      />
    </>
  );
}
