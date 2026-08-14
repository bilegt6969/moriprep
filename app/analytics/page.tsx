"use client";

import { RecentActivityPopup } from "@/components/analytics/recent-activity-popup";
import { HelpPopover } from "@/components/ui/help-popover";
import { getUserProgress, getUserStats } from "@/lib/dsat/questions";
import { auth } from "@/lib/firebase";
import { UserProgress, UserStats } from "@/types/dsat";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Subtle, Apple-like easing
const customEase = [0.25, 1, 0.5, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: customEase },
  },
};

// Flame animation for streak
const flameVariants = {
  idle: { rotate: 0, scale: 1 },
  burning: {
    rotate: [-5, 5, -5, 5, 0],
    scale: [1, 1.1, 1, 1.1, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  },
};

// Circular Progress Component (Inspired by Screenshot 12.21.34 & 12.21.52)
const CircularProgress = ({ value }: { value: number }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Background Track */}
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-100"
        />
        {/* Progress Ring */}
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: customEase }}
          strokeLinecap="round"
          className={
            value >= 80
              ? "text-green-500"
              : value >= 50
                ? "text-yellow-500"
                : "text-red-500"
          }
        />
      </svg>
      <div className="absolute flex items-center justify-center text-xl font-bold tracking-tight text-gray-900">
        {Math.round(value)}
      </div>
    </div>
  );
};

// Flame Icon Component for Streak
const FlameIcon = ({ active }: { active: boolean }) => (
  <motion.div
    variants={flameVariants}
    animate={active ? "burning" : "idle"}
    className={`w-8 h-8 ${active ? "text-orange-500" : "text-gray-300"}`}
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 23c-3.5 0-6.5-2-8-5 0-3 2-5 2-5s-2 1-3 2c0-3 2-5 4-7 0-2 1-4 2-6 2 2 3 4 3 6 2-2 4-3 6-3 2 0 4 1 5 3 1-2 2-4 2-6 0 2 1 4 1 6-1 3-3 5-6 5z" />
    </svg>
  </motion.div>
);

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActivityPopupOpen, setIsActivityPopupOpen] = useState(false);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          fetchUserData(currentUser.uid);
        } else {
          setLoading(false);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  async function fetchUserData(userId: string) {
    try {
      const [userStats, userProgress] = await Promise.all([
        getUserStats(userId),
        getUserProgress(userId),
      ]);
      setStats(userStats);
      setProgress(userProgress);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-lg font-medium text-gray-400 tracking-tight">
          Loading insights...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-6">
        <div className="text-center max-w-md bg-white p-10 rounded-[2rem] shadow-sm">
          <h2 className="text-2xl font-semibold mb-3 tracking-tight text-gray-900">
            Sign in to view your progress
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Track your accuracy, practice time, and watch your daily streaks
            grow.
          </p>
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full py-4 bg-black text-white rounded-2xl font-medium tracking-tight hover:bg-neutral-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const accuracy = stats
    ? ((stats.correctAnswers ?? 0) / (stats.totalQuestions ?? 1)) * 100 || 0
    : 0;

  const totalTimeMs = progress.reduce((total, item) => {
    return (
      total +
      item.attempts.reduce((attemptTotal, attempt) => {
        return attemptTotal + attempt.timeSpent;
      }, 0)
    );
  }, 0);

  const practiceTimeMinutes = Math.floor(totalTimeMs / 60000);
  const practiceTimeHours = Math.floor(practiceTimeMinutes / 60);
  const practiceTimeRemainingMinutes = practiceTimeMinutes % 60;
  const streak = calculateStreak(progress);
  const domainPerformance = calculateDomainPerformance(progress);

  // Formatting date for header (Inspired by Screenshot 12.22.06)
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Calculate weekly accuracy trend
  const weeklyTrend = calculateWeeklyTrend(progress);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans pb-24 selection:bg-blue-200">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-6 pt-20"
      >
        {/* Conversational Header (Inspired by Screenshot 12.21.52 & 12.22.06) */}
        <motion.div variants={fadeInUp} className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-black">
              {greeting}
              <span className="text-red-500">.</span>
            </h2>
            <span className="text-gray-400 font-medium tracking-tight">
              {today.split(",")[1]}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-800 leading-[1.2] max-w-3xl">
            You have answered{" "}
            <span className="text-black font-semibold">
              {stats?.totalQuestions || 0} questions
            </span>
            , maintained a{" "}
            <span className="text-black font-semibold">
              {streak}-day streak
            </span>
            , and your accuracy is currently{" "}
            <span className="italic text-black font-semibold">
              {accuracy.toFixed(1)}%
            </span>
            .
          </h1>
        </motion.div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Accuracy Card with Circular Progress */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-[2rem] p-8 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1 tracking-tight">
                Accuracy Rate
              </h3>
              <p className="text-3xl font-semibold text-gray-900 tracking-tight">
                {accuracy.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 mt-2 font-medium">
                {stats?.correctAnswers || 0} correct
              </p>
            </div>
            <CircularProgress value={accuracy} />
            <div className="absolute top-4 right-4">
              <HelpPopover
                title="Accuracy Rate"
                content="Your overall accuracy across all practice questions. Higher accuracy indicates better understanding of the material."
                position="left"
              />
            </div>
          </motion.div>

          {/* Time Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-[2rem] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-center relative"
          >
            <h3 className="text-sm font-medium text-gray-400 mb-1 tracking-tight">
              Total Focus Time
            </h3>
            <p className="text-3xl font-semibold text-gray-900 tracking-tight flex items-baseline gap-1">
              {practiceTimeHours > 0 && (
                <span>
                  {practiceTimeHours}
                  <span className="text-xl text-gray-400 ml-1">h</span>
                </span>
              )}
              <span>
                {practiceTimeRemainingMinutes}
                <span className="text-xl text-gray-400 ml-1">m</span>
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2 font-medium">All time</p>
            <div className="absolute top-4 right-4">
              <HelpPopover
                title="Focus Time"
                content="Total time spent practicing. Consistent practice helps build retention and mastery."
                position="left"
              />
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-[2rem] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-center relative"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400 mb-1 tracking-tight">
                Current Streak
              </h3>
              <motion.div
                variants={flameVariants}
                animate={streak > 0 ? "burning" : "idle"}
                className="text-orange-500"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.5 2 5.5 4.5 5.5 8c0 2.5 1.5 4.5 3 6.5 1 1.5 2.5 2.5 3.5 4 .5-1.5 2-2.5 3-4 1.5-2 3-4 3-6.5 0-3.5-2.5-6-6.5-6z" />
                </svg>
              </motion.div>
            </div>
            <p className="text-3xl font-semibold text-gray-900 tracking-tight">
              {streak} days
            </p>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Keep it going!
            </p>
            <div className="absolute top-4 right-4">
              <HelpPopover
                title="Practice Streak"
                content="Consecutive days of practice. Consistency is key to improvement. Keep your streak alive!"
                position="left"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Weekly Trend Chart */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-[2rem] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6 tracking-tight">
              Weekly Accuracy Trend
            </h3>
            <div className="h-40 flex items-end justify-between gap-2">
              {weeklyTrend.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${day.accuracy}%` }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: customEase,
                  }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full bg-gray-100 rounded-t-lg relative h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${day.accuracy}%` }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: customEase,
                      }}
                      className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${
                        day.accuracy >= 80
                          ? "bg-green-500"
                          : day.accuracy >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-400">
                    {day.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Domain Performance (Inspired by heavy/rounded bars in Screenshot 12.21.18) */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-[2rem] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6 tracking-tight">
              Performance by Domain
            </h3>

            {domainPerformance.length > 0 ? (
              <div className="space-y-6">
                {domainPerformance.map((domain: any) => (
                  <div key={domain.domain}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900 tracking-tight">
                        {domain.domain}
                      </span>
                      <span className="text-sm font-semibold text-gray-400">
                        {domain.score.toFixed(0)}%
                      </span>
                    </div>
                    {/* Thick, rounded track similar to Apple UI bars */}
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${domain.score}%` }}
                        transition={{ duration: 1.2, ease: customEase }}
                        className={`h-full rounded-full ${
                          domain.score >= 80
                            ? "bg-green-500"
                            : domain.score >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 border-dashed">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-gray-400 font-medium tracking-tight text-center px-4">
                  Domain data requires question metadata.
                  <br />
                  Coming soon.
                </p>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-[2rem] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                Recent Activity
              </h3>
              <button
                onClick={() => setIsActivityPopupOpen(true)}
                className="text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                View All
              </button>
            </div>
            {progress.length > 0 ? (
              <div className="space-y-4">
                {progress
                  .slice(-5) // Reduced to 5 to fit cleanly in the card UI
                  .reverse()
                  .map((item, index) => {
                    const lastAttempt = item.attempts[item.attempts.length - 1];
                    const isCorrect = lastAttempt?.isCorrect ?? false;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCorrect ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${
                                isCorrect ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 tracking-tight text-sm">
                              Question {item.questionId.substring(0, 8)}...
                            </p>
                            <p className="text-xs font-medium text-gray-400 mt-0.5">
                              {new Date(
                                item.lastAttemptedAt,
                              ).toLocaleDateString()}{" "}
                              •{" "}
                              {lastAttempt
                                ? (lastAttempt.timeSpent / 1000).toFixed(1) +
                                  "s"
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-tight ${
                            isCorrect
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Missed"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 border-dashed">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-gray-400 font-medium tracking-tight">
                  No practice history yet.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div
          variants={fadeInUp}
          className="mt-6 bg-white rounded-[2rem] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 tracking-tight">
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AchievementCard
              title="First Steps"
              description="Answer your first question"
              unlocked={(stats?.totalQuestions ?? 0) > 0}
              icon="🎯"
            />
            <AchievementCard
              title="Century Club"
              description="Answer 100 questions"
              unlocked={(stats?.totalQuestions || 0) >= 100}
              icon="💯"
            />
            <AchievementCard
              title="Sharpshooter"
              description="90%+ accuracy"
              unlocked={accuracy >= 90}
              icon="🎯"
            />
            <AchievementCard
              title="Week Warrior"
              description="7-day streak"
              unlocked={streak >= 7}
              icon="🔥"
            />
          </div>
        </motion.div>

        <RecentActivityPopup
          isOpen={isActivityPopupOpen}
          onClose={() => setIsActivityPopupOpen(false)}
          progress={progress}
        />
      </motion.div>
    </div>
  );
}

// Achievement Card Component
const AchievementCard = ({
  title,
  description,
  unlocked,
  icon,
}: {
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-4 rounded-2xl border-2 transition-all ${
      unlocked
        ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
        : "bg-gray-50 border-gray-200 opacity-60"
    }`}
  >
    <div className="text-3xl mb-2 filter grayscale-0 transition-all">
      {unlocked ? icon : "🔒"}
    </div>
    <h4
      className={`font-semibold text-sm mb-1 ${unlocked ? "text-gray-900" : "text-gray-400"}`}
    >
      {title}
    </h4>
    <p className={`text-xs ${unlocked ? "text-gray-600" : "text-gray-400"}`}>
      {description}
    </p>
  </motion.div>
);

function calculateWeeklyTrend(progress: UserProgress[]) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const weekData = days.map((day, index) => {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - ((today.getDay() - index + 7) % 7));
    targetDate.setHours(0, 0, 0, 0);

    const dayProgress = progress.filter((p) => {
      const attemptDate = new Date(p.lastAttemptedAt);
      attemptDate.setHours(0, 0, 0, 0);
      return attemptDate.getTime() === targetDate.getTime();
    });

    const correct = dayProgress.filter((p) => {
      const lastAttempt = p.attempts[p.attempts.length - 1];
      return lastAttempt?.isCorrect;
    }).length;

    const accuracy =
      dayProgress.length > 0 ? (correct / dayProgress.length) * 100 : 0;

    return { label: day, accuracy };
  });

  return weekData;
}

function calculateStreak(progress: UserProgress[]): number {
  if (progress.length === 0) return 0;

  const dates = new Set(
    progress.map((p) => new Date(p.lastAttemptedAt).toDateString()),
  );
  const sortedDates = Array.from(dates).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);

    if (dates.has(checkDate.toDateString())) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateDomainPerformance(progress: UserProgress[]) {
  return [];
}
