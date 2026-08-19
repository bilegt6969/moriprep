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
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
};

// =========================================================
// Icons — single-weight, minimal, matching the reference UI
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

const BarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    className="w-[14px] h-[14px]"
  >
    <path d="M5 19V11M12 19V5M19 19v-7" />
  </svg>
);

const FlameIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px]">
    <path d="M12.75 2.25c.35 3.1-1.02 5.1-2.6 6.83-1.6 1.75-3.4 3.9-3.4 7.17a5.25 5.25 0 0010.5 0c0-1.9-.72-3-1.35-3.9-.2 1.55-1 2.5-1.9 2.5-1.15 0-1.7-.95-1.5-2.15.35-2 2.35-3.35 2.35-6.3 0-1.5-.6-2.85-2.1-4.15z" />
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

const PencilIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[13px] h-[13px]"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

// Kept from the original build — now used across the stat rows below
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px]">
    <path
      fillRule="evenodd"
      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
      clipRule="evenodd"
    />
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

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px]">
    <path
      fillRule="evenodd"
      d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l4.5-6.25z"
      clipRule="evenodd"
    />
  </svg>
);

// Reusable icon + label + value row (kept from the original build, now in use)
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

export default function HomePage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  // States for Stats
  const [timeToExam, setTimeToExam] = useState<any>(null);
  const [isEditingExamDate, setIsEditingExamDate] = useState(false);
  const [newExamDate, setNewExamDate] = useState<string>("");
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [newScore, setNewScore] = useState<string>("");

  // New states for enhanced features
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [practiceStreak, setPracticeStreak] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [weeklyQuestions, setWeeklyQuestions] = useState<number>(0);
  const [dailyGoal, setDailyGoal] = useState<number>(10);
  const [achievements, setAchievements] = useState<any[]>([]);

  // UI-only state for the redesign — accordions + "hide score" toggle
  const [openSections, setOpenSections] = useState<{
    quickStart: boolean;
    focus: boolean;
  }>({
    quickStart: true,
    focus: true,
  });
  const [hideScore, setHideScore] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<string>("");

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = (auth as Auth).onAuthStateChanged((user: any) => {
      // Temporarily disabled auth check
      // if (!user) {
      //   router.replace("/sign-in?next=/home");
      //   return;
      // }
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Load cached data from localStorage immediately
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
          const data = userDoc.data();
          setUserData(data);
          // Cache the data for instant loading on navigation
          localStorage.setItem("cachedUserData", JSON.stringify(data));

          if (data.satTestDates && data.satTestDates.length > 0) {
            const nextExamDate = new Date(data.satTestDates[0]);
            const now = new Date();
            const diff = nextExamDate.getTime() - now.getTime();

            if (diff > 0) {
              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              setTimeToExam({ days, examDate: nextExamDate });
            }
          }

          // Set daily goal from user data or default
          setDailyGoal(data.dailyGoal || 10);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch user answers for real-time stats
    const fetchUserAnswers = () => {
      if (!auth?.currentUser || !db) return;

      const q = query(
        collection(db, "userAnswers"),
        where("userId", "==", auth.currentUser.uid),
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot: any) => {
          const answers = querySnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setUserAnswers(answers);

          // Calculate stats
          const total = answers.length;
          setTotalQuestions(total);

          // Calculate practice streak
          const streak = calculatePracticeStreak(answers);
          setPracticeStreak(streak);

          // Calculate weekly questions
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const weekly = answers.filter((a: any) => {
            const answerDate = a.timestamp ? new Date(a.timestamp) : new Date();
            return answerDate >= oneWeekAgo;
          }).length;
          setWeeklyQuestions(weekly);

          // Calculate achievements
          const newAchievements = calculateAchievements(answers, streak);
          setAchievements(newAchievements);
        },
        (error: any) => {
          console.error("Error fetching user answers:", error);
        },
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
  }, [isAuthenticated]);

  const calculatePracticeStreak = (answers: any[]) => {
    if (answers.length === 0) return 0;

    const dates = answers
      .map((a) => (a.timestamp ? new Date(a.timestamp).toDateString() : null))
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
        // Allow for one day gap
        streak++;
        currentDate = new Date(answerDate);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateAchievements = (answers: any[], streak: number) => {
    const achievements = [];

    if (answers.length >= 10)
      achievements.push({
        id: "first_10",
        name: "First Steps",
        icon: "🎯",
        description: "Answered 10 questions",
      });
    if (answers.length >= 50)
      achievements.push({
        id: "half_century",
        name: "Half Century",
        icon: "🏆",
        description: "Answered 50 questions",
      });
    if (answers.length >= 100)
      achievements.push({
        id: "century",
        name: "Century",
        icon: "💯",
        description: "Answered 100 questions",
      });
    if (streak >= 3)
      achievements.push({
        id: "streak_3",
        name: "3-Day Streak",
        icon: "🔥",
        description: "Practiced 3 days in a row",
      });
    if (streak >= 7)
      achievements.push({
        id: "streak_7",
        name: "Week Warrior",
        icon: "⚡",
        description: "Practiced 7 days in a row",
      });
    if (streak >= 30)
      achievements.push({
        id: "streak_30",
        name: "Monthly Master",
        icon: "👑",
        description: "Practiced 30 days in a row",
      });

    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    if (correctAnswers >= 20 && correctAnswers / answers.length >= 0.8) {
      achievements.push({
        id: "accuracy_master",
        name: "Accuracy Master",
        icon: "🎯",
        description: "80%+ accuracy with 20+ questions",
      });
    }

    return achievements;
  };

  const getWeakAreas = () => {
    if (!userAnswers.length) return [];

    const domainStats: any = {};
    userAnswers.forEach((answer) => {
      const domain = answer.domain || "General";
      if (!domainStats[domain]) {
        domainStats[domain] = { correct: 0, total: 0 };
      }
      domainStats[domain].total++;
      if (answer.isCorrect) {
        domainStats[domain].correct++;
      }
    });

    const weakAreas = Object.entries(domainStats)
      .map(([domain, stats]: [string, any]) => ({
        domain,
        accuracy: (stats.correct / stats.total) * 100,
        total: stats.total,
      }))
      .filter((item) => item.total >= 3)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);

    return weakAreas;
  };

  const getSuggestedFocus = () => {
    const weakAreas = getWeakAreas();
    if (weakAreas.length === 0)
      return "Start practicing to get personalized recommendations";

    const weakest = weakAreas[0];
    return `Focus on ${weakest.domain} (${Math.round(weakest.accuracy)}% accuracy)`;
  };

  const getMotivationalMessage = () => {
    if (practiceStreak >= 7) return "You're on fire! 🔥";
    if (practiceStreak >= 3) return "Amazing consistency!";
    if (totalQuestions >= 100) return "Century club member!";
    if (totalQuestions >= 50) return "Building great habits!";
    if (totalQuestions >= 10) return "Great start!";
    return "Your journey begins now!";
  };

  const getMotivationalSubtext = () => {
    if (practiceStreak >= 7)
      return `${practiceStreak} day streak - keep the momentum going!`;
    if (practiceStreak >= 3)
      return `${practiceStreak} days in a row - you're building a strong foundation!`;
    if (totalQuestions >= 100)
      return `${totalQuestions} questions answered - dedication pays off!`;
    if (totalQuestions >= 50)
      return `${totalQuestions} questions down - you're making real progress!`;
    if (totalQuestions >= 10)
      return `${totalQuestions} questions completed - every question counts!`;
    return "Start your SAT prep journey today!";
  };

  const getStudyPlan = () => {
    const hour = new Date().getHours();
    const weakAreas = getWeakAreas();
    const focusArea =
      weakAreas.length > 0 ? weakAreas[0]?.domain : "Reading & Writing";

    let plan = [];

    if (hour < 12) {
      // Morning plan
      plan = [
        {
          title: `Practice ${focusArea}`,
          duration: "15 minutes",
          type: "Practice",
          completed: false,
        },
        {
          title: "Review mistakes",
          duration: "10 minutes",
          type: "Review",
          completed: false,
        },
        {
          title: "Quick vocab drill",
          duration: "5 minutes",
          type: "Drill",
          completed: false,
        },
      ];
    } else if (hour < 18) {
      // Afternoon plan
      plan = [
        {
          title: "Full practice session",
          duration: "30 minutes",
          type: "Practice",
          completed: false,
        },
        {
          title: "Analyze weak areas",
          duration: "15 minutes",
          type: "Analysis",
          completed: false,
        },
        {
          title: "Take a short break",
          duration: "5 minutes",
          type: "Break",
          completed: false,
        },
      ];
    } else {
      // Evening plan
      plan = [
        {
          title: "Light review session",
          duration: "20 minutes",
          type: "Review",
          completed: false,
        },
        {
          title: "Study flashcards",
          duration: "10 minutes",
          type: "Study",
          completed: false,
        },
        {
          title: "Plan tomorrow's goals",
          duration: "5 minutes",
          type: "Planning",
          completed: false,
        },
      ];
    }

    return plan;
  };

  const getScoreTrend = () => {
    if (userAnswers.length === 0) return [];

    // Group answers by date and calculate daily accuracy
    const dailyScores: any = {};
    userAnswers.forEach((answer) => {
      const date = answer.timestamp
        ? new Date(answer.timestamp).toLocaleDateString()
        : "Today";
      if (!dailyScores[date]) {
        dailyScores[date] = { correct: 0, total: 0 };
      }
      dailyScores[date].total++;
      if (answer.isCorrect) {
        dailyScores[date].correct++;
      }
    });

    const trend = Object.entries(dailyScores)
      .slice(-7)
      .map(([date, stats]: [string, any]) => ({
        label: date === new Date().toLocaleDateString() ? "Today" : date,
        score: Math.round((stats.correct / stats.total) * 100),
        percentage: (stats.correct / stats.total) * 100,
      }));

    return trend;
  };

  const getScoreImprovement = () => {
    const trend = getScoreTrend();
    if (trend.length < 2) return 0;
    const latest = trend[trend.length - 1].score;
    const previous = trend[0].score;
    return latest - previous;
  };

  const getAverageScore = () => {
    const trend = getScoreTrend();
    if (trend.length === 0) return 0;
    const sum = trend.reduce((acc, point) => acc + point.score, 0);
    return Math.round(sum / trend.length);
  };

  const getLeaderboardPosition = () => {
    // Simulated leaderboard position based on total questions and accuracy
    const accuracy =
      userAnswers.length > 0
        ? (userAnswers.filter((a) => a.isCorrect).length / userAnswers.length) *
          100
        : 0;
    const score = totalQuestions * accuracy;
    const simulatedRank = Math.max(1, Math.floor(1000 - score / 10));
    return simulatedRank;
  };

  const getLeaderboardPercentile = () => {
    const rank = getLeaderboardPosition();
    const percentile = Math.max(1, Math.round((1 - rank / 1000) * 100));
    return percentile;
  };

  const getPointsToNextRank = () => {
    const currentRank = getLeaderboardPosition();
    const pointsNeeded = Math.max(0, (currentRank - 1) * 10);
    return pointsNeeded;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) return "Good late night";
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const handleExamDateUpdate = async () => {
    if (!auth?.currentUser || !newExamDate || !db) return;
    try {
      const examDate = new Date(newExamDate);
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        satTestDates: [examDate.toISOString()],
      });
      const now = new Date();
      const diff = examDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        setTimeToExam({ days, examDate });
      }
      setIsEditingExamDate(false);
      setNewExamDate("");
    } catch (error) {
      console.error("Error updating exam date:", error);
    }
  };

  const handleScoreUpdate = async () => {
    if (!auth?.currentUser || newScore === "" || !db) return;
    try {
      const scoreValue = parseInt(newScore);
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
    try {
      const goalValue = parseInt(newGoal);
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

  // All-domain breakdown (not just weak spots) — powers the "Your progress" table
  const getDomainStats = () => {
    if (!userAnswers.length) return [];

    const domainStats: any = {};
    userAnswers.forEach((answer) => {
      const domain = answer.domain || "General";
      if (!domainStats[domain]) {
        domainStats[domain] = { correct: 0, total: 0 };
      }
      domainStats[domain].total++;
      if (answer.isCorrect) {
        domainStats[domain].correct++;
      }
    });

    const total = userAnswers.length;
    return Object.entries(domainStats)
      .map(([domain, stats]: [string, any]) => ({
        domain,
        type: /math/i.test(domain) ? "Math" : "Reading & Writing",
        accuracy: (stats.correct / stats.total) * 100,
        share: (stats.total / total) * 100,
        total: stats.total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  // Daily question volume for the last 30 days — powers the "Practice activity" chart
  const getPractice30DayData = () => {
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

    const total = days.reduce((sum, d) => sum + d.count, 0);
    const max = Math.max(...days.map((d) => d.count), 1);
    return { days, total, max };
  };

  const toggleSection = (key: "quickStart" | "focus") =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  if (isLoading) {
    return (
      <section className="min-h-screen bg-white font-sans pt-8 pb-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1000px] mx-auto w-full space-y-6">
          <div className="h-[240px] bg-[#F5F5F5] rounded-[24px] animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 bg-[#F5F5F5] rounded-2xl animate-pulse"
              />
            ))}
          </div>
          <div className="h-64 bg-[#F5F5F5] rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  const userName = userData?.name || userData?.email?.split("@")[0] || "Guest";
  const userInitial = userName?.charAt(0)?.toUpperCase() || "G";
  const currentScore =
    userData?.bestTotalScore ||
    (userData?.bestRwScore && userData?.bestMathScore
      ? userData.bestRwScore + userData.bestMathScore
      : "-");
  const weakAreas = getWeakAreas();
  const scoreTrend = getScoreTrend();
  const domainStats = getDomainStats();
  const practice30 = getPractice30DayData();
  const accuracy =
    userAnswers.length > 0
      ? Math.round(
          (userAnswers.filter((a) => a.isCorrect).length / userAnswers.length) *
            100,
        )
      : 0;

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
                {getGreeting()}, {userName}.
              </h1>
              <p className="text-[15px] md:text-[16px] font-medium text-[#1D1D1F]/70 mt-2">
                {getMotivationalMessage()} {getMotivationalSubtext()}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                aria-label="Notifications"
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white transition-colors flex items-center justify-center text-[#1D1D1F]"
              >
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
                  Days to exam
                </p>
                {isEditingExamDate ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={newExamDate}
                      onChange={(e) => setNewExamDate(e.target.value)}
                      className="text-[14px] px-2 py-1 rounded-lg border border-[#1D1D1F]/20 bg-white/90 text-[#1D1D1F] focus:outline-none"
                    />
                    <button
                      onClick={handleExamDateUpdate}
                      className="text-[13px] font-semibold bg-[#1D1D1F] text-white px-3 py-1.5 rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingExamDate(false);
                        setNewExamDate("");
                      }}
                      className="text-[13px] font-medium text-[#1D1D1F]/60"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-[32px] md:text-[36px] font-bold text-[#1D1D1F] leading-none">
                    {timeToExam?.days ?? "—"}
                  </p>
                )}
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#1D1D1F]/60 mb-1">
                  Best score
                </p>
                {isEditingScore ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newScore}
                      onChange={(e) => setNewScore(e.target.value)}
                      placeholder="1600"
                      className="w-20 text-[14px] px-2 py-1 rounded-lg border border-[#1D1D1F]/20 bg-white/90 text-[#1D1D1F] focus:outline-none"
                    />
                    <button
                      onClick={handleScoreUpdate}
                      className="text-[13px] font-semibold bg-[#1D1D1F] text-white px-3 py-1.5 rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingScore(false);
                        setNewScore("");
                      }}
                      className="text-[13px] font-medium text-[#1D1D1F]/60"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingScore(true)}
                    className="flex items-center gap-1.5 group"
                  >
                    <span className="text-[32px] md:text-[36px] font-bold text-[#1D1D1F] leading-none">
                      {hideScore ? "••••" : currentScore}
                    </span>
                    <span className="text-[#1D1D1F]/40 group-hover:text-[#1D1D1F] transition-colors mb-1">
                      <PencilIcon />
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setHideScore((v) => !v)}
                className="flex items-center gap-1.5 text-[13px] font-medium text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition-colors"
              >
                {hideScore ? <EyeIcon /> : <EyeOffIcon />}
                {hideScore ? "Show score" : "Hide score"}
              </button>
              {!isEditingExamDate && (
                <button
                  onClick={() => setIsEditingExamDate(true)}
                  className="flex items-center gap-1 text-[13px] font-semibold bg-white/90 hover:bg-white transition-colors text-[#1D1D1F] px-3.5 py-2 rounded-full"
                >
                  <span className="text-[16px] leading-none">+</span> Set exam
                  date
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ---- Quick start row (kept as direct links, not buried in an accordion) ---- */}
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.05 }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {[
            { title: "5-Minute Warmup", href: "/practice/rw" },
            { title: "Full Session", href: "/practice/rw" },
            { title: "Review History", href: "/history" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-2 bg-[#F7F7F8] hover:bg-[#EFEFF0] transition-colors rounded-full pl-4 pr-3 py-2.5"
            >
              <span className="text-[14px] font-medium text-[#1D1D1F]">
                {item.title}
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#8e8e93]"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </motion.div>

        {/* ---- Accordion bars: Your progress (orange table) / Practice activity (blue chart) ---- */}
        <div className="mt-4 space-y-3">
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.4, delay: 0.1 }
            }
            className="rounded-[20px] bg-[#FBD9AE] overflow-hidden"
          >
            <button
              onClick={() => toggleSection("quickStart")}
              className="w-full flex items-center justify-between px-5 md:px-6 py-4"
            >
              <span className="text-[16px] md:text-[18px] font-semibold text-[#9A4A0C]">
                Your progress
              </span>
              <span className="w-9 h-9 rounded-xl border-2 border-[#9A4A0C]/50 bg-white/40 flex items-center justify-center text-[#9A4A0C]">
                <ChevronDownIcon open={openSections.quickStart} />
              </span>
            </button>
            {openSections.quickStart && (
              <div className="px-5 md:px-6 pb-6">
                {domainStats.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-4 gap-2 pb-3 text-[12px] font-medium text-[#9A4A0C]/60">
                      <span>Domain</span>
                      <span>Type</span>
                      <span>Accuracy</span>
                      <span className="text-right">Share</span>
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
                            {Math.round(row.accuracy)}
                            <span className="text-[12px] font-normal">%</span>
                          </span>
                          <span className="text-[15px] md:text-[17px] font-semibold text-[#9A4A0C] text-right">
                            {row.share.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[14px] text-[#9A4A0C]/70">
                    Answer a few questions to see your domain breakdown here.
                  </p>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.4, delay: 0.15 }
            }
            className="rounded-[20px] bg-[#AEE2F4] overflow-hidden"
          >
            <button
              onClick={() => toggleSection("focus")}
              className="w-full flex items-center justify-between px-5 md:px-6 py-4"
            >
              <span className="text-[16px] md:text-[18px] font-semibold text-[#0C6E9A]">
                Practice activity
              </span>
              <span className="w-9 h-9 rounded-xl border-2 border-[#0C6E9A]/50 bg-white/40 flex items-center justify-center text-[#0C6E9A]">
                <ChevronDownIcon open={openSections.focus} />
              </span>
            </button>
            {openSections.focus && (
              <div className="px-5 md:px-6 pb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
                  <div className="shrink-0">
                    {isEditingGoal ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          placeholder={String(dailyGoal)}
                          className="w-20 text-[14px] px-2 py-1 rounded-lg border border-[#0C6E9A]/30 bg-white/90 text-[#0C6E9A] focus:outline-none"
                        />
                        <button
                          onClick={handleGoalUpdate}
                          className="text-[13px] font-semibold bg-[#0C6E9A] text-white px-3 py-1.5 rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingGoal(false);
                            setNewGoal("");
                          }}
                          className="text-[13px] font-medium text-[#0C6E9A]/60"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-[32px] md:text-[36px] font-bold text-[#0C6E9A] leading-none">
                          {practice30.total}
                        </p>
                        <p className="text-[13px] font-medium text-[#0C6E9A]/60 mt-1">
                          last 30 days
                        </p>
                        <button
                          onClick={() => setIsEditingGoal(true)}
                          className="flex items-center gap-1.5 mt-3 text-[13px] font-medium text-[#0C6E9A]"
                        >
                          <BarIcon /> Set goal
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex-1 h-24 flex items-end gap-[3px] min-w-0">
                    {practice30.days.map((d, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-[#0C6E9A]"
                        style={{
                          height: `${Math.max((d.count / practice30.max) * 100, d.count > 0 ? 8 : 3)}%`,
                          opacity: d.count > 0 ? 1 : 0.25,
                        }}
                      />
                    ))}
                  </div>
                </div>
                {weakAreas.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-[#0C6E9A]/15 flex items-center justify-between">
                    <span className="text-[14px] text-[#0C6E9A]/80">
                      {getSuggestedFocus()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* ---- Metrics row ---- */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8"
        >
          <StatRow
            icon={<FlameIcon />}
            label="Streak"
            text={`${practiceStreak} days`}
          />
          <StatRow
            icon={<TargetIcon />}
            label="Questions"
            text={`${totalQuestions} answered`}
          />
          <StatRow
            icon={<CalendarIcon />}
            label="This week"
            text={`${weeklyQuestions} questions`}
          />
          <StatRow
            icon={<TrophyIcon />}
            label="Daily goal"
            text={`${dailyGoal} questions`}
          />
        </motion.div>

        {/* ---- Recent activity (transactions style list) ---- */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
          className="mt-10"
        >
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="text-[19px] font-semibold text-[#1D1D1F]">
              Recent activity
            </h2>
            <sup className="text-[12px] font-semibold text-[#8e8e93]">
              {totalQuestions}
            </sup>
          </div>
          {userAnswers.length > 0 ? (
            <div>
              {userAnswers.slice(0, 5).map((answer) => (
                <div
                  key={answer.id}
                  className="flex items-center justify-between py-3.5 border-b border-[#F0F0F0] last:border-0"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-semibold text-[13px] ${
                        answer.isCorrect
                          ? "bg-[#E4F8EA] text-[#1D8A3E]"
                          : "bg-[#FDE9E7] text-[#D5271A]"
                      }`}
                    >
                      {(answer.category || "Q").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-[#1D1D1F] truncate">
                        {answer.category || "Question"}
                      </p>
                      <p className="text-[13px] text-[#8e8e93]">
                        {answer.timestamp
                          ? new Date(answer.timestamp).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[14px] font-semibold shrink-0 ml-3 ${
                      answer.isCorrect ? "text-[#1D8A3E]" : "text-[#D5271A]"
                    }`}
                  >
                    {answer.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-[#F7F7F8] rounded-2xl">
              <p className="text-[#8e8e93] mb-1">No recent activity yet</p>
              <Link
                href="/practice"
                className="text-sm font-semibold text-[#1D1D1F] underline underline-offset-2"
              >
                Start practicing
              </Link>
            </div>
          )}
        </motion.div>

        {/* ---- Score breakdown + Personal note ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-10">
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.5, delay: 0.25 }
            }
          >
            <p className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider mb-4">
              Score
            </p>
            <div className="space-y-4 border border-[#ECECEC] rounded-2xl p-5">
              <div className="flex items-baseline justify-between pb-3 border-b border-[#F0F0F0]">
                <span className="text-[14px] text-[#8e8e93]">
                  Reading & Writing
                </span>
                <span className="text-xl font-semibold text-[#1D1D1F]">
                  {userData?.bestRwScore || "-"}
                </span>
              </div>
              <div className="flex items-baseline justify-between pb-3 border-b border-[#F0F0F0]">
                <span className="text-[14px] text-[#8e8e93]">Math</span>
                <span className="text-xl font-semibold text-[#1D1D1F]">
                  {userData?.bestMathScore || "-"}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] font-medium text-[#1D1D1F]">
                  Total
                </span>
                <span className="text-2xl font-bold text-[#1D1D1F]">
                  {currentScore}
                  <span className="text-[13px] font-normal text-[#8e8e93] ml-1">
                    /1600
                  </span>
                </span>
              </div>
            </div>
          </motion.div>

          {userAnswers.length > 0 && (
            <motion.div
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.5, delay: 0.3 }
              }
            >
              <p className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider mb-4">
                Personal note
              </p>
              <div className="border border-[#ECECEC] rounded-2xl p-5 text-[14px] text-[#1D1D1F] leading-relaxed">
                <p className="mb-2">
                  Your accuracy is{" "}
                  <span className="font-semibold">{accuracy}%</span>.
                </p>
                <p>
                  Focus next on{" "}
                  <span className="font-semibold">
                    {weakAreas.length > 0
                      ? weakAreas[0]?.domain
                      : "all domains"}
                  </span>
                  , currently at{" "}
                  <span className="font-semibold">
                    {weakAreas.length > 0
                      ? Math.round(weakAreas[0]?.accuracy)
                      : 0}
                    %
                  </span>
                  .
                </p>
                <Link
                  href="/practice/rw"
                  className="inline-block mt-4 text-[13px] font-semibold text-[#1D1D1F] underline underline-offset-2"
                >
                  Continue practicing →
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* ---- Achievements ---- */}
        {achievements.length > 0 && (
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.5, delay: 0.35 }
            }
            className="mt-10"
          >
            <p className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider mb-4">
              Achievements
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex-shrink-0 border border-[#ECECEC] rounded-2xl p-4 min-w-[130px]"
                >
                  <div className="text-xl mb-1.5">{achievement.icon}</div>
                  <div className="text-[13px] font-semibold text-[#1D1D1F]">
                    {achievement.name}
                  </div>
                  <div className="text-[11px] text-[#8e8e93] mt-0.5">
                    {achievement.description}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ---- Study plan + Quick actions ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-10">
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.5, delay: 0.4 }
            }
          >
            <p className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider mb-4">
              Today's plan
            </p>
            <div>
              {getStudyPlan().map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 py-3.5 border-b border-[#F0F0F0] last:border-0"
                >
                  <span className="text-[12px] font-semibold text-[#8e8e93] w-6">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-[#1D1D1F]">
                      {item.title}
                    </p>
                    <p className="text-[13px] text-[#8e8e93]">
                      {item.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.5, delay: 0.45 }
            }
          >
            <p className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider mb-4">
              Quick actions
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Resources", href: "/resources" },
                { label: "History", href: "/history" },
                { label: "Analytics", href: "/practice/analytics" },
                { label: "Settings", href: "/settings" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="px-4 py-2 border border-[#ECECEC] rounded-full text-[13px] font-medium text-[#1D1D1F] hover:bg-[#F7F7F8] transition-colors"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ---- Score trend ---- */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.5 }}
          className="mt-10"
        >
          <p className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider mb-4">
            Score trend
          </p>
          {userAnswers.length > 0 ? (
            <div className="bg-[#F7F7F8] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-semibold text-[#1D1D1F]">
                  Performance over time
                </span>
                <span className="text-[12px] text-[#8e8e93]">Last 7 days</span>
              </div>
              <div className="h-24 flex items-end gap-1.5 mb-4">
                {scoreTrend.map((point, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full bg-[#1D1D1F] rounded-t-sm transition-all duration-300"
                      style={{ height: `${Math.max(point.percentage, 10)}%` }}
                    />
                    <span className="text-[11px] text-[#8e8e93]">
                      {point.score}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-around pt-4 border-t border-[#E5E5EA]">
                <div className="text-center">
                  <div className="text-[17px] font-bold text-[#1D1D1F]">
                    {scoreTrend[scoreTrend.length - 1]?.score || 0}%
                  </div>
                  <div className="text-[11px] text-[#8e8e93]">Latest</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-[17px] font-bold ${
                      getScoreImprovement() >= 0
                        ? "text-[#1D8A3E]"
                        : "text-[#D5271A]"
                    }`}
                  >
                    {getScoreImprovement() > 0 ? "+" : ""}
                    {getScoreImprovement()}%
                  </div>
                  <div className="text-[11px] text-[#8e8e93]">Change</div>
                </div>
                <div className="text-center">
                  <div className="text-[17px] font-bold text-[#1D1D1F]">
                    {getAverageScore()}%
                  </div>
                  <div className="text-[11px] text-[#8e8e93]">Average</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-[#F7F7F8] rounded-2xl">
              <p className="text-[#8e8e93]">
                Practice more to see your score trend
              </p>
            </div>
          )}
        </motion.div>

        {/* ---- Leaderboard ---- */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.55 }}
          className="mt-10"
        >
          <p className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider mb-4">
            Leaderboard
          </p>
          <div className="bg-gradient-to-br from-[#FFF3D6] to-[#FFE3A8] rounded-2xl p-6 border border-[#F3DDA3]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FFC300] to-[#FF9F00] rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1D1D1F]">
                    Your rank
                  </div>
                  <div className="text-[12px] text-[#8e8e93]">
                    Global leaderboard
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#B8860B]">
                  #{getLeaderboardPosition()}
                </div>
                <div className="text-[12px] text-[#8e8e93]">
                  {getLeaderboardPercentile()}th percentile
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#F3DDA3]">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#8e8e93]">Points needed to advance</span>
                <span className="font-semibold text-[#1D1D1F]">
                  {getPointsToNextRank()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
