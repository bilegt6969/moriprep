"use client";

import { auth } from "@/lib/firebase";
import { Attempt, DSATQuestion } from "@/types/dsat";
import { onAuthStateChanged } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "hooks/use-reduced-motion";
import { Bookmark, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

// Mock data for faster loading
const mockQuestions: DSATQuestion[] = [
  {
    question_id: "mock-1",
    assessment: "SAT",
    test: "Reading and Writing",
    domain: "Information and Ideas",
    skill: "Central Ideas and Details",
    difficulty: "Medium",
    passage: `<p>The digital SAT Reading and Writing section assesses your ability to comprehend, analyze, and synthesize information from various texts. This section includes passages from literature, history, social studies, and science.</p><p>When approaching these questions, it's essential to read actively, identify the main idea, and understand how the author uses evidence to support their claims.</p>`,
    prompt: "What is the main purpose of the passage?",
    question: "What is the main purpose of the passage?",
    choices: {
      A: "To criticize the digital SAT format",
      B: "To explain the Reading and Writing section",
      C: "To argue for more test preparation",
      D: "To describe the history of standardized testing",
    },
    correct_answer: "B",
    correct_answer_text: "To explain the Reading and Writing section",
    rationale:
      "The passage provides an overview of the digital SAT Reading and Writing section, explaining what it assesses and offering advice on how to approach it.",
    parse_status: "strict",
    source_file: "mock",
    has_graphic: false,
    graphics: [],
    has_underline: false,
    raw_text: "",
  },
  {
    question_id: "mock-2",
    assessment: "SAT",
    test: "Reading and Writing",
    domain: "Craft and Structure",
    skill: "Words in Context",
    difficulty: "Easy",
    passage: `<p>The scientist's meticulous approach to research earned her widespread recognition in the academic community. Her attention to detail and rigorous methodology set a new standard for laboratory work.</p>`,
    prompt: 'As used in the passage, the word "meticulous" most nearly means:',
    question:
      'As used in the passage, the word "meticulous" most nearly means:',
    choices: {
      A: "Careless",
      B: "Thorough",
      C: "Quick",
      D: "Creative",
    },
    correct_answer: "B",
    correct_answer_text: "Thorough",
    rationale:
      "Meticulous means showing great attention to detail; very careful and precise. The context mentions her attention to detail and rigorous methodology.",
    parse_status: "strict",
    source_file: "mock",
    has_graphic: false,
    graphics: [],
    has_underline: false,
    raw_text: "",
  },
  {
    question_id: "mock-3",
    assessment: "SAT",
    test: "Reading and Writing",
    domain: "Expression of Ideas",
    skill: "Transitions",
    difficulty: "Hard",
    passage: `<p>The city implemented a new public transportation system. [1] The system reduced traffic congestion significantly. [2] Many residents initially opposed the change. [3] Over time, public opinion shifted as the benefits became clear.</p>`,
    prompt:
      "Which transition would best connect sentence [1] and sentence [2]?",
    question:
      "Which transition would best connect sentence [1] and sentence [2]?",
    choices: {
      A: "However",
      B: "Therefore",
      C: "Consequently",
      D: "Furthermore",
    },
    correct_answer: "A",
    correct_answer_text: "However",
    rationale:
      "However is the best transition because sentence [2] presents an unexpected contrast to the positive outcome described in sentence [1].",
    parse_status: "strict",
    source_file: "mock",
    has_graphic: false,
    graphics: [],
    has_underline: false,
    raw_text: "",
  },
];

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

function RWPracticePageContent() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain");
  const difficultyParam = searchParams.get("difficulty");

  const [user, setUser] = useState<any>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [questions, setQuestions] = useState<DSATQuestion[]>(mockQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<DSATQuestion | null>(
    mockQuestions[0] || null,
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [highlightedAnswer, setHighlightedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [eliminatedChoices, setEliminatedChoices] = useState<Set<string>>(
    new Set(),
  );
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Map<string, { isCorrect: boolean; answer: string }>
  >(new Map());
  const [questionAttempts, setQuestionAttempts] = useState<Attempt[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);
  const [highlightMenu, setHighlightMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [highlightedText, setHighlightedText] = useState<Set<string>>(
    new Set(),
  );
  const [highlightColor, setHighlightColor] = useState<
    "yellow" | "blue" | "none"
  >("none");
  const [showStats, setShowStats] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const passageRef = useRef<HTMLDivElement>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

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

  useEffect(() => {
    if (domainParam || difficultyParam) {
      const filtered = mockQuestions.filter((q) => {
        if (domainParam && q.domain !== domainParam) return false;
        if (difficultyParam && q.difficulty !== difficultyParam) return false;
        return true;
      });
      setQuestions(filtered);
      setSelectedQuestion(filtered[0] || null);
    }
  }, [domainParam, difficultyParam]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedQuestion && !isTimerPaused) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedQuestion, isTimerPaused]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  async function handleAnswerSubmit() {
    if (!highlightedAnswer || showExplanation) return;
    setSelectedAnswer(highlightedAnswer);
    if (selectedQuestion) {
      setShowExplanation(true);
      const isCorrect = highlightedAnswer === selectedQuestion.correct_answer;
      setAnsweredQuestions((prev) => {
        const newMap = new Map(prev);
        newMap.set(selectedQuestion.question_id, {
          isCorrect,
          answer: highlightedAnswer,
        });
        return newMap;
      });
    }
  }

  function toggleMarkForReview() {
    if (!selectedQuestion) return;
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(selectedQuestion.question_id)) {
        newSet.delete(selectedQuestion.question_id);
      } else {
        newSet.add(selectedQuestion.question_id);
      }
      return newSet;
    });
  }

  function handleNextQuestion() {
    const currentIndex = questions.findIndex(
      (q) => q.question_id === selectedQuestion?.question_id,
    );
    if (currentIndex < questions.length - 1) {
      setSelectedQuestion(questions[currentIndex + 1] || null);
      resetQuestionState();
    }
  }

  function handlePreviousQuestion() {
    const currentIndex = questions.findIndex(
      (q) => q.question_id === selectedQuestion?.question_id,
    );
    if (currentIndex > 0) {
      setSelectedQuestion(questions[currentIndex - 1] || null);
      resetQuestionState();
    }
  }

  function resetQuestionState() {
    setSelectedAnswer("");
    setHighlightedAnswer("");
    setShowExplanation(false);
    setEliminatedChoices(new Set());
    setQuestionStartTime(Date.now());
  }

  function handleGoBack() {
    router.push("/practice/rw");
  }

  function handleQuestionSelect(index: number) {
    const question = questions[index];
    if (question) {
      setSelectedQuestion(question);
      setShowQuestionPicker(false);
      resetQuestionState();
    }
  }

  if (!selectedQuestion) {
    return (
      <div className="flex flex-col h-screen bg-white font-sans text-gray-900 overflow-hidden selection:bg-cyan-200 relative">
        {/* Main Content Skeleton */}
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          {/* Left: Passage Skeleton */}
          <div className="flex-1 overflow-y-auto border-r border-gray-200 bg-[#F5F5F7]">
            <div className="max-w-3xl mx-auto p-8 md:p-12">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion w-11/12" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion w-10/12" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion w-11/12" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion w-9/12" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion w-10/12" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion w-11/12" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion w-9/12" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion w-10/12" />
              </div>
            </div>
          </div>

          {/* Right: Question Skeleton */}
          <div className="w-full md:w-[45%] overflow-y-auto bg-white">
            <div className="p-8 md:p-12">
              {/* Question Header Skeleton */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse pulse-reduced-motion" />
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion" />
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion" />
                </div>
              </div>

              {/* Question Prompt Skeleton */}
              <div className="mb-8 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion w-11/12" />
                <div className="h-4 bg-gray-200 rounded animate-pulse pulse-reduced-motion w-10/12" />
              </div>

              {/* Answer Options Skeleton */}
              <div className="space-y-4">
                <div className="h-20 bg-gray-100 rounded-xl border-2 border-gray-200 animate-pulse pulse-reduced-motion" />
                <div className="h-20 bg-gray-100 rounded-xl border-2 border-gray-200 animate-pulse pulse-reduced-motion" />
                <div className="h-20 bg-gray-100 rounded-xl border-2 border-gray-200 animate-pulse pulse-reduced-motion" />
                <div className="h-20 bg-gray-100 rounded-xl border-2 border-gray-200 animate-pulse pulse-reduced-motion" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-gray-900 overflow-hidden selection:bg-cyan-200 relative">
      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Left: Passage */}
        <div className="flex-1 overflow-y-auto border-r border-gray-200 bg-[#F5F5F7]">
          <div className="max-w-3xl mx-auto p-8 md:p-12">
            <div
              ref={passageRef}
              className="text-[16px] leading-[1.8] text-[#1C1C1E] font-serif"
            >
              {selectedQuestion.passage && (
                <div
                  className="mb-6"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedQuestion.has_underline &&
                      selectedQuestion.underlined_text
                        ? selectedQuestion.passage.replace(
                            selectedQuestion.underlined_text,
                            `<u class="bg-yellow-200 px-1">${selectedQuestion.underlined_text}</u>`,
                          )
                        : selectedQuestion.passage,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: Question */}
        <div className="w-full md:w-[45%] overflow-y-auto bg-white">
          <div className="p-8 md:p-12">
            {/* Question Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-black text-white w-8 h-8 rounded-lg text-[15px] font-bold flex items-center justify-center shadow-sm">
                {questions.findIndex(
                  (q) => q.question_id === selectedQuestion.question_id,
                ) + 1}
              </div>

              <button
                onClick={toggleMarkForReview}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                  markedQuestions.has(selectedQuestion.question_id)
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                <Bookmark
                  size={16}
                  strokeWidth={2.5}
                  className={
                    markedQuestions.has(selectedQuestion.question_id)
                      ? "text-gray-900 fill-gray-900"
                      : "text-gray-400"
                  }
                />
                Mark for Review
              </button>
            </div>

            {/* Question Prompt */}
            {selectedQuestion.prompt && (
              <div className="mb-8 text-[16px] font-serif text-[#1C1C1E] leading-relaxed">
                {selectedQuestion.prompt}
              </div>
            )}

            {/* Answers */}
            <div className="space-y-4">
              {Object.entries(selectedQuestion.choices).map(([key, value]) => {
                const isSelected = selectedAnswer === key;
                const isHighlighted = highlightedAnswer === key;
                const isEliminated = eliminatedChoices.has(key);
                const isCorrectAnswer = key === selectedQuestion.correct_answer;

                let borderClass = "border-gray-300";
                let bgClass = "bg-white";

                if (showExplanation) {
                  if (isCorrectAnswer) {
                    borderClass = "border-green-500";
                    bgClass = "bg-green-50";
                  } else if (isSelected && !isCorrectAnswer) {
                    borderClass = "border-red-500";
                    bgClass = "bg-red-50";
                  }
                } else if (isHighlighted) {
                  borderClass = "border-black";
                  bgClass = "bg-gray-50";
                } else if (isEliminated) {
                  borderClass = "border-gray-200";
                  bgClass = "bg-gray-100 opacity-50";
                }

                return (
                  <motion.button
                    key={key}
                    whileHover={
                      reduce || showExplanation ? undefined : { scale: 1.01 }
                    }
                    whileTap={
                      reduce || showExplanation ? undefined : { scale: 0.99 }
                    }
                    onClick={() => {
                      if (!showExplanation) {
                        setHighlightedAnswer(key);
                      }
                    }}
                    disabled={showExplanation}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${borderClass} ${bgClass} ${
                      isEliminated ? "line-through" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-semibold">
                        {key}
                      </div>
                      <div className="flex-1 text-[15px] font-serif text-[#1C1C1E] leading-relaxed">
                        {value}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                      {selectedQuestion.correct_answer}
                    </div>
                    <span className="font-serif text-[15px]">
                      {
                        selectedQuestion.choices[
                          selectedQuestion.correct_answer as keyof typeof selectedQuestion.choices
                        ]
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedQuestion.rationale}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            {!showExplanation && (
              <motion.button
                whileHover={reduce ? undefined : { scale: 1.02 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                onClick={handleAnswerSubmit}
                disabled={!highlightedAnswer}
                className="w-full mt-8 py-4 bg-black text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Submit Answer
              </motion.button>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePreviousQuestion}
                disabled={
                  questions.findIndex(
                    (q) => q.question_id === selectedQuestion.question_id,
                  ) === 0
                }
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={
                  questions.findIndex(
                    (q) => q.question_id === selectedQuestion.question_id,
                  ) ===
                  questions.length - 1
                }
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronLeft size={18} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RWPracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <RWPracticePageContent />
    </Suspense>
  );
}
