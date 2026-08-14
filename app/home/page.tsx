"use client";

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
import { auth, db } from "lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
};

// --- Reusable Components ---
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
    <div className="w-[24px] h-[24px] shrink-0 flex items-center justify-center text-[#8e8e93] group-hover:text-[#2c2c2e] transition-colors mt-0.5">
      {icon}
    </div>
    <div className="flex flex-col">
      {label && (
        <span className="text-[13px] font-medium text-[#8e8e93] mb-0.5">
          {label}
        </span>
      )}
      <span className="text-[17px] font-medium text-[#2c2c2e]">{text}</span>
    </div>
  </div>
);

// --- Minimalist Icons matching the reference image style ---
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

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
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
      if (!auth?.currentUser) return;
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
      if (!auth?.currentUser) return;

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
    if (!auth?.currentUser || !newExamDate) return;
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
    if (!auth?.currentUser || newScore === "") return;
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

  if (isLoading) {
    return (
      <section className="min-h-screen bg-white font-sans pt-8 pb-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-[1000px] mx-auto w-full">
          {/* Skeleton loading matching the redesigned layout */}
          <div className="mb-16 md:mb-20">
            <div
              className={`h-12 md:h-16 bg-[#f5f5f5] rounded w-3/4 ${reduce ? "" : "animate-pulse"}`}
            />
          </div>
          <div
            className={`w-full min-h-[280px] md:min-h-[320px] bg-[#f5f5f5] rounded-lg mb-16 md:mb-20 ${reduce ? "" : "animate-pulse"}`}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-20">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div
                  className={`h-4 bg-[#f5f5f5] rounded w-1/2 mb-2 ${reduce ? "" : "animate-pulse"}`}
                />
                <div
                  className={`h-10 bg-[#f5f5f5] rounded w-3/4 ${reduce ? "" : "animate-pulse"}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const userName = userData?.name || userData?.email?.split("@")[0] || "Guest";
  const currentScore =
    userData?.bestTotalScore ||
    (userData?.bestRwScore && userData?.bestMathScore
      ? userData.bestRwScore + userData.bestMathScore
      : "-");

  return (
    <section className="min-h-screen bg-white font-sans pt-8 pb-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-[1000px] mx-auto w-full">
        {/* Greeting - Editorial typography with generous whitespace */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1D1D1F] leading-[1.1]">
            {getGreeting()}, {userName}.
          </h1>
        </motion.div>

        {/* Primary Study Area - Large editorial surface */}
        <Link
          href="/practice"
          className="block group outline-none mb-12 md:mb-16"
        >
          <motion.div
            whileHover={reduce ? undefined : { scale: 0.99 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            transition={reduce ? { duration: 0 } : spring}
            className="w-full min-h-[280px] md:min-h-[320px] bg-[#1c1c1e] p-8 md:p-12 flex flex-col justify-between relative"
          >
            <div>
              <span className="text-white/40 font-medium text-xs tracking-[0.2em] uppercase mb-4 block">
                Practice
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
                Resume your practice
              </h2>
            </div>
            <div className="flex justify-end">
              <div
                className={`w-12 h-12 md:w-14 md:h-14 bg-white text-[#1D1D1F] rounded-full flex items-center justify-center ${reduce ? "" : "group-hover:scale-105"} transition-transform duration-300`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="translate-x-0.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Secondary Metrics - Typography-based row */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
          className="mb-12 md:mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-2">
                Streak
              </p>
              <p className="text-3xl md:text-4xl font-semibold text-[#1D1D1F]">
                {practiceStreak}
                <span className="text-lg md:text-xl font-normal text-[#8e8e93] ml-1">
                  days
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-2">
                Questions
              </p>
              <p className="text-3xl md:text-4xl font-semibold text-[#1D1D1F]">
                {totalQuestions}
                <span className="text-lg md:text-xl font-normal text-[#8e8e93] ml-1">
                  answered
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-2">
                This Week
              </p>
              <p className="text-3xl md:text-4xl font-semibold text-[#1D1D1F]">
                {weeklyQuestions}
                <span className="text-lg md:text-xl font-normal text-[#8e8e93] ml-1">
                  questions
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-2">
                Daily Goal
              </p>
              <p className="text-3xl md:text-4xl font-semibold text-[#1D1D1F]">
                {dailyGoal}
                <span className="text-lg md:text-xl font-normal text-[#8e8e93] ml-1">
                  questions
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Start + Performance/Focus - Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Quick Start - Minimal editorial list */}
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.6, delay: 0.2 }
            }
          >
            <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-6">
              Quick Start
            </p>
            <div className="space-y-1">
              <Link href="/practice/rw" className="group block">
                <div
                  className={`flex items-center justify-between py-4 border-b border-[#e5e5ea] ${reduce ? "" : "group-hover:bg-[#f9f9f9]"} transition-colors px-2 -mx-2`}
                >
                  <span className="text-[17px] font-medium text-[#1D1D1F]">
                    5-Minute Warmup
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-[#8e8e93] ${reduce ? "" : "group-hover:text-[#1D1D1F]"} transition-colors`}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
              <Link href="/practice/rw" className="group block">
                <div
                  className={`flex items-center justify-between py-4 border-b border-[#e5e5ea] ${reduce ? "" : "group-hover:bg-[#f9f9f9]"} transition-colors px-2 -mx-2`}
                >
                  <span className="text-[17px] font-medium text-[#1D1D1F]">
                    Full Session
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-[#8e8e93] ${reduce ? "" : "group-hover:text-[#1D1D1F]"} transition-colors`}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
              <Link href="/history" className="group block">
                <div
                  className={`flex items-center justify-between py-4 ${reduce ? "" : "group-hover:bg-[#f9f9f9]"} transition-colors px-2 -mx-2`}
                >
                  <span className="text-[17px] font-medium text-[#1D1D1F]">
                    Review History
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-[#8e8e93] ${reduce ? "" : "group-hover:text-[#1D1D1F]"} transition-colors`}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Performance/Focus - Combined quieter section */}
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.6, delay: 0.3 }
            }
          >
            <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-6">
              Focus
            </p>
            <div className="border border-[#e5e5ea] rounded-lg p-6 md:p-8">
              <div className="mb-6">
                <p className="text-[17px] font-medium text-[#1D1D1F] mb-2">
                  {getSuggestedFocus()}
                </p>
                <p className="text-sm text-[#8e8e93]">
                  Based on your performance
                </p>
              </div>
              {getWeakAreas().length > 0 && (
                <div className="pt-6 border-t border-[#e5e5ea]">
                  <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-4">
                    Areas to improve
                  </p>
                  <div className="space-y-3">
                    {getWeakAreas().map((area, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-[#1D1D1F]">
                          {area.domain}
                        </span>
                        <span className="text-sm font-medium text-[#8e8e93]">
                          {Math.round(area.accuracy)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Performance Note + Score - Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Performance Note - Short editorial */}
          {userAnswers.length > 0 && (
            <motion.div
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.6, delay: 0.4 }
              }
            >
              <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-4">
                Personal Note
              </p>
              <div className="text-[15px] text-[#1D1D1F] leading-relaxed">
                <p className="mb-2">
                  Your accuracy is{" "}
                  <span className="font-semibold">
                    {Math.round(
                      (userAnswers.filter((a) => a.isCorrect).length /
                        userAnswers.length) *
                        100,
                    )}
                    %
                  </span>
                  .
                </p>
                <p>
                  Focus next on{" "}
                  <span className="font-semibold">
                    {getWeakAreas().length > 0
                      ? getWeakAreas()[0]?.domain
                      : "all domains"}
                  </span>
                  , where your accuracy is currently{" "}
                  <span className="font-semibold">
                    {getWeakAreas().length > 0
                      ? Math.round(getWeakAreas()[0]?.accuracy)
                      : 0}
                    %
                  </span>
                  .
                </p>
                <Link
                  href="/practice/rw"
                  className={`inline-block mt-4 text-sm font-medium text-[#0071E3] ${reduce ? "" : "hover:text-[#0077ED]"} transition-colors`}
                >
                  Continue practicing →
                </Link>
              </div>
            </motion.div>
          )}

          {/* Score - Editorial typography presentation */}
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.6, delay: 0.5 }
            }
          >
            <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-6">
              Score
            </p>
            <div className="space-y-6">
              <div className="flex items-baseline justify-between pb-4 border-b border-[#e5e5ea]">
                <span className="text-[15px] text-[#8e8e93]">
                  Reading & Writing
                </span>
                <span className="text-2xl md:text-3xl font-semibold text-[#1D1D1F]">
                  {userData?.bestRwScore || "-"}
                </span>
              </div>
              <div className="flex items-baseline justify-between pb-4 border-b border-[#e5e5ea]">
                <span className="text-[15px] text-[#8e8e93]">Math</span>
                <span className="text-2xl md:text-3xl font-semibold text-[#1D1D1F]">
                  {userData?.bestMathScore || "-"}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <span className="text-[15px] font-medium text-[#1D1D1F]">
                  Total
                </span>
                <span className="text-4xl md:text-5xl font-semibold text-[#1D1D1F]">
                  {currentScore}
                  <span className="text-lg md:text-xl font-normal text-[#8e8e93] ml-2">
                    / 1600
                  </span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Achievements - Compact secondary section */}
        {achievements.length > 0 && (
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.6, delay: 0.55 }
            }
            className="mb-12 md:mb-16"
          >
            <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-4">
              Achievements
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex-shrink-0 border border-[#e5e5ea] rounded-lg p-3 min-w-[120px]"
                >
                  <div className="text-lg mb-1">{achievement.icon}</div>
                  <div className="text-xs font-medium text-[#1D1D1F]">
                    {achievement.name}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Study Plan + Recent Activity - Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Study Plan - Editorial checklist */}
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.6, delay: 0.65 }
            }
          >
            <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-6">
              Today's Plan
            </p>
            <div className="space-y-0">
              {getStudyPlan().map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 py-4 border-b border-[#e5e5ea] last:border-0"
                >
                  <span className="text-xs font-medium text-[#8e8e93] w-6">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-[#1D1D1F]">
                      {item.title}
                    </p>
                    <p className="text-sm text-[#8e8e93]">{item.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity - Simplified timeline */}
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.6, delay: 0.7 }
            }
          >
            <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-6">
              Recent Activity
            </p>
            {userAnswers.length > 0 ? (
              <div className="space-y-0">
                {userAnswers.slice(0, 5).map((answer, index) => (
                  <div
                    key={answer.id}
                    className="flex items-start gap-4 py-4 border-b border-[#e5e5ea] last:border-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        answer.isCorrect ? "bg-[#34c759]" : "bg-[#ff3b30]"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[15px] font-medium text-[#1D1D1F] truncate">
                          {answer.category}
                        </span>
                        <span className="text-xs text-[#8e8e93] flex-shrink-0 ml-2">
                          {answer.timestamp
                            ? new Date(answer.timestamp).toLocaleDateString()
                            : "Recently"}
                        </span>
                      </div>
                      <p className="text-sm text-[#8e8e93] line-clamp-1">
                        {answer.question}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#8e8e93]">No recent activity yet</p>
                <Link
                  href="/practice"
                  className="text-sm font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors"
                >
                  Start practicing
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions - Compact navigation */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.75 }}
          className="mb-8 md:mb-12"
        >
          <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-6">
            Quick Actions
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/resources"
              className={`px-4 py-2 border border-[#e5e5ea] rounded-lg text-sm text-[#1D1D1F] ${reduce ? "" : "hover:bg-[#f9f9f9]"} transition-colors`}
            >
              Resources
            </Link>
            <Link
              href="/history"
              className={`px-4 py-2 border border-[#e5e5ea] rounded-lg text-sm text-[#1D1D1F] ${reduce ? "" : "hover:bg-[#f9f9f9]"} transition-colors`}
            >
              History
            </Link>
            <Link
              href="/practice/analytics"
              className={`px-4 py-2 border border-[#e5e5ea] rounded-lg text-sm text-[#1D1D1F] ${reduce ? "" : "hover:bg-[#f9f9f9]"} transition-colors`}
            >
              Analytics
            </Link>
            <Link
              href="/settings"
              className={`px-4 py-2 border border-[#e5e5ea] rounded-lg text-sm text-[#1D1D1F] ${reduce ? "" : "hover:bg-[#f9f9f9]"} transition-colors`}
            >
              Settings
            </Link>
          </div>
        </motion.div>

        {/* Score Trend */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.8 }}
          className="mb-8 md:mb-12"
        >
          <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-6">
            Score Trend
          </p>
          {userAnswers.length > 0 ? (
            <div className="bg-[#f5f5f5] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[15px] font-medium text-[#1D1D1F]">
                  Performance Over Time
                </span>
                <span className="text-xs text-[#8e8e93]">Last 7 days</span>
              </div>
              <div className="h-24 flex items-end gap-1 mb-4">
                {getScoreTrend().map((point, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full bg-[#0071E3] rounded-t-sm transition-all duration-300"
                      style={{ height: `${Math.max(point.percentage, 10)}%` }}
                    />
                    <span className="text-xs text-[#8e8e93]">
                      {point.score}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-around pt-4 border-t border-[#e5e5ea]">
                <div className="text-center">
                  <div className="text-lg font-semibold text-[#1D1D1F]">
                    {getScoreTrend()[getScoreTrend().length - 1]?.score || 0}%
                  </div>
                  <div className="text-xs text-[#8e8e93]">Latest</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${getScoreImprovement() >= 0 ? "text-[#34c759]" : "text-[#ff3b30]"}`}
                  >
                    {getScoreImprovement() > 0 ? "+" : ""}
                    {getScoreImprovement()}%
                  </div>
                  <div className="text-xs text-[#8e8e93]">Change</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-[#0071E3]">
                    {getAverageScore()}%
                  </div>
                  <div className="text-xs text-[#8e8e93]">Average</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-[#f5f5f5] rounded-2xl">
              <p className="text-[#8e8e93]">
                Practice more to see your score trend
              </p>
            </div>
          )}
        </motion.div>

        {/* Leaderboard Position */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.85 }}
          className="mb-8 md:mb-12"
        >
          <p className="text-xs font-medium text-[#8e8e93] uppercase tracking-wider mb-6">
            Leaderboard
          </p>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <div className="text-[15px] font-medium text-[#1D1D1F]">
                    Your Rank
                  </div>
                  <div className="text-xs text-[#8e8e93]">
                    Global Leaderboard
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-amber-600">
                  #{getLeaderboardPosition()}
                </div>
                <div className="text-xs text-[#8e8e93]">
                  {getLeaderboardPercentile()}th percentile
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-amber-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8e8e93]">Points needed to advance</span>
                <span className="font-medium text-[#1D1D1F]">
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
