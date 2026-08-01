"use client";

import { getUserProgress, getUserStats } from "@/lib/dsat/questions";
import { auth } from "@/lib/firebase";
import { UserProgress, UserStats } from "@/types/dsat";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function DashboardPage() {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Please sign in to view your progress</p>
          <button
            onClick={() => (window.location.href = "/sign-in")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
  const averageTimeSeconds = stats
    ? (stats.averageTime / 1000).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Progress Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Total Questions
            </h3>
            <p className="text-3xl font-bold">{stats?.totalQuestions || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Correct Answers
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats?.correctAnswers || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Accuracy</h3>
            <p className="text-3xl font-bold text-blue-600">{accuracy}%</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Avg Time/Question
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {averageTimeSeconds}s
            </p>
          </div>
        </div>

        {/* Weak/Strong Domains */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              Areas to Improve
            </h3>
            {stats?.weakDomains && stats.weakDomains.length > 0 ? (
              <ul className="space-y-2">
                {stats.weakDomains.map((domain, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {domain}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No weak areas identified yet</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-600">
              Strong Areas
            </h3>
            {stats?.strongDomains && stats.strongDomains.length > 0 ? (
              <ul className="space-y-2">
                {stats.strongDomains.map((domain, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {domain}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                Complete more questions to identify strengths
              </p>
            )}
          </div>
        </div>

        {/* Recent Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
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
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full mr-3 ${isCorrect ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                        <div>
                          <p className="font-medium">
                            Question ID: {item.questionId}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              item.lastAttemptedAt,
                            ).toLocaleDateString()}{" "}
                            •{" "}
                            {lastAttempt
                              ? (lastAttempt.timeSpent / 1000).toFixed(1) + "s"
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
            <p className="text-gray-500">
              No practice history yet. Start practicing to see your progress!
            </p>
          )}
        </div>

        {/* Practice Recommendations */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">
            Practice Recommendations
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Aim for at least 30 minutes of practice per day</li>
            <li>• Focus on your weak areas identified above</li>
            <li>• Review explanations for incorrect answers</li>
            <li>• Try to maintain an accuracy rate above 70%</li>
            <li>• Practice timed sessions to simulate test conditions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
