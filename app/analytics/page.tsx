"use client";

import LineChart from "@/components/arc/line-chart/line-chart";
import SlopeChart from "@/components/arc/slope-chart/slope-chart";
import WaffleChart from "@/components/arc/waffle-chart/waffle-chart";
import { auth } from "@/lib/firebase";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// =========================================================
// Types
// =========================================================
interface DomainStat {
  domain: string;
  type?: string;
  accuracy: number;
  total: number;
  share: number;
  avgTime?: string;
  correctAvgTime?: string;
}

interface SkillStat {
  skill: string;
  total: number;
  accuracy: number;
  avgTime: string;
  correctAvgTime: string;
}

interface AnalyticsData {
  userData?: { name: string };
  totalQuestions: number;
  accuracy: number;
  totalPracticeTime: number;
  streak: number;
  weeklyQuestions: number;
  dailyGoal: number;
  dailyActivity: { date: string; count: number }[];
  domainStats: DomainStat[];
  detailedStats: {
    domains: DomainStat[];
    skillsByDomain: Record<string, SkillStat[]>;
  };
}

type DomainFilter = "all" | "math" | "rw";

// =========================================================
// Custom Hooks
// =========================================================
function useAnalytics() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (uid: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/analytics?userId=${uid}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      const result: AnalyticsData = await response.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/sign-in");
      } else {
        fetchData(user.uid);
      }
    });
    return () => unsubscribe?.();
  }, [router, fetchData]);

  return {
    data,
    isLoading,
    error,
    retry: () => auth?.currentUser && fetchData(auth.currentUser.uid),
  };
}

// =========================================================
// Design tokens + motion system (shared with dashboard)
// =========================================================
const C = {
  ink: "#1d1d1f",
  muted: "#86868b",
  blue: "#0080FF",
  green: "#10B981",
  orange: "#F97316",
  red: "#EF4444",
};

const accuracyColor = (a: number) =>
  a >= 80 ? C.green : a >= 60 ? C.orange : C.red;

const ease = [0.22, 1, 0.36, 1] as const;
const spring = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.8,
} as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
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

const swap = {
  initial: { opacity: 0, y: 6, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -6, filter: "blur(4px)" },
  transition: { duration: 0.28, ease },
} as const;

// =========================================================
// Domain filtering
// =========================================================
const MATH_DOMAIN =
  /math|algebra|geometry|trigonometry|statistic|data analysis|problem-solving/i;

const isMathDomain = (domain: string, type?: string) =>
  /math/i.test(type ?? "") || MATH_DOMAIN.test(domain);

const matchesFilter = (filter: DomainFilter, domain: string, type?: string) =>
  filter === "all" ||
  (filter === "math"
    ? isMathDomain(domain, type)
    : !isMathDomain(domain, type));

// =========================================================
// Icons
// =========================================================
const EyeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 4.5 9 7-0 .77-.9 1.98-2.36 3.16M6.6 6.6C4.4 7.9 3 9.8 3 12c0 2.5 4 7 9 7 1.13 0 2.2-.22 3.18-.6" />
  </svg>
);

const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const FlameIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-[18px] w-[18px]"
    aria-hidden="true"
  >
    <path d="M12.75 2.25c.35 3.1-1.02 5.1-2.6 6.83-1.6 1.75-3.4 3.9-3.4 7.17a5.25 5.25 0 0010.5 0c0-1.9-.72-3-1.35-3.9-.2 1.55-1 2.5-1.9 2.5-1.15 0-1.7-.95-1.5-2.15.35-2 2.35-3.35 2.35-6.3 0-1.5-.6-2.85-2.1-4.15z" />
  </svg>
);

const TargetIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[18px] w-[18px]"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// Plus that rotates into a minus (same device as the landing FAQ)
const PlusIcon = ({ open }: { open: boolean }) => (
  <span className="relative block h-[14px] w-[14px]" aria-hidden="true">
    <span className="absolute left-0 top-[6px] h-[2px] w-[14px] rounded-sm bg-current" />
    <span
      className={`absolute left-[6px] top-0 h-[14px] w-[2px] rounded-sm bg-current transition-transform duration-300 ease-out ${
        open ? "rotate-90" : "rotate-0"
      }`}
    />
  </span>
);

// =========================================================
// Reusable components
// =========================================================
const Card = ({
  children,
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) => (
  <motion.div
    variants={item}
    className={`relative overflow-hidden rounded-[28px] p-6 md:p-7 ${
      dark ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"
    } ${className}`}
  >
    {children}
  </motion.div>
);

const Label = ({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <p
    className={`text-[14px] font-medium tracking-[-0.01em] ${
      dark ? "text-white/50" : "text-[#86868b]"
    }`}
  >
    {children}
  </p>
);

const SectionHeader = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
    <h2 className="text-[22px] font-medium tracking-[-0.02em]">{title}</h2>
    {hint && <p className="text-[14px] text-[#86868b]">{hint}</p>}
  </div>
);

/** White working surface inside a card */
const Surface = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(0,0,0,0.06)] ${className}`}
  >
    {children}
  </div>
);

function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(
    mv,
    (v) => `${Math.round(v).toLocaleString()}${suffix}`,
  );

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 1.3, ease });
    return () => controls.stop();
  }, [value, reduce, mv]);

  return <motion.span className={className}>{text}</motion.span>;
}

function Segmented<T extends string>({
  id,
  options,
  value,
  onChange,
}: {
  id: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-black/[0.05] p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={`relative h-9 rounded-full px-4 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/40 ${
              active ? "text-[#1d1d1f]" : "text-[#86868b] hover:text-[#1d1d1f]"
            }`}
          >
            {active && (
              <motion.span
                layoutId={id}
                transition={spring}
                className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]"
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const IconButton = ({
  label,
  onClick,
  children,
  dark = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <motion.button
    type="button"
    aria-label={label}
    onClick={onClick}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.9 }}
    transition={spring}
    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DA3FF] ${
      dark
        ? "bg-white/10 text-white/70 hover:bg-white/20"
        : "bg-black/[0.05] text-[#6e6e73] hover:bg-black/[0.09]"
    }`}
  >
    {children}
  </motion.button>
);

const DarkPill = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <motion.div
    whileHover={{ scale: 1.025 }}
    whileTap={{ scale: 0.97 }}
    transition={spring}
    className="relative inline-block p-1.5"
  >
    <div className="pointer-events-none absolute inset-0 rounded-full border border-gray-400/40" />
    <Link
      href={href}
      className="relative z-10 flex h-12 items-center justify-center gap-3 rounded-[32px] border border-white/10 bg-[#171717]/80 px-6 text-[16px] font-medium leading-none tracking-[-0.01em] text-white backdrop-blur-[10px] transition-colors duration-150 hover:bg-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/50"
    >
      {children}
    </Link>
  </motion.div>
);

const Collapse = ({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) => (
  <div
    className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
    }`}
  >
    <div className="overflow-hidden">{children}</div>
  </div>
);

/** Column header + rows share one grid template so columns line up. */
const GRID5 = "minmax(0,2fr) repeat(4,minmax(0,1fr))";

const TableHead = ({ cols }: { cols: string[] }) => (
  <div
    className="grid gap-4 border-b-2 border-[#f2f0ed] px-5 pb-3 pt-4 text-[13px] font-medium text-[#86868b]"
    style={{ gridTemplateColumns: GRID5 }}
  >
    {cols.map((c) => (
      <span key={c}>{c}</span>
    ))}
  </div>
);

const AccuracyCell = ({ value }: { value: number }) => (
  <span className="flex items-center gap-2 font-medium tabular-nums">
    <span
      className="h-1.5 w-1.5 rounded-full"
      style={{ backgroundColor: accuracyColor(value) }}
    />
    {value}%
  </span>
);

// =========================================================
// Main page
// =========================================================
export default function AnalyticsPage() {
  const reduce = useReducedMotion();
  const { data: analyticsData, isLoading, error, retry } = useAnalytics();

  const [hideScore, setHideScore] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainFilter>("all");
  const [activeFocusPoint, setActiveFocusPoint] = useState<number | null>(null);
  const [openSkillDomains, setOpenSkillDomains] = useState<
    Record<string, boolean>
  >({});

  const focusTimeData = useMemo(() => {
    if (!analyticsData) return [];
    return analyticsData.dailyActivity.map((d) => {
      const date = new Date(d.date);
      return {
        key: d.date,
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        axisLabel: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        values: { questions: d.count },
      };
    });
  }, [analyticsData]);

  // Domain filter drives the domain-based sections
  const filteredDomainStats = useMemo(
    () =>
      (analyticsData?.domainStats ?? []).filter((s) =>
        matchesFilter(selectedDomain, s.domain, s.type),
      ),
    [analyticsData, selectedDomain],
  );

  const filteredDetailedDomains = useMemo(
    () =>
      (analyticsData?.detailedStats.domains ?? []).filter((s) =>
        matchesFilter(
          selectedDomain,
          s.domain,
          s.type ??
            analyticsData?.domainStats.find((d) => d.domain === s.domain)?.type,
        ),
      ),
    [analyticsData, selectedDomain],
  );

  const filteredSkills = useMemo(() => {
    if (!analyticsData) return [];
    return Object.entries(
      analyticsData.detailedStats.skillsByDomain || {},
    ).filter(
      ([domain, skills]) =>
        Array.isArray(skills) &&
        skills.length > 0 &&
        matchesFilter(
          selectedDomain,
          domain,
          analyticsData.domainStats.find((d) => d.domain === domain)?.type,
        ),
    );
  }, [analyticsData, selectedDomain]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-4 pb-24 pt-28 font-sans md:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-10 space-y-4">
            <div className="h-14 w-full max-w-md animate-pulse rounded-2xl bg-[#f5f5f7]" />
            <div className="h-5 w-60 animate-pulse rounded-full bg-[#f5f5f7]" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <div className="h-44 animate-pulse rounded-[28px] bg-[#ececf0]" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-[28px] bg-[#f5f5f7]"
              />
            ))}
          </div>
          <div className="mt-3 h-80 animate-pulse rounded-[28px] bg-[#f5f5f7] md:mt-4" />
        </div>
      </main>
    );
  }

  if (error || !analyticsData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 font-sans">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-center text-center"
        >
          <h1 className="mb-2 text-[28px] font-medium tracking-tighter text-[#1d1d1f]">
            We couldn&apos;t load your analytics
          </h1>
          <p className="mb-6 max-w-sm text-[15px] text-[#86868b]">
            {error || "Data unavailable"} Check your connection and try again.
          </p>
          <motion.button
            type="button"
            onClick={retry}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className="h-11 rounded-full bg-[#1d1d1f] px-6 text-[14px] font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/50"
          >
            Try again
          </motion.button>
        </motion.div>
      </main>
    );
  }

  const userName = analyticsData.userData?.name?.split(" ")[0] || "Student";
  const weeklyGoal = analyticsData.dailyGoal * 7;
  const weeklyPct =
    weeklyGoal > 0
      ? Math.min(100, (analyticsData.weeklyQuestions / weeklyGoal) * 100)
      : 0;
  const activeDay =
    activeFocusPoint !== null ? focusTimeData[activeFocusPoint] : undefined;

  return (
    <main className="min-h-screen bg-white font-sans antialiased selection:bg-gray-200 selection:text-black">
      <motion.div
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="mx-auto w-full max-w-5xl px-4 pb-24 pt-28 md:px-6 md:pt-32 lg:px-10"
      >
        {/* ---------- Header ---------- */}
        <motion.header variants={item} className="mb-10 md:mb-12">
          <h1 className="max-w-3xl text-[42px] font-medium leading-[1.05] tracking-[-0.035em] text-[#1d1d1f] md:text-[64px]">
            Welcome back, {userName}.
          </h1>
          <p
            className="mt-4 max-w-xl font-eb-garamond text-lg text-[#86868b] md:text-xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            You&apos;ve answered {analyticsData.totalQuestions.toLocaleString()}{" "}
            questions so far.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <Segmented<DomainFilter>
              id="domain-filter"
              value={selectedDomain}
              onChange={setSelectedDomain}
              options={[
                { value: "all", label: "All" },
                { value: "math", label: "Math" },
                { value: "rw", label: "Reading & Writing" },
              ]}
            />
            <div className="-mr-1.5">
              <DarkPill href="/question-rush">New session</DarkPill>
            </div>
          </div>
        </motion.header>

        {/* ---------- Stat tiles ---------- */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <Card dark className="col-span-2 md:col-span-1">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#0080FF]/25 blur-3xl" />
            <div className="relative z-10 flex h-full min-h-[148px] flex-col justify-between">
              <div className="flex items-start justify-between">
                <Label dark>Total accuracy</Label>
                <IconButton
                  dark
                  label={hideScore ? "Show stats" : "Hide stats"}
                  onClick={() => setHideScore((v) => !v)}
                >
                  {hideScore ? <EyeIcon /> : <EyeOffIcon />}
                </IconButton>
              </div>
              <div className="text-[56px] font-medium leading-none tracking-[-0.045em]">
                {hideScore ? (
                  "••••"
                ) : (
                  <CountUp value={analyticsData.accuracy} suffix="%" />
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex h-full min-h-[148px] flex-col justify-between">
              <Label>Questions answered</Label>
              <div className="text-[44px] font-medium leading-none tracking-[-0.04em]">
                {hideScore ? (
                  "••••"
                ) : (
                  <CountUp value={analyticsData.totalQuestions} />
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex h-full min-h-[148px] flex-col justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: C.orange }}
                >
                  <FlameIcon />
                </span>
                <Label>Streak</Label>
              </div>
              <div className="flex items-baseline gap-2">
                <CountUp
                  value={analyticsData.streak}
                  className="text-[44px] font-medium leading-none tracking-[-0.04em]"
                />
                <span className="text-[15px] text-[#86868b]">
                  {analyticsData.streak === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="col-span-2 md:col-span-1">
            <div className="flex h-full min-h-[148px] flex-col justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: C.blue }}
                >
                  <TargetIcon />
                </span>
                <Label>Weekly progress</Label>
              </div>
              <div>
                <div className="mb-3 flex items-baseline gap-1.5">
                  <CountUp
                    value={analyticsData.weeklyQuestions}
                    className="text-[44px] font-medium leading-none tracking-[-0.04em]"
                  />
                  <span className="text-[15px] text-[#86868b]">
                    / {weeklyGoal}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: C.blue }}
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: `${weeklyPct}%` }}
                    transition={{ duration: 1.2, ease, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-3 space-y-3 md:mt-4 md:space-y-4">
          {/* ---------- Performance distribution ---------- */}
          <Card>
            <SectionHeader
              title="Performance distribution"
              hint="Where your practice goes, and how it's going"
            />

            <Surface className="mb-3 p-4 md:p-5">
              <WaffleChart
                data={filteredDomainStats.map((stat) => ({
                  key: stat.domain,
                  label: stat.domain,
                  value: stat.total,
                }))}
                label="Questions by domain"
                unit="questions"
                decimals={0}
              />
            </Surface>

            <Surface>
              {filteredDomainStats.length > 0 ? (
                <ul className="divide-y-2 divide-[#f2f0ed]">
                  <AnimatePresence initial={false} mode="popLayout">
                    {filteredDomainStats.map((row, i) => (
                      <motion.li
                        key={row.domain}
                        layout
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4, ease }}
                        className="px-5 py-4"
                      >
                        <div className="mb-2.5 flex items-end justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-[16px] font-medium tracking-[-0.01em]">
                              {row.domain}
                            </p>
                            <p className="mt-0.5 text-[13px] text-[#86868b]">
                              {row.type || "Mixed"},{" "}
                              {row.total.toLocaleString()} questions,{" "}
                              {row.share.toFixed(1)}% of practice
                            </p>
                          </div>
                          <span
                            className="text-[22px] font-medium tabular-nums tracking-tight"
                            style={{ color: accuracyColor(row.accuracy) }}
                          >
                            {row.accuracy}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: accuracyColor(row.accuracy),
                            }}
                            initial={reduce ? false : { width: 0 }}
                            animate={{ width: `${Math.max(2, row.accuracy)}%` }}
                            transition={{
                              duration: 1.1,
                              ease,
                              delay: 0.1 + i * 0.06,
                            }}
                          />
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              ) : (
                <p className="px-5 py-10 text-center text-[15px] text-[#86868b]">
                  No questions in this section yet.
                </p>
              )}
            </Surface>
          </Card>

          {/* ---------- Performance change ---------- */}
          <Card>
            <SectionHeader
              title="Performance change"
              hint="Accuracy by domain, last week to this week"
            />
            <Surface className="p-4 md:p-5">
              <SlopeChart
                data={filteredDomainStats.map((stat) => ({
                  key: stat.domain,
                  label: stat.domain,
                  start: Math.max(0, stat.accuracy - 5), // Simulated previous week
                  end: stat.accuracy,
                }))}
                label="Accuracy change by domain"
                startLabel="Last Week"
                endLabel="This Week"
                formatValue={(value: number) => `${value.toFixed(0)}%`}
                formatChange={(change: number) =>
                  `${change > 0 ? "+" : ""}${change.toFixed(0)}%`
                }
                ranks={true}
              />
            </Surface>
          </Card>

          {/* ---------- Focus & activity ---------- */}
          <Card>
            <SectionHeader
              title="Focus & activity"
              hint="Hover the chart to read a day"
            />
            <Surface className="p-5 md:p-6">
              <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-[56px] font-medium leading-none tracking-[-0.04em] tabular-nums">
                  {activeDay
                    ? (activeDay.values.questions ??
                      analyticsData.totalPracticeTime)
                    : analyticsData.totalPracticeTime}
                </p>
                <span className="text-[15px] text-[#86868b]">questions</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={activeDay ? activeDay.key : "total"}
                    {...swap}
                    className="text-[14px] text-[#86868b]"
                  >
                    {activeDay ? activeDay.label : "Total answered"}
                  </motion.p>
                </AnimatePresence>
              </div>

              <LineChart
                label="Focus time"
                data={focusTimeData}
                series={[
                  {
                    key: "questions",
                    label: "Questions answered",
                    color: C.blue,
                  },
                ]}
                height={200}
                onActiveChange={setActiveFocusPoint}
                curve="smooth"
              />
            </Surface>
          </Card>

          {/* ---------- Detailed analytics ---------- */}
          <Card>
            <SectionHeader
              title="Detailed analytics"
              hint="Accuracy and timing, domain by domain"
            />

            <h3 className="mb-3 text-[15px] font-medium tracking-[-0.01em]">
              By domain
            </h3>
            <Surface className="mb-8 overflow-x-auto">
              <div className="min-w-[560px]">
                {filteredDetailedDomains.length > 0 ? (
                  <>
                    <TableHead
                      cols={[
                        "Domain",
                        "Total",
                        "Accuracy",
                        "Avg time",
                        "Correct avg",
                      ]}
                    />
                    <ul className="divide-y-2 divide-[#f2f0ed]">
                      {filteredDetailedDomains.map((row) => (
                        <li
                          key={row.domain}
                          className="grid items-center gap-4 px-5 py-3.5 text-[14px] transition-colors hover:bg-[#fafafa]"
                          style={{ gridTemplateColumns: GRID5 }}
                        >
                          <span
                            className="truncate font-medium"
                            title={row.domain}
                          >
                            {row.domain}
                          </span>
                          <span className="tabular-nums text-[#86868b]">
                            {row.total}
                          </span>
                          <AccuracyCell value={row.accuracy} />
                          <span className="tabular-nums text-[#86868b]">
                            {row.avgTime || "—"}
                          </span>
                          <span className="tabular-nums text-[#86868b]">
                            {row.correctAvgTime || "—"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="px-5 py-10 text-center text-[14px] text-[#86868b]">
                    No domain data available yet.
                  </p>
                )}
              </div>
            </Surface>

            <h3 className="mb-3 text-[15px] font-medium tracking-[-0.01em]">
              Skills breakdown
            </h3>
            {filteredSkills.length > 0 ? (
              <div className="space-y-2.5">
                {filteredSkills.map(([domain, skills], idx) => {
                  // first domain starts open, the rest start closed
                  const open = openSkillDomains[domain] ?? idx === 0;
                  return (
                    <Surface key={domain}>
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() =>
                          setOpenSkillDomains((prev) => ({
                            ...prev,
                            [domain]: !open,
                          }))
                        }
                        className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-colors hover:text-[#747484] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/40"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[16px] font-medium tracking-[-0.01em]">
                            {domain}
                          </span>
                          <span className="mt-0.5 block text-[13px] text-[#86868b]">
                            {skills.length}{" "}
                            {skills.length === 1 ? "skill" : "skills"}
                          </span>
                        </span>
                        <PlusIcon open={open} />
                      </button>

                      <Collapse open={open}>
                        <div className="overflow-x-auto border-t-2 border-[#f2f0ed]">
                          <div className="min-w-[560px]">
                            <TableHead
                              cols={[
                                "Skill",
                                "Total",
                                "Accuracy",
                                "Avg time",
                                "Correct avg",
                              ]}
                            />
                            <ul className="divide-y-2 divide-[#f2f0ed]">
                              {skills.map((row) => (
                                <li
                                  key={row.skill}
                                  className="grid items-center gap-4 px-5 py-3 text-[14px] transition-colors hover:bg-[#fafafa]"
                                  style={{ gridTemplateColumns: GRID5 }}
                                >
                                  <span
                                    className="truncate font-medium"
                                    title={row.skill}
                                  >
                                    {row.skill}
                                  </span>
                                  <span className="tabular-nums text-[#86868b]">
                                    {row.total}
                                  </span>
                                  <AccuracyCell value={row.accuracy} />
                                  <span className="tabular-nums text-[#86868b]">
                                    {row.avgTime}
                                  </span>
                                  <span className="tabular-nums text-[#86868b]">
                                    {row.correctAvgTime}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Collapse>
                    </Surface>
                  );
                })}
              </div>
            ) : (
              <Surface className="px-5 py-10 text-center text-[14px] text-[#86868b]">
                No skill data available yet.
              </Surface>
            )}
          </Card>
        </div>
      </motion.div>
    </main>
  );
}
