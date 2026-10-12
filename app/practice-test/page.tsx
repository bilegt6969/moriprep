"use client";

import DesmosCalculator from "@/components/dsat/DesmosCalculator";
import PreviousAttempts from "@/components/dsat/PreviousAttempts";
import TestResults from "@/components/dsat/TestResults";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { auth } from "@/lib/firebase";
import {
  isAnswerCorrect,
  loadAttempts,
  newAttemptId,
  saveAttempt,
  type ModuleRecord,
  type TestAttempt,
} from "@/lib/test-attempts";
import { DSATQuestion } from "@/types/dsat";
import { onAuthStateChanged } from "firebase/auth";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  type Variants,
} from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Bookmark,
  ChevronDown,
  ChevronLeft,
  Clock,
  Command,
  Copy,
  FileText,
  Highlighter,
  History,
  Info,
  Maximize2,
  Minimize2,
  Moon,
  MoreVertical,
  Pause,
  Play,
  Trash2,
  Underline as UnderlineIcon,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

// SAT Timing (in minutes)
const SAT_TIMING = {
  rw: {
    module1: 32,
    module2: 32,
  },
  math: {
    module1: 35,
    module2: 35,
  },
};

// Available practice tests
const PRACTICE_TESTS = [
  {
    id: "october-sat",
    name: "October 2026 SAT",
    description:
      "Full-length SAT practice test with adaptive Reading & Writing and Math modules",
    sections: ["Reading & Writing", "Math"],
    duration: "2h 14m",
    questions: 98,
    iconName: "FileText",
    accent: "#0080FF",
  },
  {
    id: "march-sat",
    name: "March 2024 SAT",
    description: "Official College Board practice test from March 2024",
    sections: ["Reading & Writing", "Math"],
    duration: "2h 14m",
    questions: 98,
    iconName: "FileText",
    accent: "#10B981",
    comingSoon: true,
  },
  {
    id: "custom-test",
    name: "Custom Practice",
    description:
      "Build your own practice test by selecting specific domains and skills",
    sections: ["Reading & Writing", "Math"],
    duration: "Flexible",
    questions: "Variable",
    iconName: "Play",
    accent: "#F966AC",
    comingSoon: true,
  },
];

// --- Motion system (same easing + spring as the dashboard) ---
const selectionEase = [0.22, 1, 0.36, 1] as const;
const selectionSpring = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.8,
} as const;

const selectionContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const selectionItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: selectionEase },
  },
};

// Section pill dot colors: Reading & Writing = green, Math = blue
const sectionDot = (section: string) =>
  /math/i.test(section) ? "#0080FF" : "#10B981";

type PracticeTestItem = (typeof PRACTICE_TESTS)[number];
type SectionName = "Reading and Writing" | "Math";

// Skeleton Loading Components
function PassageSkeletonBlock() {
  return (
    <div className="max-w-3xl mx-auto md:mx-0 space-y-5">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-11/12" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-10/12" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-11/12" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-9/12" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-10/12" />
    </div>
  );
}

function QuestionSkeletonBlock() {
  return (
    <div className="max-w-3xl mx-auto md:mx-0">
      <div className="mb-6 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-11/12" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-10/12" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-11/12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonFooter() {
  return (
    <footer className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <div className="w-24 h-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24 h-9 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
        <div className="w-20 h-9 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
        <div className="w-20 h-9 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
      </div>
    </footer>
  );
}

function SkeletonHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-2.5 border-b border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-900 z-40 relative sticky top-0">
      <div className="flex items-center gap-6 w-1/3">
        <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="flex flex-col items-center justify-center w-1/3">
        <div className="w-16 h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1.5" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="w-14 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 w-1/3">
        <div className="w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse ml-2" />
      </div>
    </header>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col h-screen max-w-[1920px] mx-auto bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 overflow-auto md:overflow-hidden">
      <SkeletonHeader />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 overflow-hidden bg-white dark:bg-gray-900 md:border-r md:border-gray-200 dark:border-gray-700">
          <div className="p-6 sm:p-8 md:p-10">
            <PassageSkeletonBlock />
          </div>
        </div>
        <div className="w-full md:w-1/2 overflow-hidden flex flex-col">
          <div className="px-6 md:px-8 py-3 bg-white dark:bg-gray-900 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between gap-2 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full px-2 py-1.5">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-8 h-8 bg-gray-300/70 rounded-lg animate-pulse shrink-0" />
                <div className="w-32 h-9 bg-gray-300/70 rounded-full animate-pulse hidden sm:block" />
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-6 md:p-8 pt-5 sm:pt-6 pb-6">
            <QuestionSkeletonBlock />
          </div>
        </div>
      </div>
      <SkeletonFooter />
    </div>
  );
}

function PracticeTestCard({
  test,
  onStart,
}: {
  test: PracticeTestItem;
  onStart: () => void;
}) {
  const reduce = useReducedMotion();
  const available = !test.comingSoon;
  const Icon = test.iconName === "FileText" ? FileText : Play;

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, ${test.accent}22, transparent 70%)`;

  return (
    <motion.article
      variants={selectionItem}
      whileHover={available && !reduce ? { y: -4 } : undefined}
      transition={selectionSpring}
      onMouseMove={(e) => {
        if (!available || reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className={`group relative flex flex-col overflow-hidden rounded-[28px] bg-[#f5f5f7] p-6 text-[#1d1d1f] transition-shadow duration-500 md:p-7 ${
        available ? "hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)]" : ""
      }`}
    >
      {available && (
        <motion.div
          aria-hidden="true"
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      <div className="relative z-10 flex flex-1 flex-col">
        <span
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: available ? test.accent : "#c7c7cc" }}
        >
          <Icon className="h-5 w-5" />
        </span>

        <h3
          className={`mb-2 text-[24px] font-medium tracking-[-0.025em] ${
            available ? "" : "text-[#6e6e73]"
          }`}
        >
          {test.name}
        </h3>
        <p
          className="mb-5 text-[15px] leading-[1.55] text-[#494440]"
          style={{ letterSpacing: "-0.01em" }}
        >
          {test.description}
        </p>

        <ul className="mb-6 flex flex-wrap gap-2">
          {test.sections.map((section) => (
            <li
              key={section}
              className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: available ? sectionDot(section) : "#c7c7cc",
                }}
              />
              {section}
            </li>
          ))}
        </ul>

        <div className="mb-7 grid grid-cols-2 rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(0,0,0,0.06)]">
          <div className="px-5 py-4">
            <p className="mb-1 flex items-center gap-1.5 text-[13px] font-medium text-[#86868b]">
              <Clock size={13} strokeWidth={2.25} />
              Duration
            </p>
            <p className="text-[20px] font-medium tracking-[-0.02em] tabular-nums">
              {test.duration}
            </p>
          </div>
          <div className="border-l-2 border-[#f2f0ed] px-5 py-4">
            <p className="mb-1 flex items-center gap-1.5 text-[13px] font-medium text-[#86868b]">
              <FileText size={13} strokeWidth={2.25} />
              Questions
            </p>
            <p className="text-[20px] font-medium tracking-[-0.02em] tabular-nums">
              {test.questions}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          {available ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={selectionSpring}
              className="relative -mx-1.5 block p-1.5"
            >
              <div className="pointer-events-none absolute inset-0 rounded-full border border-gray-400/40" />
              <button
                type="button"
                onClick={onStart}
                className="group/btn relative z-10 flex h-12 w-full items-center justify-between rounded-[32px] border border-white/10 bg-[#171717]/80 pl-6 pr-2.5 text-[16px] font-medium leading-none tracking-[-0.01em] text-white backdrop-blur-[10px] transition-colors duration-150 hover:bg-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/50"
              >
                Start test
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover/btn:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </motion.div>
          ) : (
            <button
              type="button"
              disabled
              className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-black/[0.05] text-[15px] font-medium text-[#86868b]"
            >
              Coming soon
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function PracticeTestSelection() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-white px-2 py-4 font-sans antialiased selection:bg-gray-200 selection:text-black md:px-6 lg:px-10 overflow-auto">
      <motion.div
        variants={selectionContainer}
        initial={reduce || !mounted ? false : "hidden"}
        animate={mounted ? "show" : false}
        className="mx-auto w-full max-w-6xl flex flex-col pb-16"
      >
        <motion.header
          variants={selectionItem}
          className="mb-6 md:mb-8 shrink-0"
        >
          <h1 className="max-w-3xl text-[38px] font-medium leading-[1.05] tracking-[-0.035em] text-[#1d1d1f] md:text-[48px]">
            Practice tests
          </h1>
          <p
            className="mt-3 max-w-xl text-base text-[#86868b] md:text-lg"
            style={{ letterSpacing: "-0.01em" }}
          >
            Select a practice test to begin your SAT preparation.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {PRACTICE_TESTS.map((test) => (
            <PracticeTestCard
              key={test.id}
              test={test}
              onStart={() => router.push(`/practice-test?test=${test.id}`)}
            />
          ))}
        </div>

        <motion.div variants={selectionItem}>
          <PreviousAttempts />
        </motion.div>
      </motion.div>
    </main>
  );
}

export default function PracticeTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get("test");
  const attemptId = searchParams.get("attempt");

  const [user, setUser] = useState<any>(null);
  // Derived from the URL so client-side navigation (e.g. View analysis) always updates the page.
  const showSelection = !testId && !attemptId;
  const [questions, setQuestions] = useState<DSATQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [selectedSection, setSelectedSection] = useState<SectionName>(
    "Reading and Writing",
  );
  const [timeRemaining, setTimeRemaining] = useState(
    SAT_TIMING.rw.module1 * 60,
  );
  const [module, setModule] = useState<1 | 2>(1);
  const [module2Difficulty, setModule2Difficulty] = useState<
    "Easy" | "Hard" | "Medium" | null
  >(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [finishedAttempt, setFinishedAttempt] = useState<TestAttempt | null>(
    null,
  );
  const [viewedAttempt, setViewedAttempt] = useState<
    TestAttempt | "missing" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [highlightedAnswer, setHighlightedAnswer] = useState<string>("");
  const [isCrossOutMode, setIsCrossOutMode] = useState(false);
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const [eliminatedChoices, setEliminatedChoices] = useState<Set<string>>(
    new Set(),
  );
  const [showCalculator, setShowCalculator] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved === "true";
    }
    return false;
  });
  const [isHighlightActive, setIsHighlightActive] = useState(false);
  const [highlightMenu, setHighlightMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [highlightedText, setHighlightedText] = useState<Set<string>>(
    new Set(),
  );
  const [showUnderlineSubmenu, setShowUnderlineSubmenu] = useState(false);
  const [menuDisplayColor, setMenuDisplayColor] = useState<string>("");
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(
    null,
  );
  const [leftPaneWidth, setLeftPaneWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [imageZoomLevels, setImageZoomLevels] = useState<
    Record<number, number>
  >({});
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [questionAttempts] = useState<any[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const passageRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  // Every finished module is recorded here so the results page can review all
  // questions (not just the last module).
  const recordsRef = useRef<ModuleRecord[]>([]);
  // Always points at the newest handleModuleComplete (fixes stale timer closure).
  const completeRef = useRef<() => void>(() => {});
  // Always holds the newest state, read by handleModuleComplete.
  const latest = useRef<any>({});
  latest.current = {
    answers: selectedAnswers,
    questions,
    marked: markedQuestions,
    module,
    section: selectedSection,
    difficulty: module2Difficulty,
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isMath = selectedSection === "Math";

  // Shared helpers for Math content
  const graphicsBlock =
    currentQuestion?.has_graphic &&
    currentQuestion.graphics?.length > 0 &&
    !currentQuestion.choice_graphics ? (
      <div className="my-4">
        {currentQuestion.graphics.map((graphic: any, idx: number) => {
          const zoom = imageZoomLevels[idx] ?? 100;
          const imagePath =
            typeof graphic === "string" ? graphic : graphic.image_path;
          return (
            <div key={idx} className="mb-6 flex items-start gap-3">
              {imagePath && (
                <div className="flex-1 min-w-0 overflow-auto">
                  <img
                    src={imagePath}
                    alt="Question graphic"
                    style={{ width: `${zoom}%` }}
                    className="h-auto rounded-lg border border-gray-200 transition-[width] duration-150"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.display = "none")
                    }
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => adjustImageZoom(idx, 20)}
                  disabled={zoom >= 200}
                  className="w-9 h-9 flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50 rounded-full disabled:opacity-40 text-gray-600"
                >
                  <ZoomIn size={16} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => adjustImageZoom(idx, -20)}
                  disabled={zoom <= 50}
                  className="w-9 h-9 flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50 rounded-full disabled:opacity-40 text-gray-600"
                >
                  <ZoomOut size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    ) : null;

  const tableBlock =
    currentQuestion?.table?.columns && !currentQuestion.has_graphic ? (
      <div className="my-4 overflow-x-auto">
        <table className="border border-gray-300 text-base">
          <thead>
            <tr>
              {currentQuestion.table.columns.map((c: string) => (
                <th
                  key={c}
                  className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentQuestion.table.rows.map((row: string[], i: number) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : null;

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/sign-in");
      } else {
        setUser(user);
        if (attemptId) {
          // A test we just finished is already in memory (even if storage failed).
          if (finishedAttempt?.id !== attemptId) {
            setViewedAttempt(
              loadAttempts(user.uid).find((a) => a.id === attemptId) ??
                "missing",
            );
          }
        } else if (testId) {
          loadModule1Questions();
        }
      }
    });
    return () => unsubscribe();
  }, [router, testId, attemptId]);

  useEffect(() => {
    if (timeRemaining > 0 && !showResults && !isTimeUp && !isTimerPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimeUp(true);
            completeRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeRemaining, showResults, isTimeUp, isTimerPaused, module]);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    if (!currentQuestion) return;
    setIsQuestionLoading(true);
    const timer = setTimeout(() => setIsQuestionLoading(false), 300);
    return () => clearTimeout(timer);
  }, [currentQuestion?.question_id]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  const loadModule1Questions = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      recordsRef.current = [];
      setShowResults(false);
      setFinishedAttempt(null);
      setViewedAttempt(null);
      setIsTimeUp(false);
      setModule2Difficulty(null);
      setSelectedSection("Reading and Writing");
      const response = await fetch(
        `/api/questions?test=Reading and Writing&source=october_sat&module_level=standard`,
      );
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        setLoadError("No questions found for this test.");
      } else {
        setQuestions(data);
        setModule(1);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setSelectedAnswer("");
        setEliminatedChoices(new Set());
        setMarkedQuestions(new Set());
        setTimeRemaining(SAT_TIMING.rw.module1 * 60);
      }
      setIsTimerPaused(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading questions:", error);
      setLoadError("Failed to load questions. Please try again.");
      setIsLoading(false);
    }
  };

  // Saves the finished attempt and shows the results page.
  const finishTest = () => {
    const attempt: TestAttempt = {
      id: newAttemptId(),
      testId: testId ?? "october-sat",
      testName: "October 2026 SAT",
      date: new Date().toISOString(),
      modules: recordsRef.current,
    };
    saveAttempt(attempt, auth?.currentUser?.uid);
    setFinishedAttempt(attempt);
    setShowResults(true);
    router.replace(`/practice-test?attempt=${attempt.id}`);
  };

  const loadModule2Questions = async (
    difficulty: "Easy" | "Hard" | "Medium",
    section: SectionName,
  ) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const moduleLevel =
        difficulty === "Easy"
          ? "easy"
          : difficulty === "Hard"
            ? "hard"
            : "standard";
      const testParam = section;
      const response = await fetch(
        `/api/questions?test=${testParam}&source=october_sat&module_level=${moduleLevel}`,
      );
      const data = await response.json();
      const applyQuestions = (qs: DSATQuestion[]) => {
        setQuestions(qs);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setSelectedAnswer("");
        setEliminatedChoices(new Set());
        setMarkedQuestions(new Set());
        setTimeRemaining(
          testParam === "Math"
            ? SAT_TIMING.math.module2 * 60
            : SAT_TIMING.rw.module2 * 60,
        );
        setIsTimeUp(false);
        setIsTimerPaused(false);
        setIsLoading(false);
      };
      if (!Array.isArray(data) || data.length === 0) {
        const fallbackResponse = await fetch(
          `/api/questions?test=${testParam}&source=october_sat&module_level=standard`,
        );
        const fallbackData = await fallbackResponse.json();
        if (Array.isArray(fallbackData) && fallbackData.length > 0) {
          applyQuestions(fallbackData);
          return;
        }
        setIsLoading(false);
        finishTest();
        return;
      }
      applyQuestions(data);
    } catch (error) {
      console.error("Error loading Module 2 questions:", error);
      setLoadError("Failed to load Module 2 questions. Please try again.");
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleAnswerHighlight = (key: string) => {
    setHighlightedAnswer(key);
    handleAnswerSelect(key);
  };

  const toggleMarkForReview = () => {
    if (!currentQuestion) return;
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.question_id)) {
        newSet.delete(currentQuestion.question_id);
      } else {
        newSet.add(currentQuestion.question_id);
      }
      return newSet;
    });
  };

  const toggleElimination = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setEliminatedChoices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setHighlightedAnswer("");
      setEliminatedChoices(new Set());
    } else {
      handleModuleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer("");
      setHighlightedAnswer("");
      setEliminatedChoices(new Set());
    }
  };

  const handleModuleComplete = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const {
      answers,
      questions: qs,
      marked,
      module: mod,
      section,
      difficulty,
    } = latest.current as {
      answers: Record<number, string>;
      questions: DSATQuestion[];
      marked: Set<string>;
      module: 1 | 2;
      section: SectionName;
      difficulty: "Easy" | "Hard" | "Medium" | null;
    };

    if (qs.length === 0) return;
    // Ignore double fires (timer + button).
    if (
      recordsRef.current.some((r) => r.section === section && r.module === mod)
    ) {
      return;
    }

    recordsRef.current = [
      ...recordsRef.current,
      {
        section,
        module: mod,
        difficulty: mod === 2 ? difficulty : null,
        questions: qs,
        answers,
        marked: [...marked],
      },
    ];

    if (mod === 1) {
      const responses = qs.map((q, index) => ({
        questionId: q.question_id,
        isCorrect: isAnswerCorrect(q, answers[index]),
        difficulty: q.difficulty,
      }));

      let nextDifficulty: "Easy" | "Hard" | "Medium" = "Medium";
      try {
        const routingResponse = await fetch("/api/adaptive-routing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ responses, method: "EAP" }),
        });
        if (!routingResponse.ok) {
          throw new Error(`Routing API failed: ${routingResponse.status}`);
        }
        const routingData = await routingResponse.json();
        nextDifficulty = routingData.routing.module2Difficulty;
      } catch (error) {
        console.error("Error determining routing:", error);
      }

      setModule2Difficulty(nextDifficulty);
      setModule(2);
      // keep the live ref in sync so the next module's record carries it
      latest.current = {
        ...latest.current,
        module: 2,
        difficulty: nextDifficulty,
      };
      await loadModule2Questions(nextDifficulty, section);
    } else if (section === "Reading and Writing") {
      // RW done -> start Math module 1
      setSelectedSection("Math");
      setModule(1);
      setModule2Difficulty(null);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setSelectedAnswer("");
      setEliminatedChoices(new Set());
      setMarkedQuestions(new Set());
      setQuestions([]);
      setTimeRemaining(SAT_TIMING.math.module1 * 60);
      setIsTimeUp(false);
      setIsLoading(true);

      try {
        const response = await fetch(
          "/api/questions?test=Math&source=october_sat&module_level=standard",
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          finishTest();
        }
      } catch (error) {
        console.error("Error loading Math questions:", error);
        setIsLoading(false);
        setLoadError("Failed to load Math questions. Please try again.");
      }
    } else {
      // Math module 2 done -> results
      finishTest();
    }
  };
  completeRef.current = handleModuleComplete;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleGoBack = () => {
    router.push("/practice-test");
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = leftPaneWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth =
        startWidth + ((e.clientX - startX) / window.innerWidth) * 100;
      setLeftPaneWidth(Math.max(30, Math.min(70, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() && isHighlightActive) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setCurrentSelection(selection);
      setHighlightMenu({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    } else {
      setHighlightMenu({ visible: false, x: 0, y: 0 });
    }
  };

  const handleWordDoubleClick = () => {};

  const applyHighlight = (color: string) => {
    setMenuDisplayColor(color);
    setHighlightMenu({ visible: false, x: 0, y: 0 });
  };

  const applyUnderlineStyle = (_style: string) => {
    setShowUnderlineSubmenu(false);
  };

  const clearHighlights = () => {
    setHighlightedText(new Set());
  };

  const adjustImageZoom = (idx: number, delta: number) => {
    setImageZoomLevels((prev) => {
      const current = prev[idx] ?? 100;
      const next = Math.min(200, Math.max(50, current + delta));
      return { ...prev, [idx]: next };
    });
  };

  const memoizedPassage = useMemo(() => {
    if (!currentQuestion?.passage) return null;

    if (currentQuestion.notes && currentQuestion.notes.length > 0) {
      return (
        <>
          {currentQuestion.introduction && (
            <span
              className="text-[17px] sm:text-[19px] leading-[1.7] text-[#1C1C1E] dark:text-gray-100 font-serif"
              dangerouslySetInnerHTML={{ __html: currentQuestion.introduction }}
            />
          )}
          <span
            className={`text-[17px] sm:text-[19px] leading-[1.7] text-[#1C1C1E] dark:text-gray-100 font-serif ${currentQuestion.introduction ? "pl-12" : ""}`}
          >
            While researching a topic, a student has taken the following notes:{" "}
            {currentQuestion.notes.map((note: string, idx: number) => (
              <span key={idx}>
                {idx > 0 && "; "}
                {note}
              </span>
            ))}
          </span>
        </>
      );
    }

    let htmlContent = currentQuestion.passage;
    htmlContent = htmlContent.replace(/\[Graph:.*?\]/g, "");
    htmlContent = htmlContent.replace(/\[Table:.*?\]/g, "");

    if (currentQuestion.table && currentQuestion.table.title) {
      const tableTitle = currentQuestion.table.title;
      const parts = htmlContent.split(tableTitle);
      if (parts.length > 1) {
        const afterTable = parts[1];
        const lines = afterTable.split("\n");
        const paragraphLines = lines.filter((line) => {
          const trimmed = line.trim();
          return trimmed && !trimmed.includes("|");
        });
        htmlContent = paragraphLines.join(" ").trim();
      }
    }

    if (currentQuestion.has_underline && currentQuestion.underlined_text) {
      htmlContent = htmlContent.replace(
        currentQuestion.underlined_text,
        `<u class="bg-gray-200 dark:bg-gray-700 px-1">${currentQuestion.underlined_text}</u>`,
      );
    }

    const hasText1 = htmlContent.includes("Text 1");
    const hasText2 = htmlContent.includes("Text 2");

    if (hasText1 && hasText2) {
      const parts = htmlContent.split("Text 2");
      const text1Part = parts[0].replace("Text 1", "<strong>Text 1</strong> ");
      const text2Part = parts[1] ? ` <strong>Text 2</strong> ${parts[1]}` : "";
      htmlContent = text1Part + text2Part;
    }

    // Replace all line breaks with spaces for inline display
    htmlContent = htmlContent.replace(/\n+/g, " ");
    htmlContent = htmlContent.replace(/<br\s*\/?>/gi, " ");
    htmlContent = htmlContent.replace(/<\/p>\s*<p>/gi, " ");
    htmlContent = htmlContent.replace(/<\/?p>/gi, "");

    return (
      <>
        {currentQuestion.introduction && (
          <span
            className="text-[17px] sm:text-[19px] leading-[1.7] text-[#1C1C1E] dark:text-gray-100 font-serif"
            dangerouslySetInnerHTML={{ __html: currentQuestion.introduction }}
          />
        )}
        <span
          className={`text-[17px] sm:text-[19px] leading-[1.7] text-[#1C1C1E] dark:text-gray-100 font-serif ${currentQuestion.introduction ? "pl-12" : ""}`}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </>
    );
  }, [
    currentQuestion?.passage,
    currentQuestion?.introduction,
    currentQuestion?.has_underline,
    currentQuestion?.underlined_text,
    currentQuestion?.notes,
  ]);

  const exitToSelection = () => {
    router.push("/practice-test");
  };

  if (showSelection) {
    return <PracticeTestSelection />;
  }

  // Results: a saved attempt (?attempt=<id>) or the one we just finished.
  if (attemptId) {
    const attempt =
      finishedAttempt?.id === attemptId ? finishedAttempt : viewedAttempt;
    if (attempt === "missing") {
      return (
        <div className="flex min-h-screen items-center justify-center bg-white text-gray-700">
          <div className="text-center">
            <p className="text-xl font-medium mb-4">Attempt not found.</p>
            <button
              onClick={exitToSelection}
              className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Back to practice tests
            </button>
          </div>
        </div>
      );
    }
    if (!attempt) return <SkeletonLoader />;
    return <TestResults attempt={attempt} onExitAction={exitToSelection} />;
  }

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (loadError || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-700">
        <div className="text-center">
          <p className="text-xl font-medium mb-4">{loadError ?? "Loading…"}</p>
          {loadError && (
            <button
              onClick={() => {
                setLoadError(null);
                router.push("/practice-test");
              }}
              className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Go back to test selection
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {currentQuestion && (
        <div className="flex flex-col min-h-screen md:h-screen max-w-[1920px] mx-auto bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 overflow-auto md:overflow-hidden selection:bg-cyan-200 relative">
          {highlightMenu.visible && (
            <div
              className="dsat-highlight-toolbar fixed z-100 flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 max-w-[90vw]"
              style={{
                top: highlightMenu.y,
                left: highlightMenu.x,
                transform: "translate(-50%, -100%)",
              }}
            >
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyHighlight("bg-yellow-200/80")}
                className={`w-7 h-7 rounded-full bg-[#fde68a] border-2 transition-transform ${menuDisplayColor === "bg-yellow-200/80" ? "border-black" : "border-transparent"}`}
              />
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyHighlight("bg-blue-200/80")}
                className={`w-7 h-7 rounded-full bg-[#bfdbfe] border-2 transition-transform ${menuDisplayColor === "bg-blue-200/80" ? "border-black" : "border-transparent"}`}
              />
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyHighlight("bg-pink-200/80")}
                className={`w-7 h-7 rounded-full bg-[#fbcfe8] border-2 transition-transform ${menuDisplayColor === "bg-pink-200/80" ? "border-black" : "border-transparent"}`}
              />
              <div className="w-[1px] h-6 bg-gray-200 mx-1" />
              <div className="relative">
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUnderlineSubmenu((v) => !v);
                  }}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <UnderlineIcon size={18} />
                </button>
                {showUnderlineSubmenu && (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute top-10 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-gray-100 py-1 w-16 z-50 flex flex-col items-center"
                  >
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyUnderlineStyle("solid")}
                      className="w-full py-2.5 flex items-center justify-center hover:bg-gray-50 rounded-lg"
                    >
                      <span className="text-base font-serif border-b-2 border-gray-700 leading-none px-1">
                        U
                      </span>
                    </button>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyUnderlineStyle("dashed")}
                      className="w-full py-2.5 flex items-center justify-center hover:bg-gray-50 rounded-lg"
                    >
                      <span className="text-base font-serif border-b-2 border-dashed border-gray-700 leading-none px-1">
                        U
                      </span>
                    </button>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyUnderlineStyle("dotted")}
                      className="w-full py-2.5 flex items-center justify-center hover:bg-gray-50 rounded-lg"
                    >
                      <span className="text-base font-serif border-b-2 border-dotted border-gray-700 leading-none px-1">
                        U
                      </span>
                    </button>
                    <div className="w-8 h-px bg-gray-100 my-1" />
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyUnderlineStyle("none")}
                      className="w-full py-2 text-xs text-gray-500 hover:bg-gray-50 rounded-lg"
                    >
                      None
                    </button>
                  </div>
                )}
              </div>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  const text = currentSelection?.toString() || "";
                  navigator.clipboard.writeText(text).catch((err) => {
                    console.error("Clipboard write failed:", err);
                  });
                  setHighlightMenu({ visible: false, x: 0, y: 0 });
                }}
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Copy size={18} />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  clearHighlights();
                  setHighlightMenu({ visible: false, x: 0, y: 0 });
                }}
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}

          <header className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 py-3 sm:py-2.5 shrink-0 bg-white dark:bg-gray-900 z-40 relative border-b-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 sm:gap-6 w-auto sm:w-1/3 relative">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 text-base sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-200 transition-colors"
              >
                <ChevronLeft
                  size={18}
                  strokeWidth={2}
                  className="w-[18px] h-[18px] sm:w-[16px] sm:h-[16px]"
                />{" "}
                Go back
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowDirections(!showDirections)}
                  className="directions-btn flex items-center gap-1.5 text-base sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-200 transition-colors"
                >
                  Directions{" "}
                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    className="mt-0.5 w-[16px] h-[16px] sm:w-[14px] sm:h-[14px]"
                  />
                </button>
                {showDirections && (
                  <div className="directions-menu absolute top-10 left-0 w-[90vw] max-w-[550px] bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-gray-200 dark:border-gray-700 p-6 z-50 text-[15px] leading-relaxed text-gray-800 dark:text-gray-200">
                    The questions in this section address a number of important
                    reading and writing skills. Each question includes one or
                    more passages, which may include a table or graph. Read each
                    passage and question carefully, and then choose the best
                    answer to the question based on the passage(s).
                    <br />
                    <br />
                    All questions in this section are multiple-choice with four
                    answer choices. Each question has a single best answer.
                  </div>
                )}
              </div>
            </div>

            <div className="order-3 sm:order-none flex flex-col items-center justify-center w-full sm:w-1/3 pt-2 sm:pt-0">
              <div className="text-[20px] font-bold tracking-wide text-black dark:text-gray-100 mb-1.5 h-7 flex items-center">
                {isTimerHidden ? (
                  <Clock
                    size={20}
                    className="text-gray-400 dark:text-gray-500"
                  />
                ) : (
                  formatTime(timeRemaining)
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  {isTimerPaused ? (
                    <Play
                      size={12}
                      strokeWidth={2.5}
                      className="text-gray-500 dark:text-gray-400 fill-gray-500 dark:fill-gray-400"
                    />
                  ) : (
                    <Pause
                      size={12}
                      strokeWidth={2.5}
                      className="text-gray-500 dark:text-gray-400 fill-gray-500 dark:fill-gray-400"
                    />
                  )}
                </button>
                <button
                  onClick={() => setIsTimerHidden(!isTimerHidden)}
                  className="px-3 py-0.5 border border-gray-200 dark:border-gray-600 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {isTimerHidden ? "Show" : "Hide"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:gap-3 w-auto sm:w-1/3 relative">
              <button
                onClick={() => setIsHighlightActive(!isHighlightActive)}
                className={`flex flex-col items-center justify-center rounded-2xl px-5 py-1.5 transition-colors ${isHighlightActive ? "bg-cyan-100/50 text-cyan-400" : "text-gray-500 hover:text-black hover:bg-gray-50"}`}
              >
                <Highlighter
                  size={16}
                  strokeWidth={2.5}
                  className={
                    isHighlightActive ? "text-cyan-400" : "text-gray-500"
                  }
                />
                <span
                  className="text-[10px] font-bold tracking-wide mt-0.5"
                  style={{ color: isHighlightActive ? "#2DD4BF" : "" }}
                >
                  Highlight
                </span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="more-btn flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl px-3 py-1.5 transition-colors"
                >
                  <MoreVertical size={16} strokeWidth={2.5} />
                  <span className="text-[10px] font-bold tracking-wide mt-1">
                    More
                  </span>
                </button>
                {showMoreMenu && (
                  <div className="more-menu absolute top-14 right-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-gray-700 py-2 z-50">
                    <button
                      onClick={toggleFullscreen}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {isFullscreen ? (
                        <Minimize2
                          size={18}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      ) : (
                        <Maximize2
                          size={18}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      )}
                      {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Command
                        size={18}
                        className="text-gray-400 dark:text-gray-500"
                      />{" "}
                      Keyboard shortcuts
                    </button>
                    <button
                      onClick={toggleDarkMode}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Moon
                        size={18}
                        className="text-gray-400 dark:text-gray-500"
                      />{" "}
                      Switch to
                      {isDarkMode ? " light mode" : " dark mode"}
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <AlertCircle
                        size={18}
                        className="text-gray-400 dark:text-gray-500"
                      />{" "}
                      Bug Report
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-2">
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1 bg-white">
                  <span className="text-sm font-semibold text-gray-700">
                    #{currentQuestion?.question_id || "N/A"}
                  </span>
                </div>
                {currentQuestion?.difficulty && (
                  <div className="flex items-center gap-1.5 rounded-full px-3 py-1 bg-white">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex flex-col flex-1 min-h-0 overflow-auto md:overflow-hidden relative">
            <div className="w-full flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
              {isMath ? (
                // Math: question pane + full-height calculator pane
                <div className="flex flex-1 min-h-0 w-full bg-white dark:bg-gray-900">
                  {/* Question pane */}
                  <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
                    {/* Toolbar */}
                    <div className="sticky top-0 z-10 px-6 md:px-8 py-3 bg-white dark:bg-gray-900 w-full max-w-3xl mx-auto">
                      <div className="flex items-center justify-between gap-2 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full px-2 py-1.5">
                        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                          <div className="bg-black text-white w-8 h-8 rounded-full text-[15px] font-bold flex items-center justify-center shrink-0">
                            {currentQuestionIndex + 1}
                          </div>
                          <button
                            onClick={toggleMarkForReview}
                            className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border-2 whitespace-nowrap transition-colors ${
                              markedQuestions.has(currentQuestion.question_id)
                                ? "bg-gray-900 border-gray-900 text-white"
                                : "border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            <Bookmark
                              size={16}
                              strokeWidth={2.5}
                              className={
                                markedQuestions.has(currentQuestion.question_id)
                                  ? "text-white fill-white"
                                  : "text-gray-600"
                              }
                            />
                            <span className="hidden sm:inline">
                              Mark for Review
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setIsCrossOutMode(!isCrossOutMode)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center relative border-2 transition-colors ${
                              isCrossOutMode
                                ? "bg-sky-400 border-sky-500 text-white"
                                : "border-transparent text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            <span className="font-sans font-bold text-xs">
                              S
                            </span>
                            <div className="absolute w-[16px] h-[1.5px] bg-current -rotate-45" />
                          </button>
                          <button
                            onClick={() => setShowCalculator(!showCalculator)}
                            className={`px-3 py-1.5 rounded-full border-2 text-sm font-semibold transition-colors ${
                              showCalculator
                                ? "bg-sky-400 border-sky-500 text-white"
                                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            Calculator
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Question content */}
                    <div
                      className={`${showCalculator ? "" : "mx-auto"} px-6 md:px-8 pb-8 pt-2 w-full max-w-3xl`}
                    >
                      {isQuestionLoading ? (
                        <QuestionSkeletonBlock />
                      ) : (
                        <>
                          <div className="mb-6 text-[17px] sm:text-[19px] font-serif text-[#1C1C1E] dark:text-gray-100 leading-relaxed">
                            {currentQuestion.question}
                          </div>

                          {graphicsBlock}
                          {tableBlock}

                          {currentQuestion.choices &&
                          Object.keys(currentQuestion.choices).length > 0 ? (
                            <div className="space-y-3">
                              {Object.entries(currentQuestion.choices).map(
                                ([key, value]) => {
                                  const isSelected = selectedAnswer === key;
                                  const isHighlighted =
                                    highlightedAnswer === key;
                                  const isEliminated =
                                    eliminatedChoices.has(key);

                                  const borderClass = isHighlighted
                                    ? "border-sky-500"
                                    : isEliminated
                                      ? "border-gray-300 bg-gray-50/40"
                                      : "border-gray-600 hover:border-gray-900";
                                  const textClass = isEliminated
                                    ? "text-gray-400 line-through"
                                    : "text-[#1C1C1E] dark:text-gray-100";

                                  return (
                                    <div
                                      key={key}
                                      onClick={() => handleAnswerHighlight(key)}
                                      className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all bg-white dark:bg-gray-800 min-w-0 cursor-pointer ${borderClass}`}
                                    >
                                      <div
                                        className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-sm font-bold font-sans ${
                                          isHighlighted
                                            ? "bg-sky-500 text-white"
                                            : isSelected
                                              ? "bg-black text-white"
                                              : isEliminated
                                                ? "border-2 border-gray-300 text-gray-400"
                                                : "border-2 border-gray-600 text-[#1C1C1E] dark:text-gray-100"
                                        }`}
                                      >
                                        {key}
                                      </div>

                                      {currentQuestion.choice_graphics?.[
                                        key
                                      ] ? (
                                        <img
                                          src={
                                            currentQuestion.choice_graphics[key]
                                          }
                                          alt={`Choice ${key}`}
                                          className="h-auto max-w-full"
                                        />
                                      ) : (
                                        <span
                                          className={`text-[17px] sm:text-[19px] font-serif leading-relaxed flex-1 min-w-0 ${textClass}`}
                                        >
                                          {value}
                                        </span>
                                      )}

                                      {isCrossOutMode && (
                                        <button
                                          onClick={(e) =>
                                            toggleElimination(e, key)
                                          }
                                          className="flex items-center justify-center w-9 h-9 shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full ml-2"
                                        >
                                          <div className="relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-500 text-gray-600 text-[11px] font-bold font-sans">
                                            {key}
                                            <div className="absolute w-full h-[1.5px] bg-current -rotate-45" />
                                          </div>
                                        </button>
                                      )}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          ) : (
                            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <p className="text-gray-600 dark:text-gray-400">
                                Enter your answer below.
                              </p>
                              <input
                                value={
                                  selectedAnswers[currentQuestionIndex] ?? ""
                                }
                                onChange={(e) =>
                                  handleAnswerSelect(e.target.value)
                                }
                                placeholder="Enter your answer"
                                className="mt-4 w-full max-w-xs p-4 rounded border-2 border-gray-300 font-mono text-xl text-center dark:bg-gray-900"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Calculator pane: full height, no padding */}
                  <AnimatePresence>
                    {showCalculator && (
                      <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "50%", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="hidden md:flex flex-col shrink-0 border-l-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 shrink-0">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Graphing Calculator
                          </h3>
                          <button
                            onClick={() => setShowCalculator(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <X
                              size={18}
                              className="text-gray-600 dark:text-gray-400"
                            />
                          </button>
                        </div>
                        <div className="flex-1 min-h-0">
                          <DesmosCalculator />
                        </div>
                      </motion.aside>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Reading & Writing: Split pane layout
                <>
                  <div
                    style={
                      !isMobile ? { width: `${leftPaneWidth}%` } : undefined
                    }
                    className={`passage-content w-full md:w-auto shrink-0 md:shrink p-6 sm:p-8 md:p-10 overflow-y-auto md:overflow-y-auto bg-white dark:bg-gray-900 ${isHighlightActive ? "cursor-text" : "cursor-default"}`}
                    onClick={handleWordDoubleClick}
                  >
                    {isQuestionLoading ? (
                      <PassageSkeletonBlock />
                    ) : (
                      <div
                        ref={passageRef}
                        className="max-w-3xl mx-auto md:mx-0 text-[17px] sm:text-[19px] leading-[1.7] text-[#1C1C1E] dark:text-gray-100 font-serif"
                      >
                        {memoizedPassage && (
                          <div className="mb-6">{memoizedPassage}</div>
                        )}
                        {currentQuestion.has_graphic &&
                          currentQuestion.graphics &&
                          currentQuestion.graphics.length > 0 && (
                            <div className="my-4">
                              {currentQuestion.graphics.map((graphic, idx) => {
                                const zoom = imageZoomLevels[idx] ?? 100;
                                const imagePath =
                                  typeof graphic === "string"
                                    ? graphic
                                    : graphic.image_path;
                                return (
                                  <div
                                    key={idx}
                                    className="mb-6 flex items-start gap-3"
                                  >
                                    {imagePath && (
                                      <div className="flex-1 min-w-0 overflow-auto">
                                        <img
                                          src={imagePath}
                                          alt="Question graphic"
                                          style={{ width: `${zoom}%` }}
                                          className="h-auto rounded-lg border border-gray-200 transition-[width] duration-150"
                                          onError={(e) => {
                                            (
                                              e.target as HTMLImageElement
                                            ).style.display = "none";
                                          }}
                                        />
                                      </div>
                                    )}
                                    <div className="flex flex-col gap-2 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => adjustImageZoom(idx, 20)}
                                        disabled={zoom >= 200}
                                        aria-label="Zoom in"
                                        className="w-9 h-9 flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-40 disabled:hover:bg-transparent text-gray-600"
                                      >
                                        <ZoomIn size={16} strokeWidth={2} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          adjustImageZoom(idx, -20)
                                        }
                                        disabled={zoom <= 50}
                                        aria-label="Zoom out"
                                        className="w-9 h-9 flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-40 disabled:hover:bg-transparent text-gray-600"
                                      >
                                        <ZoomOut size={16} strokeWidth={2} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  {isMobile ? (
                    <div className="h-px w-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                  ) : (
                    <div
                      role="separator"
                      aria-orientation="vertical"
                      className="group hidden md:flex w-3 relative flex-col items-center justify-center shrink-0 z-10 cursor-col-resize"
                      onMouseDown={handleMouseDown}
                    >
                      <div
                        className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 transition-colors ${isResizing ? "bg-sky-400" : "bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"}`}
                      />
                      <div
                        className={`relative w-2 h-10 rounded-full transition-colors ${isResizing ? "bg-sky-400" : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"}`}
                      />
                    </div>
                  )}

                  <div
                    style={
                      !isMobile
                        ? {
                            width: `${100 - leftPaneWidth}%`,
                          }
                        : undefined
                    }
                    className="w-full md:w-auto bg-white dark:bg-gray-900 flex flex-col relative overflow-auto md:overflow-hidden"
                  >
                    <div className="px-6 md:px-8 py-3 bg-white dark:bg-gray-900 sticky top-0 z-10">
                      <div className="flex items-center justify-between gap-2 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full px-2 py-1.5">
                        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                          <div className="bg-black text-white w-8 h-8 rounded-full text-[15px] font-bold flex items-center justify-center shrink-0">
                            {currentQuestionIndex + 1}
                          </div>

                          <button
                            onClick={toggleMarkForReview}
                            className={`flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-1.5 rounded-full border-2 whitespace-nowrap ${markedQuestions.has(currentQuestion.question_id) ? "bg-gray-900 dark:bg-gray-700 border-gray-900 dark:border-gray-600 text-white" : "border-transparent text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                          >
                            <Bookmark
                              size={16}
                              strokeWidth={2.5}
                              className={
                                markedQuestions.has(currentQuestion.question_id)
                                  ? "text-white fill-white shrink-0"
                                  : "text-gray-600 shrink-0"
                              }
                            />
                            <span className="hidden sm:inline">
                              Mark for Review
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              if (currentQuestion) {
                                const questionText =
                                  currentQuestion.question || "";
                                const choices = Object.entries(
                                  currentQuestion.choices || {},
                                )
                                  .map(([key, value]) => `${key}. ${value}`)
                                  .join("\n");
                                const fullText = `${questionText}\n\n${choices}`;
                                navigator.clipboard
                                  .writeText(fullText)
                                  .catch((err) => {
                                    console.error(
                                      "Clipboard write failed:",
                                      err,
                                    );
                                  });
                              }
                            }}
                            className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <Copy size={16} strokeWidth={2} />
                          </button>

                          <button
                            onClick={() => setIsCrossOutMode(!isCrossOutMode)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center relative border-2 transition-colors ${isCrossOutMode ? "bg-sky-400 border-sky-500 text-white" : "border-transparent text-gray-900 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                          >
                            <span className="font-sans font-bold text-xs">
                              S
                            </span>
                            <div className="absolute w-[16px] h-[1.5px] bg-current -rotate-45" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      ref={questionRef}
                      className={`p-5 sm:p-6 md:p-8 pt-5 sm:pt-6 pb-6 overflow-y-auto flex-1 ${isHighlightActive ? "cursor-text" : "cursor-default"}`}
                      onMouseUp={handleTextSelection}
                      onClick={handleWordDoubleClick}
                    >
                      {isQuestionLoading ? (
                        <QuestionSkeletonBlock />
                      ) : (
                        <div className="max-w-3xl mx-auto md:mx-0">
                          {(currentQuestion.prompt ||
                            currentQuestion.question) && (
                            <div className="mb-6 text-[17px] sm:text-[19px] font-serif text-[#1C1C1E] dark:text-gray-100 leading-relaxed">
                              {currentQuestion.prompt ||
                                currentQuestion.question}
                            </div>
                          )}

                          {currentQuestion.choices &&
                          Object.keys(currentQuestion.choices).length > 0 ? (
                            <div className="space-y-3">
                              {Object.entries(currentQuestion.choices).map(
                                ([key, value]) => {
                                  const isSelected = selectedAnswer === key;
                                  const isHighlighted =
                                    highlightedAnswer === key;
                                  const isEliminated =
                                    eliminatedChoices.has(key);

                                  let borderClass = "border-gray-400";
                                  let bgClass = "bg-white dark:bg-gray-800";
                                  let textClass = isEliminated
                                    ? "text-gray-400 dark:text-gray-500 line-through"
                                    : "text-[#1C1C1E] dark:text-gray-100";

                                  if (isHighlighted) {
                                    borderClass = "border-sky-500";
                                    bgClass = "bg-white dark:bg-gray-800";
                                  } else if (!isEliminated) {
                                    borderClass =
                                      "border-gray-600 hover:border-gray-900";
                                  } else {
                                    borderClass =
                                      "border-gray-300 bg-gray-50/40";
                                  }

                                  return (
                                    <div
                                      key={key}
                                      onClick={() => handleAnswerHighlight(key)}
                                      className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${borderClass} ${bgClass} min-w-0 cursor-pointer`}
                                    >
                                      <div
                                        className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-sm font-bold font-sans transition-colors ${
                                          isHighlighted
                                            ? "bg-sky-500 text-white"
                                            : isSelected
                                              ? "bg-black text-white"
                                              : isEliminated
                                                ? "border-2 border-gray-300 text-gray-400"
                                                : "border-2 border-gray-600 text-[#1C1C1E] dark:text-gray-100"
                                        }`}
                                      >
                                        {key}
                                      </div>

                                      {currentQuestion.choice_graphics?.[
                                        key
                                      ] ? (
                                        <img
                                          src={
                                            currentQuestion.choice_graphics[key]
                                          }
                                          alt={`Choice ${key}`}
                                          className="h-auto max-w-full"
                                        />
                                      ) : (
                                        <span
                                          className={`text-[17px] sm:text-[19px] font-serif leading-relaxed flex-1 min-w-0 ${textClass}`}
                                        >
                                          {value}
                                        </span>
                                      )}

                                      {isCrossOutMode && (
                                        <button
                                          onClick={(e) =>
                                            toggleElimination(e, key)
                                          }
                                          className="flex items-center justify-center w-9 h-9 shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors relative ml-2"
                                        >
                                          <div
                                            className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 text-[11px] font-bold font-sans ${isEliminated ? "border-gray-400 dark:border-gray-600 text-gray-400 dark:text-gray-500" : "border-gray-500 dark:border-gray-400 text-gray-600 dark:text-gray-300 group-hover:border-gray-800 dark:group-hover:border-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200"}`}
                                          >
                                            {key}
                                            <div className="absolute w-full h-[1.5px] bg-current -rotate-45" />
                                          </div>
                                        </button>
                                      )}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          ) : (
                            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <p className="text-gray-600 dark:text-gray-400">
                                This is a student-produced response question.
                                Enter your answer in the grid provided.
                              </p>
                              <input
                                value={
                                  selectedAnswers[currentQuestionIndex] ?? ""
                                }
                                onChange={(e) =>
                                  handleAnswerSelect(e.target.value)
                                }
                                placeholder="Enter your answer"
                                className="mt-4 w-full max-w-xs p-4 rounded border-2 border-gray-300 font-mono text-xl text-center dark:bg-gray-900"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>

          <footer className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 py-2.5 sm:py-3 border-t-2 border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-900 relative z-50">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowQuestionBank(!showQuestionBank)}
                className="question-bank-btn flex items-center gap-2 text-white bg-black px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-800"
              >
                <span>
                  {currentQuestionIndex + 1} of {questions.length}
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  className={showQuestionBank ? "rotate-180" : ""}
                />
              </button>

              {questionAttempts.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-700 transition-all active:scale-95 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                >
                  <History size={16} strokeWidth={2} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 relative overflow-x-auto max-w-full no-scrollbar">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="info-btn p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-full transition-colors"
              >
                <Info size={16} strokeWidth={2} />
              </button>

              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-5 py-1.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full text-sm font-bold disabled:opacity-50 transition-colors"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-1.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full text-sm font-bold transition-colors"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Submit Module"
                  : "Next"}
              </button>
            </div>

            {showInfo && (
              <div className="info-menu absolute bottom-20 right-4 sm:right-[350px] w-[calc(100vw-2rem)] max-w-72 bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-gray-200 dark:border-gray-700 p-4 z-50">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                  Question Details
                </h4>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold shrink-0">Question ID:</span>
                    <span className="flex-1 min-w-0 text-right">
                      {currentQuestion?.question_id || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold shrink-0">Domain:</span>
                    <span className="flex-1 min-w-0 text-right">
                      {currentQuestion?.domain || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold shrink-0">Skill:</span>
                    <span className="flex-1 min-w-0 text-right">
                      {currentQuestion?.skill || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold shrink-0">Difficulty:</span>
                    <span className="flex-1 min-w-0 text-right">
                      {currentQuestion?.difficulty || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {showQuestionBank && (
              <div className="absolute bottom-20 left-4 sm:left-6 w-[calc(100vw-2rem)] max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-gray-200 dark:border-gray-700 p-4 z-50 max-h-96 overflow-y-auto">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                  Question Navigator
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentQuestionIndex(index);
                        setSelectedAnswer("");
                        setHighlightedAnswer("");
                        setEliminatedChoices(new Set());
                        setShowQuestionBank(false);
                      }}
                      className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${
                        index === currentQuestionIndex
                          ? "bg-black dark:bg-gray-600 text-white"
                          : selectedAnswers[index]
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-600"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {/* Fdfd ff*/}
              </div>
            )}
          </footer>
        </div>
      )}
    </>
  );
}
