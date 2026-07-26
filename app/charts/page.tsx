"use client";

import { auth } from "@/lib/firebase";
import Navbar from "components/navbar";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Flame,
  Target
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock user stats data
const mockUserStats = {
  totalQuestions: 247,
  correctAnswers: 189,
  averageTime: 72, // seconds
  streak: 12,
  weeklyGoal: 50,
  weeklyProgress: 34,
  domains: [
    { name: "Information and Ideas", correct: 45, total: 55, avgTime: 68 },
    { name: "Craft and Structure", correct: 52, total: 60, avgTime: 75 },
    { name: "Expression of Ideas", correct: 38, total: 50, avgTime: 80 },
    {
      name: "Standard English Conventions",
      correct: 54,
      total: 82,
      avgTime: 65,
    },
  ],
  skills: [
    { name: "Central Ideas", correct: 28, total: 32, avgTime: 62 },
    { name: "Inferences", correct: 22, total: 30, avgTime: 78 },
    { name: "Words in Context", correct: 35, total: 40, avgTime: 55 },
    { name: "Text Structure", correct: 18, total: 25, avgTime: 85 },
    { name: "Transitions", correct: 25, total: 35, avgTime: 72 },
    { name: "Boundaries", correct: 30, total: 38, avgTime: 68 },
  ],
  weeklyActivity: [
    { day: "Mon", questions: 8 },
    { day: "Tue", questions: 12 },
    { day: "Wed", questions: 6 },
    { day: "Thu", questions: 15 },
    { day: "Fri", questions: 10 },
    { day: "Sat", questions: 18 },
    { day: "Sun", questions: 5 },
  ],
};

export default function ChartsPage() {
  const [user, setUser] = useState<any>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [stats, setStats] = useState(mockUserStats);

  useEffect(() => {
    if (!auth) {
      setIsAuthLoaded(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  const accuracy = (
    (stats.correctAnswers / stats.totalQuestions) *
    100
  ).toFixed(1);
  const weakDomains = stats.domains
    .filter((d) => d.correct / d.total < 0.7)
    .sort((a, b) => a.correct / a.total - b.correct / b.total);
  const strongDomains = stats.domains
    .filter((d) => d.correct / d.total >= 0.8)
    .sort((a, b) => b.correct / b.total - a.correct / a.total);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-4">
            Your Progress
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Track your performance and identify areas for improvement.
          </p>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="text-blue-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Total Questions
              </span>
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              {stats.totalQuestions}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Accuracy
              </span>
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              {accuracy}%
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Clock className="text-purple-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Avg. Time
              </span>
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              {stats.averageTime}s
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Flame className="text-orange-600" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Current Streak
              </span>
            </div>
            <div className="text-3xl font-semibold text-gray-900">
              {stats.streak} days
            </div>
          </div>
        </motion.div>

        {/* Weekly Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="text-gray-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">
                Weekly Goal
              </h3>
            </div>
            <span className="text-sm text-gray-500">
              {stats.weeklyProgress} / {stats.weeklyGoal} questions
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(stats.weeklyProgress / stats.weeklyGoal) * 100}%`,
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-black h-3 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-500">
            {stats.weeklyGoal - stats.weeklyProgress} more questions to reach
            your goal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Domain Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Domain Performance
            </h3>
            <div className="space-y-6">
              {stats.domains.map((domain) => {
                const percentage = (domain.correct / domain.total) * 100;
                return (
                  <div key={domain.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {domain.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {domain.correct}/{domain.total} ({percentage.toFixed(0)}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-2 rounded-full ${
                          percentage >= 80
                            ? "bg-green-500"
                            : percentage >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Weekly Activity
            </h3>
            <div className="flex items-end justify-between h-48 gap-2">
              {stats.weeklyActivity.map((day) => {
                const maxQuestions = Math.max(
                  ...stats.weeklyActivity.map((d) => d.questions),
                );
                const height = (day.questions / maxQuestions) * 100;
                return (
                  <div
                    key={day.day}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full bg-gray-100 rounded-t-lg relative"
                      style={{ height: "100%" }}
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 left-0 right-0 bg-black rounded-t-lg"
                      />
                    </div>
                    <span className="text-xs text-gray-500">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Weak & Strong Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weak Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-orange-500" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">
                Areas to Improve
              </h3>
            </div>
            {weakDomains.length > 0 ? (
              <div className="space-y-4">
                {weakDomains.map((domain) => {
                  const percentage = (domain.correct / domain.total) * 100;
                  return (
                    <div
                      key={domain.name}
                      className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {domain.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Avg. time: {domain.avgTime}s
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-orange-600">
                          {percentage.toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {domain.correct}/{domain.total}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">
                No weak areas identified. Great job!
              </p>
            )}
          </motion.div>

          {/* Strong Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-green-500" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">
                Strong Areas
              </h3>
            </div>
            {strongDomains.length > 0 ? (
              <div className="space-y-4">
                {strongDomains.map((domain) => {
                  const percentage = (domain.correct / domain.total) * 100;
                  return (
                    <div
                      key={domain.name}
                      className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {domain.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Avg. time: {domain.avgTime}s
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          {percentage.toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {domain.correct}/{domain.total}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">
                Keep practicing to build strong areas!
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
