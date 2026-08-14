"use client";

import { DSATQuestion, UserProgress } from "@/types/dsat";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RecentActivityPopupProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress[];
}

export function RecentActivityPopup({
  isOpen,
  onClose,
  progress,
}: RecentActivityPopupProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Record<string, DSATQuestion>>({});
  const [loading, setLoading] = useState(false);

  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #d4d4d8;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #a1a1aa;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch question details when popup opens
  useEffect(() => {
    if (isOpen && progress.length > 0) {
      const fetchQuestions = async () => {
        setLoading(true);
        try {
          // Fetch only the questions that are in the progress history
          const questionIds = progress.map((p) => p.questionId).join(",");
          const response = await fetch(
            `/api/questions?question_ids=${questionIds}`,
          );
          if (response.ok) {
            const allQuestions: DSATQuestion[] = await response.json();
            const questionMap: Record<string, DSATQuestion> = {};
            allQuestions.forEach((q) => {
              questionMap[q.question_id] = q;
            });
            setQuestions(questionMap);
          }
        } catch (error) {
          console.error("Error fetching questions:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [isOpen, progress]);

  const sortedProgress = [...progress].sort(
    (a, b) =>
      new Date(b.lastAttemptedAt).getTime() -
      new Date(a.lastAttemptedAt).getTime(),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.4,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-[600px] h-[700px] pointer-events-auto overflow-hidden flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between flex-shrink-0 relative z-10">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    Recent Activity
                  </h2>
                  <p className="text-sm text-zinc-500 mt-0.5">
                    {progress.length} questions attempted
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              {/* Top scroll blur - fixed below header */}
              <div
                className="absolute inset-x-0 top-[68px] z-20 h-16 bg-white/90 backdrop-blur-xl pointer-events-none"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 30%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, black 30%, transparent 100%)",
                }}
              />

              {/* Content with blur effects */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {/* Top scroll blur */}
                <div
                  className="absolute inset-x-0 top-0 z-10 h-12 bg-white/80 backdrop-blur-md pointer-events-none"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 20%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, black 20%, transparent 100%)",
                  }}
                />

                <div className="px-6 pt-12 pb-8 space-y-3">
                  {loading ? (
                    <div className="h-40 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
                    </div>
                  ) : sortedProgress.length > 0 ? (
                    sortedProgress.map((item, index) => {
                      const lastAttempt =
                        item.attempts[item.attempts.length - 1];
                      const isCorrect = lastAttempt?.isCorrect ?? false;
                      const totalAttempts = item.attempts.length;
                      const question = questions[item.questionId];

                      return (
                        <div
                          key={index}
                          onClick={() =>
                            router.push(`/question/${item.questionId}`)
                          }
                          className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 hover:bg-gray-100 transition-colors cursor-pointer"
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
                                {question ? question.domain : "Unknown Domain"}
                              </p>
                              <p className="text-xs font-medium text-gray-500 mt-0.5">
                                {question ? question.skill : "Unknown Skill"}
                              </p>
                              <p className="text-xs font-medium text-zinc-400 mt-0.5">
                                #{item.questionId}
                              </p>
                              <p className="text-xs font-medium text-gray-400 mt-0.5">
                                {new Date(
                                  item.lastAttemptedAt,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                {" • "}
                                {question
                                  ? question.difficulty
                                  : "Unknown"}{" "}
                                difficulty
                                {" • "}
                                {lastAttempt
                                  ? (lastAttempt.timeSpent / 1000).toFixed(1) +
                                    "s"
                                  : "N/A"}
                                {" • "}
                                {totalAttempts} attempt
                                {totalAttempts !== 1 ? "s" : ""}
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
                    })
                  ) : (
                    <div className="h-40 flex flex-col items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 border-dashed">
                      <div className="text-4xl mb-3">📝</div>
                      <p className="text-gray-400 font-medium tracking-tight">
                        No practice history yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom scroll blur - fixed above footer */}
              <div
                className="absolute inset-x-0 bottom-[72px] z-20 h-16 bg-white/90 backdrop-blur-xl pointer-events-none"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to top, black 30%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to top, black 30%, transparent 100%)",
                }}
              />

              {/* Sticky Footer */}
              <div className="sticky bottom-0 bg-white border-t border-zinc-100 px-6 py-4 flex items-center justify-between z-10">
                <p className="text-[13px] font-medium text-zinc-500 transition-all duration-300">
                  Showing all {progress.length} activities
                </p>
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-zinc-900 text-white text-[13px] rounded-full font-medium shadow-md hover:bg-black transition-all duration-300 ease-out active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
