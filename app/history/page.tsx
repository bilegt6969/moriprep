"use client";

import { auth, db } from "@/lib/firebase";
import type { Auth } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, History, LockIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

const customEase = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// --- Question Card Component ---
const QuestionCard = ({
  question,
  questionId,
  category,
  difficulty,
  date,
  score,
}: {
  question: string;
  questionId: string;
  category: string;
  difficulty: string;
  date: string;
  score: number;
  index: number;
}) => {
  const reduce = useReducedMotion();

  // Restored and visually updated difficulty colors
  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-200 text-neutral-800";
    }
  };

  // Restored and visually updated category colors
  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case "math":
        return "bg-blue-100 text-blue-800";
      case "reading":
        return "bg-purple-100 text-purple-800";
      case "writing":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-neutral-200 text-neutral-800";
    }
  };

  return (
    <motion.div variants={fadeInUp} className="group w-full">
      <motion.div
        whileHover={reduce ? undefined : { scale: 1.01 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        onClick={() => {
          window.location.href = `/practice/rw?question_id=${questionId}`;
        }}
        className="w-full h-full min-h-[220px] rounded-[32px] bg-[#F5F5F7] p-8 flex flex-col justify-between transition-transform duration-300 cursor-pointer"
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <span
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide ${getCategoryColor(
                  category,
                )}`}
              >
                {category || "Unknown"}
              </span>
              <span
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide ${getDifficultyColor(
                  difficulty,
                )}`}
              >
                {difficulty || "Unknown"}
              </span>
            </div>
            <span className="text-[13px] font-medium text-neutral-400">
              {date}
            </span>
          </div>

          <h3 className="text-xl font-semibold tracking-tight text-neutral-900 mb-6 line-clamp-3 leading-snug">
            {question}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-black/5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                score > 0
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-900"
              }`}
            >
              {score}
            </div>
            <span className="text-sm font-medium text-neutral-500">
              Points earned
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-neutral-200 transition-colors duration-300">
            <ChevronRight className="w-4 h-4 text-neutral-600" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function HistoryPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const unsubscribe = auth
      ? (auth as Auth).onAuthStateChanged?.((user: any) => {
          if (user) {
            setIsAuthenticated(true);
            fetchQuestionHistory();
          } else {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        })
      : undefined;

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const fetchQuestionHistory = () => {
    if (!auth?.currentUser || !db) return;

    const q = query(
      collection(db, "userProgress"),
      where("userId", "==", auth.currentUser.uid),
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: any) => {
        const questionsData = querySnapshot.docs
          .map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a: any, b: any) => {
            const dateA = a.lastAttemptedAt
              ? new Date(a.lastAttemptedAt).getTime()
              : 0;
            const dateB = b.lastAttemptedAt
              ? new Date(b.lastAttemptedAt).getTime()
              : 0;
            return dateB - dateA; // Sort descending (newest first)
          });

        setQuestions(questionsData);
        setIsLoading(false);
      },
      (error: any) => {
        console.error("Error fetching question history:", error);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-[3px] border-neutral-100 border-t-neutral-900 rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6 font-sans">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center mx-auto mb-6">
            <LockIcon className="w-6 h-6 text-neutral-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-3">
            Authentication Required
          </h1>
          <p className="text-neutral-500 mb-8 text-lg">
            Please sign in to view your detailed question history and
            performance metrics.
          </p>
          <button
            onClick={() => (window.location.href = "/sign-in")}
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-full py-4 font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Calculate Stats
  const accuracyRate =
    questions.length > 0
      ? Math.round(
          (questions.filter((q) => {
            const lastAttempt =
              q.attempts && q.attempts.length > 0
                ? q.attempts[q.attempts.length - 1]
                : null;
            return lastAttempt?.isCorrect;
          }).length /
            questions.length) *
            100,
        )
      : 0;

  const averageScore =
    questions.length > 0
      ? Math.round(
          questions.reduce((acc, q) => {
            const lastAttempt =
              q.attempts && q.attempts.length > 0
                ? q.attempts[q.attempts.length - 1]
                : null;
            return acc + (lastAttempt?.isCorrect ? 1 : 0);
          }, 0) / questions.length,
        )
      : 0;

  return (
    <section className="min-h-screen bg-white font-sans pt-20 pb-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-2">
            History
          </h1>
          <p className="text-neutral-500 text-lg">
            Review your past questions and track your progress over time.
          </p>
        </motion.div>

        {/* Stats Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full bg-[#FFC800] rounded-[32px] p-8 md:p-10 mb-10 relative overflow-hidden"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mb-10">
            Performance Overview
          </h2>

          <div className="flex flex-wrap gap-10 md:gap-20">
            <div>
              <p className="text-sm font-medium text-neutral-900/60 mb-2">
                Total Questions
              </p>
              <p className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
                {questions.length}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900/60 mb-2">
                Accuracy Rate
              </p>
              <p className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
                {accuracyRate}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900/60 mb-2">
                Average Score
              </p>
              <p className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
                {averageScore}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Questions Grid */}
        {questions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-24 bg-[#F5F5F7] rounded-[32px]"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <History className="w-6 h-6 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
              No history yet
            </h2>
            <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
              Your completed questions will appear here. Start practicing to
              build your history.
            </p>
            <button
              onClick={() => (window.location.href = "/practice")}
              className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full font-semibold transition-colors"
            >
              Start Practicing
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {questions.map((question, index) => {
              const lastAttempt =
                question.attempts && question.attempts.length > 0
                  ? question.attempts[question.attempts.length - 1]
                  : null;
              return (
                <QuestionCard
                  key={question.id}
                  question={`Question #${question.questionId}`}
                  questionId={question.questionId}
                  category={question.category}
                  difficulty={question.difficulty}
                  date={
                    question.lastAttemptedAt
                      ? new Date(question.lastAttemptedAt).toLocaleDateString()
                      : "Unknown"
                  }
                  score={lastAttempt?.isCorrect ? 1 : 0}
                  index={index}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
