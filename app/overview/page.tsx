"use client";

import { auth, db } from "@/lib/firebase";
import type { Auth } from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
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
import React, { useCallback, useEffect, useId, useMemo, useState } from "react";

// --- Types ---
interface UserData {
  name?: string;
  email?: string;
  satTestDates?: string[];
  bestTotalScore?: number;
  bestRwScore?: number;
  bestMathScore?: number;
  dailyGoal?: number;
}

interface UserAnswer {
  id: string;
  userId: string;
  domain?: string;
  category?: string;
  isCorrect: boolean;
  timestamp?: string | number | Date;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface DomainStat {
  domain: string;
  type: "Math" | "Reading & Writing";
  accuracy: number;
  share: number;
  total: number;
}

interface StudyPlanItem {
  title: string;
  duration: string;
  type: string;
}

type Range = "7" | "30";

// --- Design tokens ---
// Apple-clean neutrals + Mori Prep accents from the landing page.
// ink #1d1d1f · muted #86868b · surface #f5f5f7 · hairline black/5
// accents: blue #0080FF · green #10B981 · orange #F97316 · pink #F966AC
const C = {
  ink: "#1d1d1f",
  muted: "#86868b",
  blue: "#0080FF",
  green: "#10B981",
  orange: "#F97316",
  pink: "#F966AC",
  red: "#EF4444",
};

const accuracyColor = (a: number) =>
  a >= 80 ? C.green : a >= 60 ? C.orange : C.red;

// --- Motion system ---
// One easing curve and one spring for the whole page so every movement feels related.
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

// Cross-fade used when a value swaps into its inline editor and back
const swap = {
  initial: { opacity: 0, y: 6, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -6, filter: "blur(4px)" },
  transition: { duration: 0.28, ease },
} as const;

// --- Icons ---
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

const PencilIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
    aria-hidden="true"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
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

const ArrowRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-[18px] w-[18px]"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Subcomponents ---

/** Bento tile. Participates in the page's staggered entrance via `item`. */
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

/** Number that rolls to its new value whenever the data changes. */
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

/** Progress ring that draws itself in. */
function Ring({
  progress,
  size = 176,
  stroke = 14,
}: {
  progress: number;
  size?: number;
  stroke?: number;
}) {
  const reduce = useReducedMotion();
  const id = useId();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4DA3FF" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={reduce ? false : { strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - clamped) }}
        transition={{ duration: 1.6, ease, delay: 0.35 }}
      />
    </svg>
  );
}

/** Pill segmented control with a sliding highlight. */
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
            className={`relative h-8 rounded-full px-4 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/40 ${
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
    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/40 ${
      dark
        ? "bg-white/10 text-white/70 hover:bg-white/20"
        : "bg-black/[0.05] text-[#6e6e73] hover:bg-black/[0.09]"
    }`}
  >
    {children}
  </motion.button>
);

/** Landing-page primary CTA: dark glass pill inside a hairline ring. */
const DarkPill = ({
  href,
  onClick,
  disabled,
  children,
}: {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  const inner =
    "relative z-10 flex h-12 items-center justify-center gap-3 rounded-[32px] border border-white/10 bg-[#171717]/80 px-6 text-[16px] font-medium leading-none tracking-[-0.01em] text-white backdrop-blur-[10px] transition-colors duration-150 hover:bg-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/50 disabled:opacity-50";
  return (
    <motion.div
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={spring}
      className="relative inline-block p-1.5"
    >
      <div className="pointer-events-none absolute inset-0 rounded-full border border-gray-400/40" />
      {href ? (
        <Link href={href} className={inner}>
          {children}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={inner}
        >
          {children}
        </button>
      )}
    </motion.div>
  );
};

const SoftPill = ({
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
    className="inline-block"
  >
    <Link
      href={href}
      className="group flex h-12 items-center gap-3 rounded-full bg-[#f5f5f7] pl-5 pr-3 text-[15px] font-medium tracking-[-0.01em] text-[#1d1d1f] transition-colors hover:bg-[#ececf0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/40"
    >
      {children}
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.06] text-[#6e6e73] transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#1d1d1f] group-hover:text-white">
        <ArrowRightIcon />
      </span>
    </Link>
  </motion.div>
);

const inputLight =
  "h-10 rounded-full border border-black/10 bg-white px-4 text-[14px] text-[#1d1d1f] transition-all focus:border-[#0080FF] focus:outline-none focus:ring-4 focus:ring-[#0080FF]/10";
const inputDark =
  "h-10 rounded-full border border-white/15 bg-white/10 px-4 text-[14px] text-white placeholder:text-white/40 transition-all focus:border-[#4DA3FF] focus:outline-none focus:ring-4 focus:ring-[#4DA3FF]/20";
const saveLight =
  "h-10 rounded-full bg-[#1d1d1f] px-5 text-[13px] font-medium text-white transition-colors hover:bg-black disabled:opacity-50";
const saveDark =
  "h-10 rounded-full bg-white px-5 text-[13px] font-medium text-[#1d1d1f] transition-colors hover:bg-white/90 disabled:opacity-50";
const cancelLight =
  "h-10 px-2 text-[13px] font-medium text-[#86868b] transition-colors hover:text-[#1d1d1f]";
const cancelDark =
  "h-10 px-2 text-[13px] font-medium text-white/50 transition-colors hover:text-white";

// --- Helpers ---
const DAY_MS = 24 * 60 * 60 * 1000;
const DISMISS_KEY = "dismissedExamDatePopup";

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const parseLocalDate = (input: string | Date): Date | null => {
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  const d = m
    ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0, 0)
    : new Date(input);
  return isNaN(d.getTime()) ? null : d;
};

const getDaysUntil = (exam: Date) =>
  Math.round(
    (startOfDay(exam).getTime() - startOfDay(new Date()).getTime()) / DAY_MS,
  );

const pickNextExamDate = (dates?: string[]) => {
  const parsed = (dates || [])
    .map(parseLocalDate)
    .filter((d): d is Date => d !== null)
    .map((date) => ({ date, days: getDaysUntil(date) }));
  if (!parsed.length) return null;
  const upcoming = parsed
    .filter((p) => p.days >= 0)
    .sort((a, b) => a.days - b.days);
  if (upcoming.length) return { ...upcoming[0], isPast: false };
  const latest = parsed.sort((a, b) => b.days - a.days)[0];
  return { ...latest, isPast: true };
};

const SAT_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const generateFutureSATDates = (): { label: string; value: string }[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const rawDates = [
    { year: currentYear, month: 2, day: 9 },
    { year: currentYear, month: 4, day: 4 },
    { year: currentYear, month: 5, day: 6 },
    { year: currentYear, month: 7, day: 22 },
    { year: currentYear, month: 8, day: 12 },
    { year: currentYear, month: 9, day: 3 },
    { year: currentYear, month: 10, day: 7 },
    { year: currentYear, month: 11, day: 5 },
    { year: currentYear + 1, month: 2, day: 6 },
    { year: currentYear + 1, month: 4, day: 1 },
    { year: currentYear + 1, month: 5, day: 5 },
  ];
  return rawDates
    .filter((s) => getDaysUntil(new Date(s.year, s.month, s.day, 12)) >= 0)
    .slice(0, 8)
    .map((s) => ({
      label: `${SAT_MONTHS[s.month]} ${s.day}, ${s.year}`,
      value: `${s.year}-${String(s.month + 1).padStart(2, "0")}-${String(
        s.day,
      ).padStart(2, "0")}`,
    }));
};

export default function HomePage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [timeToExam, setTimeToExam] = useState<{
    days: number;
    examDate: Date;
  } | null>(null);
  const [isEditingExamDate, setIsEditingExamDate] = useState(false);
  const [newExamDate, setNewExamDate] = useState<string>("");
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [newScore, setNewScore] = useState<string>("");

  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [practiceStreak, setPracticeStreak] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [weeklyQuestions, setWeeklyQuestions] = useState<number>(0);
  const [dailyGoal, setDailyGoal] = useState<number>(10);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showExamDatePopup, setShowExamDatePopup] = useState(false);
  const [isSavingExamDate, setIsSavingExamDate] = useState(false);

  const [hideScore, setHideScore] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<string>("");
  const [range, setRange] = useState<Range>("30");
  const [hover, setHover] = useState<number | null>(null);

  const applyExamDates = useCallback((dates?: string[]) => {
    const next = pickNextExamDate(dates);
    if (!next) {
      setTimeToExam(null);
      return;
    }
    setTimeToExam({ days: Math.max(0, next.days), examDate: next.date });

    if (next.isPast) {
      let dismissedAt = 0;
      try {
        dismissedAt = Number(localStorage.getItem(DISMISS_KEY)) || 0;
      } catch {}
      const recentlyDismissed =
        dismissedAt > 0 && Date.now() - dismissedAt < DAY_MS;
      if (!recentlyDismissed) setShowExamDatePopup(true);
    } else {
      setShowExamDatePopup(false);
      try {
        localStorage.removeItem(DISMISS_KEY);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = (auth as Auth).onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const cachedUserData = localStorage.getItem("cachedUserData");
    if (cachedUserData) {
      try {
        setUserData(JSON.parse(cachedUserData));
      } catch (e) {
        console.error("Error parsing cached user data:", e);
      }
    }

    const fetchUserData = async () => {
      if (!auth?.currentUser || !db) return;
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          localStorage.setItem("cachedUserData", JSON.stringify(data));
          applyExamDates(data.satTestDates);
          setDailyGoal(data.dailyGoal || 10);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserAnswers = () => {
      if (!auth?.currentUser || !db) return;

      const q = query(
        collection(db, "userAnswers"),
        where("userId", "==", auth.currentUser.uid),
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const answers: UserAnswer[] = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<UserAnswer, "id">),
          }));

          setUserAnswers(answers);
          setTotalQuestions(answers.length);

          const streak = calculatePracticeStreak(answers);
          setPracticeStreak(streak);

          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const weekly = answers.filter((a) => {
            const answerDate = a.timestamp ? new Date(a.timestamp) : new Date();
            return answerDate >= oneWeekAgo;
          }).length;
          setWeeklyQuestions(weekly);

          setAchievements(calculateAchievements(answers, streak));
        },
        (error) => console.error("Error fetching user answers:", error),
      );

      return unsubscribe;
    };

    if (isAuthenticated) {
      fetchUserData();
      const unsubscribe = fetchUserAnswers();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isAuthenticated, applyExamDates]);

  const calculatePracticeStreak = (answers: UserAnswer[]) => {
    if (answers.length === 0) return 0;

    const dates = answers
      .map((a) => (a.timestamp ? new Date(a.timestamp).toDateString() : null))
      .filter((d): d is string => d !== null)
      .reverse();

    const uniqueDates = Array.from(new Set(dates));
    let streak = 0;
    let currentDate = new Date();

    for (const date of uniqueDates) {
      const answerDate = new Date(date);
      const diffDays = Math.floor(
        (currentDate.getTime() - answerDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === streak || diffDays === streak + 1) {
        streak++;
        currentDate = new Date(answerDate);
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateAchievements = (answers: UserAnswer[], streak: number) => {
    const list: Achievement[] = [];
    if (answers.length >= 10)
      list.push({
        id: "first_10",
        name: "First Steps",
        icon: "🎯",
        description: "Answered 10 questions",
      });
    if (answers.length >= 50)
      list.push({
        id: "half_century",
        name: "Half Century",
        icon: "🏆",
        description: "Answered 50 questions",
      });
    if (answers.length >= 100)
      list.push({
        id: "century",
        name: "Century",
        icon: "💯",
        description: "Answered 100 questions",
      });
    if (streak >= 3)
      list.push({
        id: "streak_3",
        name: "3-Day Streak",
        icon: "🔥",
        description: "Practiced 3 days in a row",
      });
    if (streak >= 7)
      list.push({
        id: "streak_7",
        name: "Week Warrior",
        icon: "⚡",
        description: "Practiced 7 days in a row",
      });
    if (streak >= 30)
      list.push({
        id: "streak_30",
        name: "Monthly Master",
        icon: "👑",
        description: "Practiced 30 days in a row",
      });

    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    if (correctAnswers >= 20 && correctAnswers / answers.length >= 0.8) {
      list.push({
        id: "accuracy_master",
        name: "Accuracy Master",
        icon: "🎯",
        description: "80%+ accuracy with 20+ questions",
      });
    }
    return list;
  };

  const getWeakAreas = useCallback(() => {
    if (!userAnswers.length) return [];
    const domainStats: Record<string, { correct: number; total: number }> = {};
    userAnswers.forEach((answer) => {
      const domain = answer.domain || "General";
      if (!domainStats[domain]) domainStats[domain] = { correct: 0, total: 0 };
      domainStats[domain].total++;
      if (answer.isCorrect) domainStats[domain].correct++;
    });

    return Object.entries(domainStats)
      .map(([domain, stats]) => ({
        domain,
        accuracy: (stats.correct / stats.total) * 100,
        total: stats.total,
      }))
      .filter((item) => item.total >= 3)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);
  }, [userAnswers]);

  const getSuggestedFocus = () => {
    const weakAreas = getWeakAreas();
    if (weakAreas.length === 0)
      return "Start practicing to get personalized recommendations";
    return `Focus on ${weakAreas[0].domain} (${Math.round(
      weakAreas[0].accuracy,
    )}% accuracy)`;
  };

  const getMotivationalMessage = () => {
    if (practiceStreak >= 7) return "You're on fire! 🔥";
    if (practiceStreak >= 3) return "Amazing consistency.";
    if (totalQuestions >= 100) return "Century club member.";
    if (totalQuestions >= 50) return "Building great habits.";
    if (totalQuestions >= 10) return "Great start.";
    return "Your journey begins now.";
  };

  const getMotivationalSubtext = () => {
    if (practiceStreak >= 7)
      return `${practiceStreak} day streak — keep the momentum going.`;
    if (practiceStreak >= 3)
      return `${practiceStreak} days in a row — building a strong foundation.`;
    if (totalQuestions >= 100)
      return `${totalQuestions} questions answered — dedication pays off.`;
    if (totalQuestions >= 50)
      return `${totalQuestions} questions down — making real progress.`;
    if (totalQuestions >= 10)
      return `${totalQuestions} questions completed — every answer counts.`;
    return "Start your SAT prep journey today.";
  };

  const getStudyPlan = (): StudyPlanItem[] => {
    const hour = new Date().getHours();
    const weakAreas = getWeakAreas();
    const focusArea =
      weakAreas.length > 0 ? weakAreas[0]?.domain : "Reading & Writing";

    if (hour < 12) {
      return [
        {
          title: `Practice ${focusArea}`,
          duration: "15 min",
          type: "Practice",
        },
        { title: "Review mistakes", duration: "10 min", type: "Review" },
        { title: "Quick vocab drill", duration: "5 min", type: "Drill" },
      ];
    } else if (hour < 18) {
      return [
        {
          title: "Full practice session",
          duration: "30 min",
          type: "Practice",
        },
        { title: "Analyze weak areas", duration: "15 min", type: "Analysis" },
        { title: "Take a short break", duration: "5 min", type: "Break" },
      ];
    }
    return [
      { title: "Light review session", duration: "20 min", type: "Review" },
      { title: "Study flashcards", duration: "10 min", type: "Study" },
      { title: "Plan tomorrow's goals", duration: "5 min", type: "Planning" },
    ];
  };

  const getLeaderboardPosition = () => {
    const accuracy =
      userAnswers.length > 0
        ? (userAnswers.filter((a) => a.isCorrect).length / userAnswers.length) *
          100
        : 0;
    return Math.max(1, Math.floor(1000 - (totalQuestions * accuracy) / 10));
  };

  const getLeaderboardPercentile = () =>
    Math.max(1, Math.round((1 - getLeaderboardPosition() / 1000) * 100));

  const getPointsToNextRank = () =>
    Math.max(0, (getLeaderboardPosition() - 1) * 10);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) return "Good night";
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const handleExamDateUpdate = async (
    dateInput: string = newExamDate,
  ): Promise<boolean> => {
    const user = auth?.currentUser;
    if (!user || !db || !dateInput || isSavingExamDate) return false;

    const examDate = parseLocalDate(dateInput);
    if (!examDate || getDaysUntil(examDate) < 0) return false;

    setIsSavingExamDate(true);
    try {
      const iso = examDate.toISOString();
      await updateDoc(doc(db, "users", user.uid), { satTestDates: [iso] });
      const updated: UserData = { ...(userData || {}), satTestDates: [iso] };
      setUserData(updated);
      try {
        localStorage.setItem("cachedUserData", JSON.stringify(updated));
      } catch {}

      applyExamDates([iso]);
      setShowExamDatePopup(false);
      setIsEditingExamDate(false);
      setNewExamDate("");
      return true;
    } catch (error) {
      console.error("Error updating exam date:", error);
      return false;
    } finally {
      setIsSavingExamDate(false);
    }
  };

  const handleScoreUpdate = async () => {
    if (!auth?.currentUser || newScore === "" || !db) return;
    const scoreValue = parseInt(newScore, 10);
    if (isNaN(scoreValue) || scoreValue < 400 || scoreValue > 1600) {
      alert("Please enter a valid SAT score between 400 and 1600.");
      return;
    }
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        bestTotalScore: scoreValue,
      });
      setUserData({ ...userData, bestTotalScore: scoreValue });
      setIsEditingScore(false);
      setNewScore("");
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const handleGoalUpdate = async () => {
    if (!auth?.currentUser || newGoal === "" || !db) return;
    const goalValue = parseInt(newGoal, 10);
    if (isNaN(goalValue) || goalValue <= 0) return;
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        dailyGoal: goalValue,
      });
      setDailyGoal(goalValue);
      setIsEditingGoal(false);
      setNewGoal("");
    } catch (error) {
      console.error("Error updating daily goal:", error);
    }
  };

  const getDomainStats = useMemo((): DomainStat[] => {
    if (!userAnswers.length) return [];
    const domainStats: Record<string, { correct: number; total: number }> = {};
    userAnswers.forEach((answer) => {
      const domain = answer.domain || "General";
      if (!domainStats[domain]) domainStats[domain] = { correct: 0, total: 0 };
      domainStats[domain].total++;
      if (answer.isCorrect) domainStats[domain].correct++;
    });

    const total = userAnswers.length;
    return Object.entries(domainStats)
      .map(([domain, stats]) => ({
        domain,
        type: /math/i.test(domain)
          ? ("Math" as const)
          : ("Reading & Writing" as const),
        accuracy: (stats.correct / stats.total) * 100,
        share: (stats.total / total) * 100,
        total: stats.total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [userAnswers]);

  const getPractice30DayData = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    const counts: Record<string, number> = {};

    userAnswers.forEach((answer) => {
      if (!answer.timestamp) return;
      const key = new Date(answer.timestamp).toDateString();
      counts[key] = (counts[key] || 0) + 1;
    });

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      days.push({ date: key, count: counts[key] || 0 });
    }

    return {
      days,
      total: days.reduce((sum, d) => sum + d.count, 0),
      max: Math.max(...days.map((d) => d.count), 1),
    };
  }, [userAnswers]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-2 pb-24 pt-28 font-sans antialiased md:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10 space-y-4">
            <div className="h-4 w-40 animate-pulse rounded-full bg-[#f5f5f7]" />
            <div className="h-14 w-full max-w-xl animate-pulse rounded-2xl bg-[#f5f5f7]" />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4">
            <div className="h-72 animate-pulse rounded-[28px] bg-[#ececf0] md:col-span-4" />
            <div className="h-72 animate-pulse rounded-[28px] bg-[#f5f5f7] md:col-span-2" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-[28px] bg-[#f5f5f7] md:col-span-2"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const userName =
    userData?.name || userData?.email?.split("@")[0] || "Student";
  const currentScore =
    userData?.bestTotalScore ||
    (userData?.bestRwScore && userData?.bestMathScore
      ? userData.bestRwScore + userData.bestMathScore
      : "—");
  const weakAreas = getWeakAreas();
  const domainStats = getDomainStats;
  const practice30 = getPractice30DayData;
  const studyPlan = getStudyPlan();

  // Derived display values
  const todayCount = practice30.days[practice30.days.length - 1]?.count ?? 0;
  const goalProgress = dailyGoal > 0 ? Math.min(1, todayCount / dailyGoal) : 0;
  const remaining = Math.max(0, dailyGoal - todayCount);

  const chartDays = practice30.days.slice(-Number(range));
  const chartTotal = chartDays.reduce((sum, d) => sum + d.count, 0);
  const chartMax = Math.max(...chartDays.map((d) => d.count), dailyGoal, 1);
  const goalPct = (dailyGoal / chartMax) * 100;
  const hovered = hover !== null ? chartDays[hover] : null;
  const shortDate = (s: string) =>
    new Date(s).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  const last7 = practice30.days.slice(-7);

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const examLabel = timeToExam
    ? timeToExam.examDate.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const numericScore = typeof currentScore === "number" ? currentScore : null;

  return (
    <main className="min-h-screen bg-white font-sans antialiased selection:bg-gray-200 selection:text-black">
      <motion.div
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="mx-auto w-full max-w-6xl px-2 pb-24 pt-4 md:px-6 md:pt-8 lg:px-10"
        style={{ paddingLeft: "2px", paddingRight: "2px" }}
      >
        {/* ---------- Header ---------- */}
        <motion.header variants={item} className="mb-10 md:mb-14">
          <p className="mb-3 text-[15px] font-medium tracking-[-0.01em] text-[#86868b]">
            {todayLabel}
          </p>
          <h1 className="max-w-4xl text-[42px] font-medium leading-[1.05] tracking-[-0.035em] text-[#1d1d1f] md:text-[68px]">
            {getGreeting()}, {userName}.
          </h1>
          <p
            className="mt-4 max-w-2xl font-eb-garamond text-lg text-[#86868b] md:text-xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            {getMotivationalMessage()} {getMotivationalSubtext()}
          </p>
          <div className="-ml-1.5 mt-6 flex flex-wrap items-center gap-x-1 gap-y-2">
            <DarkPill href="/question-rush/rw">Full Practice Session</DarkPill>
            <SoftPill href="/question-rush/rw">5-Minute Warmup</SoftPill>
            <SoftPill href="/history">Review Practice History</SoftPill>
          </div>
        </motion.header>

        {/* ---------- Bento ---------- */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4">
          {/* Today */}
          <Card dark className="md:col-span-4">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#0080FF]/25 blur-3xl" />
            <div className="relative z-10 flex h-full min-h-[268px] flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="flex flex-1 flex-col justify-between gap-8 self-stretch">
                <div>
                  <Label dark>Today</Label>
                  <h2 className="mt-3 text-[44px] font-medium leading-[1.02] tracking-tighter md:text-[56px]">
                    {remaining > 0 ? (
                      <>
                        <CountUp value={remaining} /> to go.
                      </>
                    ) : (
                      "Goal reached."
                    )}
                  </h2>
                  <p className="mt-3 max-w-sm text-[15px] leading-snug text-white/55">
                    {todayCount} of {dailyGoal} questions answered.{" "}
                    {remaining > 0
                      ? "Keep going to hit your daily goal."
                      : "Anything more is a bonus."}
                  </p>
                </div>

                <div className="min-h-[44px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {isEditingGoal ? (
                      <motion.div
                        key="edit"
                        {...swap}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <input
                          type="number"
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          placeholder={String(dailyGoal)}
                          className={`${inputDark} w-28`}
                          autoFocus
                        />
                        <button onClick={handleGoalUpdate} className={saveDark}>
                          Save goal
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingGoal(false);
                            setNewGoal("");
                          }}
                          className={cancelDark}
                        >
                          Cancel
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="view"
                        {...swap}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={spring}
                        >
                          <Link
                            href="/question-rush/rw"
                            className="flex h-11 items-center rounded-full bg-white px-5 text-[15px] font-medium tracking-[-0.01em] text-[#1d1d1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DA3FF]"
                          >
                            Continue practicing
                          </Link>
                        </motion.div>
                        <motion.button
                          type="button"
                          onClick={() => setIsEditingGoal(true)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={spring}
                          className="h-11 rounded-full bg-white/10 px-5 text-[14px] font-medium text-white/80 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DA3FF]"
                        >
                          Edit daily goal
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative flex shrink-0 items-center justify-center self-center">
                <Ring progress={goalProgress} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <CountUp
                    value={Math.round(goalProgress * 100)}
                    suffix="%"
                    className="text-[40px] font-medium leading-none tracking-tighter"
                  />
                  <span className="mt-1.5 text-[13px] text-white/50">
                    of daily goal
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Exam countdown */}
          <Card className="md:col-span-2">
            <div className="flex items-start justify-between">
              <Label>Exam in</Label>
              {!isEditingExamDate && (
                <IconButton
                  label="Change exam date"
                  onClick={() => setIsEditingExamDate(true)}
                >
                  <PencilIcon />
                </IconButton>
              )}
            </div>
            <div className="mt-12 min-h-[120px] md:mt-16">
              <AnimatePresence mode="wait" initial={false}>
                {isEditingExamDate ? (
                  <motion.div
                    key="edit"
                    {...swap}
                    className="flex flex-col gap-3"
                  >
                    <input
                      type="date"
                      value={newExamDate}
                      onChange={(e) => setNewExamDate(e.target.value)}
                      className={inputLight}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExamDateUpdate()}
                        disabled={isSavingExamDate}
                        className={saveLight}
                      >
                        {isSavingExamDate ? "Saving…" : "Save date"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingExamDate(false);
                          setNewExamDate("");
                        }}
                        className={cancelLight}
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="view" {...swap}>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[72px] font-medium leading-none tracking-[-0.045em]">
                        {timeToExam ? <CountUp value={timeToExam.days} /> : "—"}
                      </span>
                      <span className="text-[17px] text-[#86868b]">days</span>
                    </div>
                    <p className="mt-3 text-[15px] text-[#86868b]">
                      {examLabel ?? "No exam date set yet."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Best score */}
          <Card className="md:col-span-2">
            <div className="flex items-start justify-between">
              <Label>Target / best score</Label>
              <div className="flex items-center gap-1.5">
                <IconButton
                  label={hideScore ? "Show score" : "Hide score"}
                  onClick={() => setHideScore((v) => !v)}
                >
                  {hideScore ? <EyeIcon /> : <EyeOffIcon />}
                </IconButton>
                {!isEditingScore && (
                  <IconButton
                    label="Edit score"
                    onClick={() => setIsEditingScore(true)}
                  >
                    <PencilIcon />
                  </IconButton>
                )}
              </div>
            </div>

            <div className="mt-8 min-h-[56px]">
              <AnimatePresence mode="wait" initial={false}>
                {isEditingScore ? (
                  <motion.div
                    key="edit"
                    {...swap}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <input
                      type="number"
                      value={newScore}
                      onChange={(e) => setNewScore(e.target.value)}
                      placeholder="1600"
                      className={`${inputLight} w-28`}
                      autoFocus
                    />
                    <button onClick={handleScoreUpdate} className={saveLight}>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingScore(false);
                        setNewScore("");
                      }}
                      className={cancelLight}
                    >
                      Cancel
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    {...swap}
                    className="flex items-baseline gap-2"
                  >
                    <span className="text-[56px] font-medium leading-none tracking-[-0.04em]">
                      {hideScore ? (
                        "••••"
                      ) : numericScore !== null ? (
                        <CountUp value={numericScore} />
                      ) : (
                        currentScore
                      )}
                    </span>
                    <span className="text-[15px] text-[#86868b]">/1600</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-7 space-y-4">
              {[
                {
                  label: "Reading & Writing",
                  value: userData?.bestRwScore,
                  color: C.green,
                },
                {
                  label: "Math",
                  value: userData?.bestMathScore,
                  color: C.blue,
                },
              ].map((row, i) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                    <span className="text-[#86868b]">{row.label}</span>
                    <span className="font-medium tabular-nums text-[#1d1d1f]">
                      {hideScore ? "•••" : row.value || "—"}
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-black/[0.07]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: row.color }}
                      initial={reduce ? false : { width: 0 }}
                      animate={{
                        width:
                          hideScore || !row.value
                            ? "0%"
                            : `${Math.min(100, (row.value / 800) * 100)}%`,
                      }}
                      transition={{ duration: 1.1, ease, delay: 0.4 + i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Streak */}
          <Card className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: C.orange }}
              >
                <FlameIcon />
              </span>
              <Label>Current streak</Label>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <CountUp
                value={practiceStreak}
                className="text-[72px] font-medium leading-none tracking-[-0.045em]"
              />
              <span className="text-[17px] text-[#86868b]">
                {practiceStreak === 1 ? "day" : "days"}
              </span>
            </div>
            <div className="mt-8 flex items-end justify-between">
              {last7.map((d, i) => {
                const active = d.count > 0;
                const isToday = i === last7.length - 1;
                return (
                  <div
                    key={d.date}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.span
                      initial={reduce ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ ...spring, delay: 0.5 + i * 0.06 }}
                      className={`block h-7 w-7 rounded-full ${
                        active ? "" : "bg-black/[0.07]"
                      } ${isToday ? "ring-2 ring-[#1d1d1f]/20 ring-offset-2 ring-offset-[#f5f5f7]" : ""}`}
                      style={active ? { backgroundColor: C.orange } : undefined}
                    />
                    <span className="text-[11px] font-medium text-[#86868b]">
                      {new Date(d.date).toLocaleDateString(undefined, {
                        weekday: "narrow",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* This week + total */}
          <Card className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: C.blue }}
              >
                <CalendarIcon />
              </span>
              <Label>This week</Label>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <CountUp
                value={weeklyQuestions}
                className="text-[72px] font-medium leading-none tracking-[-0.045em]"
              />
              <span className="text-[17px] text-[#86868b]">questions</span>
            </div>
            <div className="mt-8 flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
              <span className="text-[14px] text-[#86868b]">Total solved</span>
              <CountUp
                value={totalQuestions}
                className="text-[17px] font-medium tabular-nums"
              />
            </div>
          </Card>

          {/* Domain performance */}
          <Card className="md:col-span-4">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[22px] font-medium tracking-[-0.02em]">
                Domain performance
              </h2>
              <p className="text-[14px] text-[#86868b]">
                Accuracy and share of your practice
              </p>
            </div>

            {domainStats.length > 0 ? (
              <ul className="space-y-5">
                {domainStats.map((row, i) => (
                  <li key={row.domain}>
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-[16px] font-medium tracking-[-0.01em]">
                          {row.domain}
                        </p>
                        <p className="mt-0.5 text-[13px] text-[#86868b]">
                          {row.type}, {row.share.toFixed(1)}% of practice
                        </p>
                      </div>
                      <CountUp
                        value={Math.round(row.accuracy)}
                        suffix="%"
                        className="text-[22px] font-medium tabular-nums tracking-tight"
                      />
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/[0.07]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: accuracyColor(row.accuracy) }}
                        initial={reduce ? false : { width: 0 }}
                        animate={{
                          width: `${Math.max(2, Math.round(row.accuracy))}%`,
                        }}
                        transition={{
                          duration: 1.2,
                          ease,
                          delay: 0.3 + i * 0.08,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
                <p className="mb-2 text-[15px] text-[#86868b]">
                  Answer a few practice questions to see your domain breakdown
                  here.
                </p>
                <Link
                  href="/question-rush"
                  className="text-[15px] font-medium text-[#0080FF] hover:underline"
                >
                  Start a practice module
                </Link>
              </div>
            )}

            {weakAreas.length > 0 && (
              <Link
                href="/question-rush"
                className="group mt-7 flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_12px_24px_-8px_rgba(0,0,0,0.1)]"
              >
                <span className="text-[14px]">
                  <span className="text-[#86868b]">Recommendation </span>
                  <span className="font-medium">{getSuggestedFocus()}</span>
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.06] text-[#6e6e73] transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#1d1d1f] group-hover:text-white">
                  <ArrowRightIcon />
                </span>
              </Link>
            )}
          </Card>

          {/* Recommended today */}
          <Card className="md:col-span-2">
            <h2 className="mb-1 text-[22px] font-medium tracking-[-0.02em]">
              Recommended today
            </h2>
            <p className="mb-6 text-[14px] text-[#86868b]">
              Matched to the time of day.
            </p>
            <ul className="space-y-2.5">
              {studyPlan.map((p, i) => (
                <motion.li
                  key={`${p.title}-${i}`}
                  whileHover={{ x: 3 }}
                  transition={spring}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium tracking-[-0.01em]">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#86868b]">
                      {p.type}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#f5f5f7] px-2.5 py-1 text-[12px] font-medium text-[#6e6e73]">
                    {p.duration}
                  </span>
                </motion.li>
              ))}
            </ul>
          </Card>

          {/* Activity chart */}
          <Card className="md:col-span-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Label>Activity</Label>
                <div className="mt-2 flex items-baseline gap-2">
                  <CountUp
                    value={chartTotal}
                    className="text-[56px] font-medium leading-none tracking-[-0.04em]"
                  />
                  <span className="text-[15px] text-[#86868b]">
                    questions in {range === "7" ? "7 days" : "30 days"}
                  </span>
                </div>
                <div className="mt-2 h-5">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={hovered ? `h-${hover}` : "default"}
                      {...swap}
                      className="text-[14px] text-[#86868b]"
                    >
                      {hovered
                        ? `${shortDate(hovered.date)}: ${hovered.count} ${
                            hovered.count === 1 ? "question" : "questions"
                          }`
                        : `Daily goal ${dailyGoal}, average ${(chartTotal / chartDays.length).toFixed(1)} per day`}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              <Segmented<Range>
                id="range-pill"
                value={range}
                onChange={(v) => {
                  setHover(null);
                  setRange(v);
                }}
                options={[
                  { value: "7", label: "7D" },
                  { value: "30", label: "30D" },
                ]}
              />
            </div>

            <div
              key={range}
              className="relative mt-8 h-48"
              onMouseLeave={() => setHover(null)}
            >
              {/* goal line */}
              <div
                className="pointer-events-none absolute inset-x-0 border-t border-dashed border-black/20"
                style={{ bottom: `${goalPct}%` }}
              >
                <span className="absolute -top-5 right-0 text-[11px] font-medium text-[#86868b]">
                  Goal
                </span>
              </div>
              <div
                className={`flex h-full items-end ${range === "7" ? "gap-3" : "gap-[3px]"}`}
              >
                {chartDays.map((d, i) => (
                  <div
                    key={d.date}
                    className="flex h-full flex-1 cursor-pointer items-end"
                    onMouseEnter={() => setHover(i)}
                    onClick={() => setHover(i)}
                  >
                    <motion.div
                      className={`w-full ${range === "7" ? "rounded-t-xl" : "rounded-t-md"}`}
                      style={{
                        backgroundColor: d.count > 0 ? C.blue : "#d2d2d7",
                      }}
                      initial={reduce ? false : { height: "0%", opacity: 1 }}
                      animate={{
                        height: `${Math.max((d.count / chartMax) * 100, 3)}%`,
                        opacity: hover === null || hover === i ? 1 : 0.3,
                      }}
                      transition={{
                        height: {
                          type: "spring",
                          stiffness: 110,
                          damping: 18,
                          delay: i * 0.014,
                        },
                        opacity: { duration: 0.2 },
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex justify-between text-[12px] text-[#86868b]">
              <span>{chartDays[0] ? shortDate(chartDays[0].date) : ""}</span>
              <span>Today</span>
            </div>
          </Card>

          {/* Recent activity */}
          <Card className="md:col-span-4">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="text-[22px] font-medium tracking-[-0.02em]">
                Recent activity
              </h2>
              <Link
                href="/history"
                className="text-[14px] font-medium text-[#0080FF] hover:underline"
              >
                View full log
              </Link>
            </div>

            {userAnswers.length > 0 ? (
              <ul className="space-y-2.5">
                {userAnswers.slice(0, 5).map((answer, i) => (
                  <motion.li
                    key={answer.id || i}
                    whileHover={{ x: 3 }}
                    transition={spring}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold"
                        style={{
                          backgroundColor: answer.isCorrect
                            ? "#10B9811A"
                            : "#EF44441A",
                          color: answer.isCorrect ? "#047857" : "#B91C1C",
                        }}
                      >
                        {(answer.category || "Q").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-medium tracking-[-0.01em]">
                          {answer.category || "Practice Question"}
                        </p>
                        <p className="mt-0.5 text-[13px] text-[#86868b]">
                          {answer.timestamp
                            ? new Date(answer.timestamp).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                    <span
                      className="ml-4 shrink-0 rounded-full px-3 py-1 text-[13px] font-medium"
                      style={{
                        backgroundColor: answer.isCorrect
                          ? "#10B9811A"
                          : "#EF44441A",
                        color: answer.isCorrect ? "#047857" : "#B91C1C",
                      }}
                    >
                      {answer.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
                <p className="mb-2 text-[15px] text-[#86868b]">
                  No practice history recorded yet.
                </p>
                <Link
                  href="/question-rush"
                  className="text-[15px] font-medium text-[#0080FF] hover:underline"
                >
                  Start your first practice module
                </Link>
              </div>
            )}
          </Card>

          {/* Rank + badges */}
          <div className="flex flex-col gap-3 md:col-span-2 md:gap-4">
            {userAnswers.length > 0 && (
              <Card dark>
                <div className="pointer-events-none absolute -bottom-20 -right-16 h-52 w-52 rounded-full bg-[#10B981]/20 blur-3xl" />
                <div className="relative z-10">
                  <Label dark>Global rank</Label>
                  <div className="mb-2 mt-5 text-[56px] font-medium leading-none tracking-[-0.04em]">
                    #<CountUp value={getLeaderboardPosition()} />
                  </div>
                  <p className="text-[15px] text-white/65">
                    {getLeaderboardPercentile()}th percentile overall
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-[13px] text-white/45">
                      Points to next rank
                    </span>
                    <CountUp
                      value={getPointsToNextRank()}
                      className="text-[15px] font-medium tabular-nums"
                    />
                  </div>
                </div>
              </Card>
            )}

            <Card className="flex-1">
              <h2 className="mb-5 text-[22px] font-medium tracking-[-0.02em]">
                Badges
              </h2>
              {achievements.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {achievements.slice(0, 4).map((a) => (
                    <motion.div
                      key={a.id}
                      whileHover={{ y: -3, scale: 1.02 }}
                      transition={spring}
                      className="rounded-2xl bg-white p-4 text-center shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
                    >
                      <div className="mb-2 text-[26px]">{a.icon}</div>
                      <div className="mb-1 text-[13px] font-medium leading-tight">
                        {a.name}
                      </div>
                      <div className="text-[12px] leading-tight text-[#86868b]">
                        {a.description}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] leading-snug text-[#86868b]">
                  Answer 10 questions to earn your first badge.
                </p>
              )}
            </Card>
          </div>
        </div>
      </motion.div>

      {/* ---------- Exam date modal ---------- */}
      <AnimatePresence>
        {showExamDatePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={spring}
              role="dialog"
              aria-modal="true"
              aria-labelledby="exam-date-title"
              className="w-full max-w-[520px] rounded-[32px] bg-white p-7 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_30px_80px_-16px_rgba(0,0,0,0.28)] md:p-8"
            >
              <div className="mb-6 text-center">
                <div
                  className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: C.blue }}
                >
                  <CalendarIcon />
                </div>
                <h2
                  id="exam-date-title"
                  className="mb-2 text-[28px] font-medium tracking-tighter text-[#1d1d1f]"
                >
                  Update your SAT exam date
                </h2>
                <p className="text-[15px] leading-snug text-[#86868b]">
                  Your previous test date has passed. Pick your next official
                  Digital SAT date.
                </p>
              </div>

              <div className="mb-6 grid max-h-[260px] grid-cols-1 gap-2.5 overflow-y-auto sm:grid-cols-2">
                {generateFutureSATDates().map((option, i) => (
                  <motion.button
                    key={option.value}
                    disabled={isSavingExamDate}
                    onClick={() => handleExamDateUpdate(option.value)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.12 + i * 0.04 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-2xl bg-[#f5f5f7] p-4 text-left text-[15px] font-medium text-[#1d1d1f] transition-colors hover:bg-[#ececf0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/40 disabled:opacity-50"
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setShowExamDatePopup(false);
                    try {
                      localStorage.setItem(DISMISS_KEY, Date.now().toString());
                    } catch {}
                  }}
                  className="rounded-full px-8 py-3 text-[14px] font-medium text-[#86868b] transition-colors hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                >
                  Remind me later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
