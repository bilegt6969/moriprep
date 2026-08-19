"use client";

import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// =========================================================
// Icons (Matching the clean, minimal UI)
// =========================================================
const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[18px] h-[18px]"
  >
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-[16px] h-[16px] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[15px] h-[15px]"
  >
    <path d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 4.5 9 7-0 .77-.9 1.98-2.36 3.16M6.6 6.6C4.4 7.9 3 9.8 3 12c0 2.5 4 7 9 7 1.13 0 2.2-.22 3.18-.6" />
  </svg>
);

const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[15px] h-[15px]"
  >
    <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const FlameIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px]">
    <path d="M12.75 2.25c.35 3.1-1.02 5.1-2.6 6.83-1.6 1.75-3.4 3.9-3.4 7.17a5.25 5.25 0 0010.5 0c0-1.9-.72-3-1.35-3.9-.2 1.55-1 2.5-1.9 2.5-1.15 0-1.7-.95-1.5-2.15.35-2 2.35-3.35 2.35-6.3 0-1.5-.6-2.85-2.1-4.15z" />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px]">
    <path
      fillRule="evenodd"
      d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
      clipRule="evenodd"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px]">
    <path
      fillRule="evenodd"
      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

// =========================================================
// Reusable Components
// =========================================================
const StatRow = ({
  icon,
  text,
  label,
}: {
  icon: React.ReactNode;
  text: string;
  label?: string;
}) => (
  <div className="flex items-start gap-3.5 group">
    <div className="w-[40px] h-[40px] shrink-0 rounded-xl bg-[#F7F7F8] flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#FFC300]/15 transition-colors">
      {icon}
    </div>
    <div className="flex flex-col">
      {label && (
        <span className="text-[13px] font-medium text-[#8e8e93] mb-0.5">
          {label}
        </span>
      )}
      <span className="text-[17px] font-semibold text-[#1D1D1F]">{text}</span>
    </div>
  </div>
);

export default function AnalyticsPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  // UI States
  const [hideScore, setHideScore] = useState(false);
  const [openSections, setOpenSections] = useState({
    progress: true,
    activity: true,
  });

  useEffect(() => {
    if (!auth || !db) return;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("Auth state changed:", user);
      if (user) {
        // Fetch User Profile
        const userDoc = await getDoc(doc(db!, "users", user.uid));
        if (userDoc.exists()) {
          console.log("User data:", userDoc.data());
          setUserData({ name: user.displayName, ...userDoc.data() });
        }

        // Fetch Analytics from userProgress collection
        const q = query(
          collection(db!, "userProgress"),
          where("userId", "==", user.uid),
        );
        console.log("Querying userProgress with userId:", user.uid);
        onSnapshot(q, (snapshot) => {
          const answers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Fetched userProgress:", answers);
          setUserAnswers(answers);
          setIsLoading(false);
        });
      } else {
        console.log("No user found");
        setIsLoading(false);
        router.push("/sign-in");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Derived Analytics Data
  const accuracy =
    userAnswers.length > 0
      ? Math.round(
          (userAnswers.filter((progress) => {
            if (!progress.attempts || progress.attempts.length === 0)
              return false;
            const lastAttempt = progress.attempts[progress.attempts.length - 1];
            return lastAttempt.isCorrect;
          }).length /
            userAnswers.length) *
            100,
        )
      : 0;

  // Calculate domain stats from real data
  const getDomainStats = () => {
    if (!userAnswers.length) return [];

    const domainStats: any = {};
    userAnswers.forEach((progress) => {
      const domain = progress.domain || "General";
      if (!domainStats[domain]) {
        domainStats[domain] = { correct: 0, total: 0 };
      }
      domainStats[domain].total++;
      // Check if the last attempt was correct
      if (progress.attempts && progress.attempts.length > 0) {
        const lastAttempt = progress.attempts[progress.attempts.length - 1];
        if (lastAttempt.isCorrect) {
          domainStats[domain].correct++;
        }
      }
    });

    const total = userAnswers.length;
    return Object.entries(domainStats)
      .map(([domain, stats]: [string, any]) => ({
        domain,
        type: /math/i.test(domain) ? "Math" : "R&W",
        accuracy: Math.round((stats.correct / stats.total) * 100),
        share: (stats.total / total) * 100,
        total: stats.total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const domainStats = getDomainStats();

  // Calculate practice streak
  const calculatePracticeStreak = () => {
    if (userAnswers.length === 0) return 0;

    const dates = userAnswers
      .map((p) =>
        p.lastAttemptedAt ? new Date(p.lastAttemptedAt).toDateString() : null,
      )
      .filter((d) => d !== null)
      .reverse();

    const uniqueDates = [...new Set(dates)];
    let streak = 0;
    let currentDate = new Date();

    for (const date of uniqueDates) {
      const answerDate = new Date(date);
      const diffDays = Math.floor(
        (currentDate.getTime() - answerDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === streak) {
        streak++;
        currentDate = new Date(answerDate);
      } else if (diffDays === streak + 1) {
        streak++;
        currentDate = new Date(answerDate);
      } else {
        break;
      }
    }

    return streak;
  };

  // Calculate weekly questions
  const getWeeklyQuestions = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return userAnswers.filter((p) => {
      const answerDate = p.lastAttemptedAt
        ? new Date(p.lastAttemptedAt)
        : new Date();
      return answerDate >= oneWeekAgo;
    }).length;
  };

  // Calculate total practice time (in minutes) from attempts
  const getTotalPracticeTime = () => {
    const totalTimeMs = userAnswers.reduce((total, progress) => {
      if (!progress.attempts) return total;
      const attemptsTime = progress.attempts.reduce(
        (acc: number, attempt: any) => {
          return acc + (attempt.timeSpent || 0);
        },
        0,
      );
      return total + attemptsTime;
    }, 0);
    return Math.floor(totalTimeMs / 60000);
  };

  // Get daily goal from user data
  const dailyGoal = userData?.dailyGoal || 20;

  const toggleSection = (key: "progress" | "activity") =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  if (isLoading) {
    return (
      <section className="min-h-screen bg-white font-sans pt-8 pb-20 px-4 md:px-8 lg:px-12 flex justify-center">
        <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin mt-20" />
      </section>
    );
  }

  const userName = userData?.name?.split(" ")[0] || "Student";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <section className="min-h-screen bg-white font-sans pt-8 pb-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1000px] mx-auto w-full">
        {/* ---- Hero card ---- */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5 }}
          className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#FFD84D] to-[#FFBE0B] p-6 md:p-10"
        >
          <div className="flex items-start justify-between mb-8 md:mb-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] leading-tight">
                Welcome back, {userName}.
              </h1>
              <p className="text-[15px] md:text-[16px] font-medium text-[#1D1D1F]/70 mt-2">
                You've answered {userAnswers.length} questions so far.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white transition-colors flex items-center justify-center text-[#1D1D1F]">
                <BellIcon />
              </button>
              <div className="w-10 h-10 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center font-semibold text-[15px]">
                {userInitial}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex gap-10 md:gap-14">
              <div>
                <p className="text-[13px] font-medium text-[#1D1D1F]/60 mb-1">
                  Total Accuracy
                </p>
                <p className="text-[32px] md:text-[36px] font-bold text-[#1D1D1F] leading-none">
                  {hideScore ? "••••" : `${accuracy}%`}
                </p>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#1D1D1F]/60 mb-1">
                  Questions Answered
                </p>
                <p className="text-[32px] md:text-[36px] font-bold text-[#1D1D1F] leading-none">
                  {hideScore ? "••••" : userAnswers.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setHideScore((v) => !v)}
                className="flex items-center gap-1.5 text-[13px] font-medium text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition-colors"
              >
                {hideScore ? <EyeIcon /> : <EyeOffIcon />}
                {hideScore ? "Show stats" : "Hide stats"}
              </button>
              <Link
                href="/practice"
                className="flex items-center gap-1 text-[13px] font-semibold bg-white/90 hover:bg-white transition-colors text-[#1D1D1F] px-3.5 py-2 rounded-full"
              >
                <span className="text-[16px] leading-none">+</span> New Session
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ---- Accordion bars ---- */}
        <div className="mt-6 space-y-3">
          {/* Orange Progress Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-[20px] bg-[#FBD9AE] overflow-hidden"
          >
            <button
              onClick={() => toggleSection("progress")}
              className="w-full flex items-center justify-between px-5 md:px-6 py-4"
            >
              <span className="text-[16px] md:text-[18px] font-semibold text-[#9A4A0C]">
                Performance & Streaks
              </span>
              <span className="w-9 h-9 rounded-xl border-2 border-[#9A4A0C]/50 bg-white/40 flex items-center justify-center text-[#9A4A0C]">
                <ChevronDownIcon open={openSections.progress} />
              </span>
            </button>
            {openSections.progress && (
              <div className="px-5 md:px-6 pb-6">
                <div className="grid grid-cols-4 gap-2 pb-3 text-[12px] font-medium text-[#9A4A0C]/60">
                  <span>Domain</span>
                  <span>Type</span>
                  <span>Accuracy</span>
                  <span className="text-right">Allocation</span>
                </div>
                <div className="space-y-3.5">
                  {domainStats.map((row) => (
                    <div
                      key={row.domain}
                      className="grid grid-cols-4 gap-2 items-baseline"
                    >
                      <span className="text-[15px] md:text-[17px] font-semibold text-[#9A4A0C] truncate">
                        {row.domain}
                      </span>
                      <span className="text-[14px] md:text-[15px] font-medium text-[#9A4A0C]/80">
                        {row.type}
                      </span>
                      <span className="text-[15px] md:text-[17px] font-semibold text-[#9A4A0C]">
                        {row.accuracy}
                        <span className="text-[12px] font-normal">%</span>
                      </span>
                      <span className="text-[15px] md:text-[17px] font-semibold text-[#9A4A0C] text-right">
                        {row.share.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Blue Focus Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-[20px] bg-[#AEE2F4] overflow-hidden"
          >
            <button
              onClick={() => toggleSection("activity")}
              className="w-full flex items-center justify-between px-5 md:px-6 py-4"
            >
              <span className="text-[16px] md:text-[18px] font-semibold text-[#0C6E9A]">
                Your focus time
              </span>
              <span className="w-9 h-9 rounded-xl border-2 border-[#0C6E9A]/50 bg-white/40 flex items-center justify-center text-[#0C6E9A]">
                <ChevronDownIcon open={openSections.activity} />
              </span>
            </button>
            {openSections.activity && (
              <div className="px-5 md:px-6 pb-6 flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
                <div className="shrink-0">
                  <p className="text-[32px] md:text-[36px] font-bold text-[#0C6E9A] leading-none">
                    {getTotalPracticeTime()}{" "}
                    <span className="text-[16px]">mins</span>
                  </p>
                  <p className="text-[13px] font-medium text-[#0C6E9A]/60 mt-1">
                    Total practice time
                  </p>
                </div>
                {/* Real daily practice chart */}
                <div className="flex-1 h-20 flex items-end gap-[3px] min-w-0">
                  {(() => {
                    const days: { date: string; count: number }[] = [];
                    const counts: Record<string, number> = {};

                    userAnswers.forEach((progress) => {
                      if (!progress.lastAttemptedAt) return;
                      const key = new Date(
                        progress.lastAttemptedAt,
                      ).toDateString();
                      counts[key] = (counts[key] || 0) + 1;
                    });

                    for (let i = 29; i >= 0; i--) {
                      const d = new Date();
                      d.setDate(d.getDate() - i);
                      const key = d.toDateString();
                      days.push({ date: key, count: counts[key] || 0 });
                    }

                    const max = Math.max(...days.map((d) => d.count), 1);

                    return days.map((d, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-[#0C6E9A]"
                        style={{
                          height: `${Math.max((d.count / max) * 100, d.count > 0 ? 8 : 3)}%`,
                          opacity: d.count > 0 ? 1 : 0.25,
                        }}
                      />
                    ));
                  })()}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ---- Metrics row ---- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8"
        >
          <StatRow
            icon={<FlameIcon />}
            label="Streak"
            text={`${calculatePracticeStreak()} days`}
          />
          <StatRow
            icon={<TargetIcon />}
            label="Questions"
            text={`${userAnswers.length} answered`}
          />
          <StatRow
            icon={<CalendarIcon />}
            label="This week"
            text={`${getWeeklyQuestions()} questions`}
          />
          <StatRow
            icon={<span className="text-xl">🏆</span>}
            label="Daily goal"
            text={`${dailyGoal} questions`}
          />
        </motion.div>

        {/* ---- Recent activity ---- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10"
        >
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="text-[19px] font-semibold text-[#1D1D1F]">
              Recent activity
            </h2>
          </div>
          {userAnswers.length > 0 ? (
            <div>
              {userAnswers.slice(0, 5).map((progress, i) => {
                const isCorrect =
                  progress.attempts && progress.attempts.length > 0
                    ? progress.attempts[progress.attempts.length - 1].isCorrect
                    : false;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3.5 border-b border-[#F0F0F0] last:border-0"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-semibold text-[13px] ${isCorrect ? "bg-[#E4F8EA] text-[#1D8A3E]" : "bg-[#FDE9E7] text-[#D5271A]"}`}
                      >
                        {(progress.category || "Q").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium text-[#1D1D1F] truncate">
                          Question #
                          {progress.questionId?.substring(0, 6) || "ID"}
                        </p>
                        <p className="text-[13px] text-[#8e8e93]">
                          {progress.lastAttemptedAt
                            ? new Date(
                                progress.lastAttemptedAt,
                              ).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[14px] font-semibold shrink-0 ml-3 ${isCorrect ? "text-[#1D8A3E]" : "text-[#D5271A]"}`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-[#F7F7F8] rounded-2xl">
              <p className="text-[#8e8e93] mb-1">No recent activity yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
