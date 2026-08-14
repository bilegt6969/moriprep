"use client";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { motion, useReducedMotion } from "framer-motion";
import { auth, db } from "lib/firebase";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
};

const customEase = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: customEase },
  },
};

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

// --- Question Card Component ---
const QuestionCard = ({
  question,
  category,
  difficulty,
  date,
  score,
  index,
}: {
  question: string;
  category: string;
  difficulty: string;
  date: string;
  score: number;
  index: number;
}) => {
  const reduce = useReducedMotion();
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "math":
        return "bg-blue-100 text-blue-700";
      case "reading":
        return "bg-purple-100 text-purple-700";
      case "writing":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="group"
    >
      <motion.div
        whileHover={reduce ? undefined : { scale: 0.985 }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={spring}
        className="w-full min-h-[200px] rounded-[32px] bg-[#f5f5f5] p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(category)}`}
            >
              {category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(difficulty)}`}
            >
              {difficulty}
            </span>
          </div>
          <span className="text-xs text-gray-500">{date}</span>
        </div>

        <h3 className="text-lg font-medium text-[#1D1D1F] mb-4 line-clamp-3">
          {question}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1c1c1e] flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{score}</span>
            </div>
            <span className="text-sm text-gray-500">Score</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
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
    const checkAuth = () => {
      if (auth?.currentUser) {
        setIsAuthenticated(true);
        fetchQuestionHistory();
      } else {
        setIsLoading(false);
      }
    };

    const unsubscribe = auth?.onAuthStateChanged?.((user: any) => {
      if (user) {
        setIsAuthenticated(true);
        fetchQuestionHistory();
      } else {
        setIsLoading(false);
      }
    });

    checkAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const fetchQuestionHistory = () => {
    if (!auth?.currentUser) return;

    const q = query(
      collection(db, "userAnswers"),
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
            const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
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
          className="w-8 h-8 border-[3px] border-[#E5E5EA] border-t-[#0071E3] rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-[#1D1D1F] mb-4">
            Sign in to view your history
          </h1>
          <p className="text-gray-500 mb-6">
            You need to be signed in to access your question history.
          </p>
          <motion.button
            whileHover={reduce ? undefined : { scale: 1.05 }}
            whileTap={reduce ? undefined : { scale: 0.95 }}
            transition={spring}
            className="px-8 py-3 bg-[#1c1c1e] text-white rounded-full font-medium"
            onClick={() => (window.location.href = "/sign-in")}
          >
            Sign In
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white font-sans pt-24 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1200px] mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F] mb-3 leading-tight">
            Question History
          </h1>
          <p className="text-gray-500 text-lg">
            Review your past questions and track your progress over time.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          <div className="bg-[#f5f5f5] rounded-[24px] p-6">
            <div className="text-3xl font-semibold text-[#1D1D1F] mb-1">
              {questions.length}
            </div>
            <div className="text-sm text-gray-500">Total Questions</div>
          </div>
          <div className="bg-[#f5f5f5] rounded-[24px] p-6">
            <div className="text-3xl font-semibold text-[#1D1D1F] mb-1">
              {questions.length > 0
                ? Math.round(
                    (questions.filter((q) => q.isCorrect).length /
                      questions.length) *
                      100,
                  )
                : 0}
              %
            </div>
            <div className="text-sm text-gray-500">Accuracy Rate</div>
          </div>
          <div className="bg-[#f5f5f5] rounded-[24px] p-6">
            <div className="text-3xl font-semibold text-[#1D1D1F] mb-1">
              {questions.length > 0
                ? Math.round(
                    questions.reduce((acc, q) => acc + (q.score || 0), 0) /
                      questions.length,
                  )
                : 0}
            </div>
            <div className="text-sm text-gray-500">Average Score</div>
          </div>
        </motion.div>

        {/* Questions Grid */}
        {questions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-2">
              No questions yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start practicing to build your question history.
            </p>
            <motion.button
              whileHover={reduce ? undefined : { scale: 1.05 }}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              transition={spring}
              className="px-8 py-3 bg-[#1c1c1e] text-white rounded-full font-medium"
              onClick={() => (window.location.href = "/practice")}
            >
              Start Practicing
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question.question || "Question text not available"}
                category={question.category || "General"}
                difficulty={question.difficulty || "Medium"}
                date={
                  question.timestamp
                    ? new Date(question.timestamp).toLocaleDateString()
                    : "Unknown"
                }
                score={question.score || 0}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
