"use client";

import { auth, db } from "@/lib/firebase";
import type { Auth } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  History as HistoryIcon,
  LockKeyhole,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export const dynamic = "force-dynamic";

interface HistoryQuestion {
  id: string;
  questionId?: string | number;
  category?: string;
  difficulty?: string;
  lastAttemptedAt?: string | number | Date | { toDate: () => Date };
  attempts?: { isCorrect?: boolean }[];
}

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

function Card({
  children,
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <motion.section
      variants={item}
      className={`relative overflow-hidden rounded-[28px] p-6 md:p-7 ${
        dark ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"
      } ${className}`}
    >
      {children}
    </motion.section>
  );
}

function Label({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <p
      className={`text-[14px] font-medium tracking-[-0.01em] ${
        dark ? "text-white/50" : "text-[#86868b]"
      }`}
    >
      {children}
    </p>
  );
}

function getAttempt(question: HistoryQuestion) {
  return question.attempts?.at(-1) ?? null;
}

function toDate(value: HistoryQuestion["lastAttemptedAt"]): Date | null {
  if (!value) return null;
  const date =
    value instanceof Date
      ? value
      : typeof value === "object" && "toDate" in value
        ? value.toDate()
        : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatRelativeDate(date: Date | null) {
  if (!date) return "Recently";
  const days = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function HistoryPage() {
  const [questions, setQuestions] = useState<HistoryQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let unsubscribeQuestions: (() => void) | undefined;

    const unsubscribeAuth = auth
      ? (auth as Auth).onAuthStateChanged((user) => {
          unsubscribeQuestions?.();
          unsubscribeQuestions = undefined;

          if (!user || !db) {
            setIsAuthenticated(false);
            setQuestions([]);
            setIsLoading(false);
            return;
          }

          setIsAuthenticated(true);
          setIsLoading(true);
          const historyQuery = query(
            collection(db, "userProgress"),
            where("userId", "==", user.uid),
          );
          unsubscribeQuestions = onSnapshot(
            historyQuery,
            (snapshot) => {
              const rows = snapshot.docs
                .map(
                  (document) =>
                    ({
                      ...document.data(),
                      id: document.id,
                    }) as HistoryQuestion,
                )
                .sort((a, b) => {
                  return (
                    (toDate(b.lastAttemptedAt)?.getTime() ?? 0) -
                    (toDate(a.lastAttemptedAt)?.getTime() ?? 0)
                  );
                });
              setQuestions(rows);
              setIsLoading(false);
            },
            (error) => {
              console.error("Error fetching question history:", error);
              setIsLoading(false);
            },
          );
        })
      : undefined;

    if (!auth) setIsLoading(false);

    return () => {
      unsubscribeAuth?.();
      unsubscribeQuestions?.();
    };
  }, []);

  const correctCount = questions.filter(
    (question) => getAttempt(question)?.isCorrect,
  ).length;
  const accuracyRate =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

  const activity = useMemo(() => {
    const counts = new Map<string, number>();
    for (const question of questions) {
      const date = toDate(question.lastAttemptedAt);
      if (!date) continue;
      const key = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ).toDateString();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (29 - index));
      return { date, count: counts.get(date.toDateString()) ?? 0 };
    });
  }, [questions]);
  const activityMax = Math.max(...activity.map((day) => day.count), 1);
  const activeDays = new Set(
    activity
      .filter((day) => day.count > 0)
      .map((day) => day.date.toDateString()),
  ).size;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-2 pb-24 pt-4 font-sans antialiased md:px-6 md:pt-8 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10 space-y-4">
            <div className="h-14 w-full max-w-md animate-pulse rounded-2xl bg-[#f5f5f7]" />
            <div className="h-5 w-60 animate-pulse rounded-full bg-[#f5f5f7]" />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4">
            <div className="h-72 animate-pulse rounded-[28px] bg-[#ececf0] md:col-span-4" />
            <div className="h-72 animate-pulse rounded-[28px] bg-[#f5f5f7] md:col-span-2" />
            <div className="h-56 animate-pulse rounded-[28px] bg-[#f5f5f7] md:col-span-6" />
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-white px-4 font-sans">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="w-full max-w-lg rounded-[28px] bg-[#f5f5f7] p-8 text-center md:p-10"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#86868b]">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h1 className="text-[30px] font-medium tracking-[-0.04em] text-[#1d1d1f]">
            Sign in to view your history.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[#86868b]">
            Your answered questions and practice progress will be saved here.
          </p>
          <Link
            href="/sign-in"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#1d1d1f] px-7 text-[15px] font-medium text-white transition-colors hover:bg-[#343438] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/50"
          >
            Sign in
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-sans antialiased selection:bg-gray-200 selection:text-black">
      <motion.div
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="mx-auto w-full max-w-6xl px-2 pb-24 pt-4 md:px-6 md:pt-8 lg:px-10"
      >
        <motion.header variants={item} className="mb-10 md:mb-14">
          <p className="mb-3 text-[15px] font-medium tracking-[-0.01em] text-[#86868b]">
            Your progress, over time
          </p>
          <h1 className="max-w-4xl text-[42px] font-medium leading-[1.05] tracking-[-0.035em] text-[#1d1d1f] md:text-[68px]">
            Practice history.
          </h1>
          <p
            className="mt-4 max-w-2xl font-eb-garamond text-lg text-[#86868b] md:text-xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            Every question is a step forward. Here&apos;s how your practice is
            adding up.
          </p>
          <div className="-ml-1.5 mt-6 flex flex-wrap items-center gap-x-1 gap-y-2">
            <motion.div
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className="relative inline-block p-1.5"
            >
              <div className="pointer-events-none absolute inset-0 rounded-full border border-gray-400/40" />
              <Link
                href="/question-rush"
                className="relative z-10 flex h-12 items-center justify-center gap-3 rounded-[32px] border border-white/10 bg-[#171717]/80 px-6 text-[16px] font-medium leading-none tracking-[-0.01em] text-white backdrop-blur-[10px] transition-colors duration-150 hover:bg-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/50"
              >
                Practice now
              </Link>
            </motion.div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4">
          <Card dark className="md:col-span-4">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#0080FF]/25 blur-3xl" />
            <div className="relative z-10 flex h-full min-h-[268px] flex-col justify-between gap-8">
              <div>
                <Label dark>Questions answered</Label>
                <p className="mt-3 text-[48px] font-medium leading-none tracking-[-0.045em] md:text-[64px]">
                  {questions.length.toLocaleString()}
                </p>
                <p className="mt-3 max-w-sm text-[15px] leading-snug text-white/55">
                  Your completed practice questions, newest first.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/question-rush"
                  className="flex h-11 items-center rounded-full bg-white px-5 text-[15px] font-medium tracking-[-0.01em] text-[#1d1d1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DA3FF]"
                >
                  Continue practicing
                </Link>
                <span className="flex h-11 items-center rounded-full bg-white/10 px-4 text-[14px] font-medium text-white/75">
                  {activeDays} active {activeDays === 1 ? "day" : "days"} in the
                  last 30 days
                </span>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10B981] text-white">
                <Target className="h-[18px] w-[18px]" />
              </span>
              <Label>Accuracy</Label>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-[64px] font-medium leading-none tracking-[-0.045em]">
                {accuracyRate}
              </span>
              <span className="text-[17px] text-[#86868b]">%</span>
            </div>
            <div className="mt-8 flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
              <span className="text-[14px] text-[#86868b]">Correct</span>
              <span className="text-[17px] font-medium tabular-nums">
                {correctCount} / {questions.length}
              </span>
            </div>
          </Card>

          <Card className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F97316] text-white">
                <CalendarDays className="h-[18px] w-[18px]" />
              </span>
              <Label>Last 30 days</Label>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-[64px] font-medium leading-none tracking-[-0.045em]">
                {activity.reduce((sum, day) => sum + day.count, 0)}
              </span>
              <span className="text-[17px] text-[#86868b]">questions</span>
            </div>
            <div className="mt-8 flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
              <span className="text-[14px] text-[#86868b]">Active days</span>
              <span className="text-[17px] font-medium tabular-nums">
                {activeDays}
              </span>
            </div>
          </Card>

          <Card className="md:col-span-4">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[22px] font-medium tracking-[-0.02em]">
                Practice activity
              </h2>
              <p className="text-[14px] text-[#86868b]">Your last 30 days</p>
            </div>
            <div
              className="flex h-40 items-end gap-[3px] rounded-2xl bg-white px-4 pt-4 shadow-[0_0_0_1px_rgba(0,0,0,0.04)] sm:gap-1"
              role="img"
              aria-label={`Practice activity for the last 30 days, ${activity.reduce((sum, day) => sum + day.count, 0)} questions answered`}
            >
              {activity.map((day) => (
                <div
                  key={day.date.toISOString()}
                  title={`${day.date.toLocaleDateString()}: ${day.count} questions`}
                  className="flex h-full flex-1 items-end"
                >
                  <motion.div
                    className="w-full rounded-t-md"
                    style={{
                      backgroundColor: day.count > 0 ? "#0080FF" : "#d2d2d7",
                    }}
                    initial={reduce ? false : { height: "0%" }}
                    animate={{
                      height: `${Math.max((day.count / activityMax) * 100, 4)}%`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 110,
                      damping: 18,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[12px] text-[#86868b]">
              <span>
                {activity[0]?.date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>Today</span>
            </div>
          </Card>

          <Card className="md:col-span-6">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[22px] font-medium tracking-[-0.02em]">
                Recent activity
              </h2>
              <p className="text-[14px] text-[#86868b]">
                {questions.length}{" "}
                {questions.length === 1 ? "question" : "questions"} total
              </p>
            </div>

            {questions.length > 0 ? (
              <ul className="space-y-2.5">
                {questions.map((question) => {
                  const attempt = getAttempt(question);
                  const isCorrect = Boolean(attempt?.isCorrect);
                  const date = toDate(question.lastAttemptedAt);
                  const questionId = question.questionId ?? question.id;
                  return (
                    <motion.li
                      key={question.id}
                      variants={item}
                      whileHover={reduce ? undefined : { x: 3 }}
                      transition={spring}
                    >
                      <Link
                        href={`/question-rush/rw?question_id=${questionId}`}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_12px_24px_-8px_rgba(0,0,0,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/40"
                      >
                        <div className="flex min-w-0 items-center gap-3.5">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold ${
                              isCorrect
                                ? "bg-[#10B9811A] text-[#10B981]"
                                : "bg-[#EF44441A] text-[#EF4444]"
                            }`}
                          >
                            {isCorrect ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-medium tracking-[-0.01em]">
                              Question #{question.questionId ?? question.id}
                            </p>
                            <p className="mt-0.5 truncate text-[13px] text-[#86868b]">
                              {[question.category, question.difficulty]
                                .filter(Boolean)
                                .join(" · ") || "Practice question"}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-[13px] text-[#86868b]">
                            {formatRelativeDate(date)}
                          </span>
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.06] text-[#6e6e73]">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f7] text-[#86868b]">
                  <HistoryIcon className="h-5 w-5" />
                </div>
                <p className="mb-2 text-[15px] text-[#86868b]">
                  Answer a few practice questions to see your history here.
                </p>
                <Link
                  href="/question-rush"
                  className="text-[15px] font-medium text-[#0080FF] hover:underline"
                >
                  Start practicing
                  <ArrowRight className="ml-1 inline h-4 w-4" />
                </Link>
              </div>
            )}
          </Card>
        </div>
      </motion.div>
    </main>
  );
}
