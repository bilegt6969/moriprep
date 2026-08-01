"use client";

import { getUserProgress, getUserStats } from "@/lib/dsat/questions";
import { auth } from "@/lib/firebase";
import { UserProgress, UserStats } from "@/types/dsat";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: customEase },
  },
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-neutral-500">Loading analytics...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4 text-neutral-600">
            Please sign in to view your analytics
          </p>
          <button
            onClick={() => router.push("/sign-in")}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const accuracy = stats
    ? ((stats.correctAnswers / stats.totalQuestions) * 100).toFixed(1)
    : "0";

  // Calculate total practice time from progress data
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

  // Calculate streak from progress data
  const streak = calculateStreak(progress);

  // Calculate domain performance from progress data (will need question data)
  const domainPerformance = calculateDomainPerformance(progress);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-medium tracking-tight text-neutral-900 mb-6 leading-[1.05]"
          >
            Analytics
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed"
          >
            Track your progress and identify areas for improvement.
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <section className="py-16 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-sm text-neutral-500 mb-2">
                Total Questions Attempted
              </p>
              <p className="text-3xl font-semibold text-neutral-900 mb-2">
                {stats?.totalQuestions || 0}
              </p>
              <p className="text-sm text-neutral-400">All time</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-sm text-neutral-500 mb-2">Accuracy Rate</p>
              <p className="text-3xl font-semibold text-neutral-900 mb-2">
                {accuracy}%
              </p>
              <p className="text-sm text-neutral-400">
                {stats?.correctAnswers || 0} correct
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-sm text-neutral-500 mb-2">Practice Time</p>
              <p className="text-3xl font-semibold text-neutral-900 mb-2">
                {practiceTimeHours > 0 ? `${practiceTimeHours}h ` : ""}
                {practiceTimeRemainingMinutes}m
              </p>
              <p className="text-sm text-neutral-400">Total time spent</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-sm text-neutral-500 mb-2">Streak</p>
              <p className="text-3xl font-semibold text-neutral-900 mb-2">
                {streak} days
              </p>
              <p className="text-sm text-neutral-400">Keep it up!</p>
            </motion.div>
          </div>

          {/* Domain Performance */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl border border-neutral-200 p-8 mb-16"
          >
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Domain Performance
            </h2>
            {domainPerformance.length > 0 ? (
              <div className="space-y-6">
                {domainPerformance.map((domain: any) => (
                  <div key={domain.domain}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-900">
                        {domain.domain}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {domain.score.toFixed(1)}% ({domain.questions}{" "}
                        questions)
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${domain.score}%` }}
                        transition={{ duration: 1, ease: customEase }}
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
              <p className="text-neutral-500">
                Domain performance data requires question metadata. Coming soon!
              </p>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl border border-neutral-200 p-8"
          >
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Recent Activity
            </h2>
            {progress.length > 0 ? (
              <div className="space-y-3">
                {progress
                  .slice(-10)
                  .reverse()
                  .map((item, index) => {
                    const lastAttempt = item.attempts[item.attempts.length - 1];
                    const isCorrect = lastAttempt?.isCorrect ?? false;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <span
                            className={`w-3 h-3 rounded-full mr-3 ${isCorrect ? "bg-green-500" : "bg-red-500"}`}
                          ></span>
                          <div>
                            <p className="font-medium text-neutral-900">
                              Question ID: {item.questionId}
                            </p>
                            <p className="text-sm text-neutral-500">
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
                          className={`px-3 py-1 rounded-full text-sm ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-neutral-500">
                No practice history yet. Start practicing to see your progress!
              </p>
            )}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
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
  // UserProgress doesn't include domain info, so we return empty for now
  // This would need to be enhanced by fetching question data to get domain information
  return [];
}
