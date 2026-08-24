"use client";

import {
  saveAnsweredQuestions,
  saveQuestionReport,
  saveUserProgress,
  updateUserStats,
} from "@/lib/dsat/questions";
import { auth } from "@/lib/firebase";
import { Attempt, DSATQuestion } from "@/types/dsat";
import { onAuthStateChanged } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  Clock,
  Command,
  Copy,
  Flag,
  Highlighter,
  History,
  Info,
  List,
  Maximize2,
  Minimize2,
  Moon,
  MoreVertical,
  Pause,
  Play,
  Shuffle,
  Trash2,
  Underline as UnderlineIcon,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

// Reusable skeleton content blocks (no outer padding — parent supplies it).
// Shared between the initial full-page loader and the brief per-question
// "reloading" flicker so both stay visually in sync with the real layout.
function PassageSkeletonBlock() {
  return (
    <div className="max-w-3xl mx-auto md:mx-0 space-y-5">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-10/12" />
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-9/12" />
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-10/12" />
    </div>
  );
}

function QuestionSkeletonBlock() {
  return (
    <div className="max-w-3xl mx-auto md:mx-0">
      <div className="mb-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-10/12" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-gray-200 bg-white"
          >
            <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton Loading Components
function SkeletonHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-2.5 border-b border-gray-200 shrink-0 bg-white z-40 relative sticky top-0">
      {/* Left: Go back & Directions */}
      <div className="flex items-center gap-6 w-1/3">
        <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
        <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Center: Timer & Controls */}
      <div className="flex flex-col items-center justify-center w-1/3">
        <div className="w-16 h-7 bg-gray-200 rounded animate-pulse mb-1.5" />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-14 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Right: Tools & Badges */}
      <div className="flex items-center justify-end gap-3 w-1/3">
        <div className="w-16 h-10 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="w-12 h-10 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="w-16 h-8 bg-gray-200 rounded-full animate-pulse ml-2" />
      </div>
    </header>
  );
}

function SkeletonPassage() {
  return (
    <div className="p-6 sm:p-8 md:p-10">
      <PassageSkeletonBlock />
    </div>
  );
}

function SkeletonQuestion() {
  return (
    <div className="p-5 sm:p-6 md:p-8 pt-5 sm:pt-6 pb-6">
      <QuestionSkeletonBlock />
    </div>
  );
}

function SkeletonQuestionHeader() {
  return (
    <div className="px-6 md:px-8 py-3 bg-white sticky top-0 z-10 border-b border-gray-200">
      <div className="flex items-center justify-between gap-2 bg-gray-100 border-2 border-gray-200 rounded-full px-2 py-1.5">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-8 h-8 bg-gray-300/70 rounded-lg animate-pulse shrink-0" />
          <div className="w-32 h-9 bg-gray-300/70 rounded-full animate-pulse hidden sm:block" />
          <div className="w-9 h-9 bg-gray-300/70 rounded-full animate-pulse sm:hidden" />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-9 h-9 bg-gray-300/70 rounded-full animate-pulse" />
          <div className="w-9 h-9 bg-gray-300/70 rounded-full animate-pulse" />
          <div className="w-9 h-9 bg-gray-300/70 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function SkeletonFooter() {
  return (
    <footer className="flex items-center justify-between px-6 py-3 border-t border-gray-200 shrink-0 bg-white">
      {/* Left: Navigator & History */}
      <div className="flex items-center gap-4">
        <div className="w-24 h-10 bg-gray-100 rounded-full animate-pulse" />
        <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse" />
      </div>
      {/* Right: Submit & Timer */}
      <div className="flex items-center gap-3">
        <div className="w-24 h-9 bg-gray-100 rounded-full animate-pulse" />
        <div className="w-20 h-9 bg-gray-100 rounded-full animate-pulse" />
        <div className="w-20 h-9 bg-gray-100 rounded-full animate-pulse" />
      </div>
    </footer>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col h-screen max-w-[1920px] mx-auto bg-white font-sans text-gray-900 overflow-hidden">
      <SkeletonHeader />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 overflow-hidden bg-white md:border-r md:border-gray-200">
          <SkeletonPassage />
        </div>
        <div className="w-full md:w-1/2 overflow-hidden flex flex-col">
          <SkeletonQuestionHeader />
          <SkeletonQuestion />
        </div>
      </div>
      <SkeletonFooter />
    </div>
  );
}

function RWPracticePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const domainParam = searchParams.get("domain");
  const domainsParam = searchParams.get("domains");
  const difficultyParam = searchParams.get("difficulty");
  const difficultiesParam = searchParams.get("difficulties");
  const questionIdParam = searchParams.get("question_id");

  const [questions, setQuestions] = useState<any[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [actualTotalQuestions, setActualTotalQuestions] = useState(0);
  const BATCH_SIZE = 24; // Load 2 dozen at a time
  const [selectedQuestion, setSelectedQuestion] = useState<DSATQuestion | null>(
    null,
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [highlightedAnswer, setHighlightedAnswer] = useState<string>("");
  const [isCrossOutMode, setIsCrossOutMode] = useState(false);
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [questionAttempts, setQuestionAttempts] = useState<Attempt[]>([]);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [justAnswered, setJustAnswered] = useState(false);
  const [eliminatedChoices, setEliminatedChoices] = useState<Set<string>>(
    new Set(),
  );

  // Load answered questions from localStorage synchronously for immediate availability
  const getInitialAnsweredQuestions = () => {
    try {
      const savedAnsweredQuestions = localStorage.getItem("answeredQuestions");
      if (savedAnsweredQuestions) {
        const parsed = JSON.parse(savedAnsweredQuestions);
        console.log("Initial load from localStorage, size:", parsed.length);
        return new Map(parsed);
      }
    } catch (e) {
      console.error("Error loading initial answered questions:", e);
    }
    return new Map();
  };

  const getInitialMarkedQuestions = () => {
    try {
      const saved = localStorage.getItem("markedQuestions");
      if (saved) return new Set<string>(JSON.parse(saved));
    } catch (e) {
      console.error("Error loading initial marked questions:", e);
    }
    return new Set<string>();
  };

  const [answeredQuestions, setAnsweredQuestions] = useState<
    Map<string, { isCorrect: boolean; answer: string }>
  >(getInitialAnsweredQuestions());

  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(
    getInitialMarkedQuestions(),
  );

  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    difficultiesParam
      ? difficultiesParam.split(",")
      : difficultyParam
        ? [difficultyParam]
        : ["Easy", "Medium", "Hard"],
  );
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    domainsParam ? domainsParam.split(",") : domainParam ? [domainParam] : [],
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skill, setSkill] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const statusFilterParam = searchParams.get("statusFilter");
  const attemptFilterParam = searchParams.get("attemptFilter");
  const [statusFilter, setStatusFilter] = useState<string>(
    statusFilterParam || "all",
  );
  const [attemptFilter, setAttemptFilter] = useState<string>(
    attemptFilterParam || "all",
  );

  const [user, setUser] = useState<any>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [explanationMode, setExplanationMode] = useState<
    "explanation" | "info"
  >("explanation");
  const [showDirections, setShowDirections] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);
  const [isRemixMode, setIsRemixMode] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [isReturningToSelection, setIsReturningToSelection] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedReportOption, setSelectedReportOption] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [leftPaneWidth, setLeftPaneWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [hasSavedConfig, setHasSavedConfig] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);

  const passageRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  // Handle fullscreen toggle
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

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Track viewport size for responsive split-pane vs stacked layout
  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Brief skeleton flicker whenever the active question changes, so
  // switching questions (Next/Previous/Remix/question bank) feels like a
  // deliberate reload rather than an abrupt content swap.
  useEffect(() => {
    if (!selectedQuestion) return;
    setIsQuestionLoading(true);
    const timer = setTimeout(() => setIsQuestionLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedQuestion?.question_id]);

  // Load answered questions from localStorage on mount or Firebase if user is authenticated
  useEffect(() => {
    const loadAnsweredQuestions = async () => {
      console.log("Loading answered questions, user:", user);
      if (user) {
        try {
          // Load from userProgress collection for attempt/status filtering
          const { collection, getDocs, query, where } = await import(
            "firebase/firestore"
          );
          const { db } = await import("@/lib/firebase");

          if (db) {
            const q = query(
              collection(db, "userProgress"),
              where("userId", "==", user.uid),
            );
            const querySnapshot = await getDocs(q);
            console.log("Firebase query returned docs:", querySnapshot.size);

            const answeredMap = new Map<
              string,
              { isCorrect: boolean; answer: string }
            >();
            querySnapshot.forEach((doc: any) => {
              const data = doc.data();
              console.log("Firebase doc data:", data);
              if (data.attempts && data.attempts.length > 0) {
                const lastAttempt = data.attempts[data.attempts.length - 1];
                // Use question_id to match the field name in questions
                const questionId = data.question_id || data.questionId;
                answeredMap.set(questionId, {
                  isCorrect: lastAttempt.isCorrect,
                  answer: lastAttempt.answer,
                });
              }
            });

            console.log(
              "Setting answeredQuestions from Firebase, size:",
              answeredMap.size,
            );
            setAnsweredQuestions(answeredMap);
          }
        } catch (e) {
          console.error("Error loading answered questions from Firebase:", e);
          // Fallback to localStorage (user-specific)
          const answeredMap = new Map<
            string,
            { isCorrect: boolean; answer: string }
          >();
          // Iterate through all localStorage keys to find attempts for this user
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`attempts_${user.uid}_`)) {
              const questionId = key.replace(`attempts_${user.uid}_`, "");
              try {
                const attempts = JSON.parse(localStorage.getItem(key) || "[]");
                if (attempts.length > 0) {
                  const lastAttempt = attempts[attempts.length - 1];
                  answeredMap.set(questionId, {
                    isCorrect: lastAttempt.isCorrect,
                    answer: lastAttempt.answer,
                  });
                }
              } catch (e) {
                console.error(
                  "Error parsing attempts for question:",
                  questionId,
                  e,
                );
              }
            }
          }
          console.log(
            "Setting answeredQuestions from localStorage (fallback), size:",
            answeredMap.size,
          );
          setAnsweredQuestions(answeredMap);
        }
      } else {
        // Load from localStorage for non-authenticated users (guest)
        const answeredMap = new Map<
          string,
          { isCorrect: boolean; answer: string }
        >();
        // Iterate through all localStorage keys to find attempts for guest
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("attempts_guest_")) {
            const questionId = key.replace("attempts_guest_", "");
            try {
              const attempts = JSON.parse(localStorage.getItem(key) || "[]");
              if (attempts.length > 0) {
                const lastAttempt = attempts[attempts.length - 1];
                answeredMap.set(questionId, {
                  isCorrect: lastAttempt.isCorrect,
                  answer: lastAttempt.answer,
                });
              }
            } catch (e) {
              console.error(
                "Error parsing attempts for question:",
                questionId,
                e,
              );
            }
          }
        }
        console.log(
          "Setting answeredQuestions from localStorage (no auth), size:",
          answeredMap.size,
        );
        setAnsweredQuestions(answeredMap);
      }
    };

    loadAnsweredQuestions();
  }, [user]);

  // Save answered questions to localStorage and Firebase whenever it changes
  useEffect(() => {
    // Always save to localStorage as fallback
    localStorage.setItem(
      "answeredQuestions",
      JSON.stringify(Array.from(answeredQuestions.entries())),
    );

    // Save to Firebase if user is authenticated
    if (user) {
      saveAnsweredQuestions(user.uid, answeredQuestions).catch((e) => {
        console.error("Error saving answered questions to Firebase:", e);
      });
    }
  }, [answeredQuestions, user]);

  // Save marked questions to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "markedQuestions",
      JSON.stringify(Array.from(markedQuestions)),
    );
  }, [markedQuestions]);

  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isHighlightActive, setIsHighlightActive] = useState(true);
  const [highlightMenu, setHighlightMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({ visible: false, x: 0, y: 0 });
  const [currentSelection, setCurrentSelection] = useState<Range | null>(null);
  const [activeHighlightColor, setActiveHighlightColor] =
    useState("bg-blue-200/80");
  const [showUnderlineSubmenu, setShowUnderlineSubmenu] = useState(false);
  const [menuDisplayColor, setMenuDisplayColor] = useState<string | null>(
    "bg-yellow-200/80",
  );

  const HIGHLIGHT_COLORS: Record<string, string> = {
    "bg-yellow-200/80": "rgb(253, 230, 138)",
    "bg-blue-200/80": "rgb(191, 219, 254)",
    "bg-pink-200/80": "rgb(251, 207, 232)",
  };

  function getHighlightColorClass(span: HTMLElement): string | null {
    const bg = span.style.backgroundColor;
    const match = Object.entries(HIGHLIGHT_COLORS).find(
      ([, rgb]) => rgb === bg,
    );
    return match ? match[0] : null;
  }

  const cleanupSelectionAndMenu = () => {
    window.getSelection()?.removeAllRanges();
    setCurrentSelection(null);
    setHighlightMenu({ visible: false, x: 0, y: 0 });
    setShowUnderlineSubmenu(false);
  };

  useEffect(() => {
    if (!highlightMenu.visible) setShowUnderlineSubmenu(false);
  }, [highlightMenu.visible]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!showQuestionBank) return;
      const target = e.target as HTMLElement;
      if (
        target.closest(".question-bank-popup") ||
        target.closest(".question-bank-btn")
      ) {
        return;
      }
      setShowQuestionBank(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showQuestionBank]);

  useEffect(() => {
    const savedDifficulty = localStorage.getItem("dsat_difficulty");
    const savedDomains = localStorage.getItem("dsat_domains");
    const savedSkill = localStorage.getItem("dsat_skill");

    // Also check for practiceConfig from the config popup
    const savedPracticeConfig = localStorage.getItem("practiceConfig");
    setHasSavedConfig(!!savedPracticeConfig);

    if (
      savedDifficulty &&
      !domainsParam &&
      !difficultyParam &&
      !difficultiesParam
    )
      setSelectedDifficulties([savedDifficulty]);
    if (savedDomains && !domainsParam && !domainParam)
      setSelectedDomains(JSON.parse(savedDomains));
    if (savedSkill && !domainsParam && !difficultyParam && !difficultiesParam)
      setSkill(savedSkill);

    // If no URL params but have saved practice config, use that
    if (
      !domainsParam &&
      !difficultyParam &&
      !difficultiesParam &&
      !domainParam &&
      savedPracticeConfig
    ) {
      try {
        const config = JSON.parse(savedPracticeConfig);
        if (config.difficulties && config.difficulties.length > 0) {
          setSelectedDifficulties(config.difficulties);
        }
        if (config.domains && config.domains.length > 0) {
          setSelectedDomains(config.domains);
        }
        if (config.skills && config.skills.length > 0) {
          setSelectedSkills(config.skills);
        }
      } catch (e) {
        console.error("Error parsing saved practice config:", e);
      }
    }

    fetchQuestions();
  }, [domainParam, domainsParam, difficultyParam, difficultiesParam]);

  useEffect(() => {
    // Don't re-filter while viewing an answered question (would rip it out
    // of a "not tried" list mid-view) or while the explanation modal is open.
    if (showExplanation || justAnswered) return;
    filterQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    questions,
    selectedDomains,
    selectedDifficulties,
    statusFilter,
    attemptFilter,
    answeredQuestions,
    justAnswered,
  ]);

  useEffect(() => {
    filterQuestions();
    if (
      !domainsParam &&
      !difficultyParam &&
      !difficultiesParam &&
      !domainParam
    ) {
      localStorage.setItem("dsat_difficulty", selectedDifficulties[0] || "");
      localStorage.setItem("dsat_domains", JSON.stringify(selectedDomains));
      localStorage.setItem("dsat_skill", skill);
    }
  }, [
    selectedDifficulties,
    selectedDomains,
    skill,
    domainParam,
    domainsParam,
    difficultyParam,
    difficultiesParam,
  ]);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setIsAuthLoaded(true);
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setEliminatedChoices(new Set());
    setSelectedAnswer("");
    setHighlightedAnswer("");
    setJustAnswered(false);
    // Keep eliminator mode on when moving to next question
    // setIsCrossOutMode(false);
    setShowExplanation(false);
    setElapsedSeconds(0);
    setIsTimerPaused(false);
    showHistory && setShowHistory(false);

    // Clear highlights when moving to a new question
    clearHighlights();

    // Fetch attempt history from localStorage as fallback (user-specific)
    if (selectedQuestion) {
      const userId = user?.uid || "guest";
      const storedAttempts = localStorage.getItem(
        `attempts_${userId}_${selectedQuestion.question_id}`,
      );
      if (storedAttempts) {
        try {
          setQuestionAttempts(JSON.parse(storedAttempts));
        } catch (e) {
          setQuestionAttempts([]);
        }
      } else {
        setQuestionAttempts([]);
      }
    } else {
      setQuestionAttempts([]);
    }
  }, [selectedQuestion, user, isAuthLoaded]);

  useEffect(() => {
    if (!selectedQuestion) return;
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("question_id") !== selectedQuestion.question_id) {
      params.set("question_id", selectedQuestion.question_id);
      router.replace(`/practice/rw?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestion?.question_id]);

  useEffect(() => {
    if (
      !isReturningToSelection &&
      filteredQuestions.length > 0 &&
      !showExplanation &&
      !justAnswered
    ) {
      // If the currently selected question is not in the filtered list, select the first one
      if (
        !selectedQuestion ||
        !filteredQuestions.find(
          (q) => q.question_id === selectedQuestion.question_id,
        )
      ) {
        // If questionIdParam is provided, select that specific question
        if (questionIdParam) {
          const specificQuestion = filteredQuestions.find(
            (q) => q.question_id === questionIdParam,
          );
          if (specificQuestion) {
            setSelectedQuestion(specificQuestion);
            return;
          }
        }
        // Otherwise, select the first question
        setSelectedQuestion(filteredQuestions[0] || null);
      }
    }
  }, [
    domainsParam,
    difficultiesParam,
    difficultyParam,
    domainParam,
    filteredQuestions,
    selectedQuestion,
    isReturningToSelection,
    questionIdParam,
    attemptFilter,
    showExplanation,
    justAnswered,
  ]);

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
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  async function fetchQuestions() {
    try {
      const skillsParam = searchParams.get("skills");

      // Batch pagination (loadMoreQuestions) isn't wired to any scroll/button
      // trigger in the UI, so partial 24-item loads were causing "Next" to run
      // out of questions and the Question Bank popup to show incomplete counts.
      // Just load the whole filtered set — it's at most a few hundred questions.
      const shouldFetchAll = true;

      // Total count for the configured set (domain/skill/difficulty)
      // Note: actualTotalQuestions is no longer used for the footer counter
      // (which now uses filteredQuestions.length), but we keep this for compatibility
      if (domainsParam || difficultiesParam || skillsParam) {
        const countParams = new URLSearchParams();
        if (domainsParam) countParams.append("domain", domainsParam);
        if (difficultiesParam)
          countParams.append("difficulty", difficultiesParam);
        if (skillsParam) countParams.append("skill", skillsParam);

        const countResponse = await fetch(
          `/api/question-stats?${countParams.toString()}`,
        );
        if (countResponse.ok) {
          const countData = await countResponse.json();
          const count = countData.count || countData.total || 0;
          setTotalQuestions(count);
          setActualTotalQuestions(count);
        }
      } else {
        // Default total for RW questions when no filters applied
        // This will be overridden by filterQuestions() once it runs
        setTotalQuestions(0);
        setActualTotalQuestions(0);
      }

      const params = new URLSearchParams();
      if (shouldFetchAll) {
        params.append("limit", "10000");
      } else {
        params.append("limit", BATCH_SIZE.toString());
      }
      if (domainsParam) params.append("domain", domainsParam);
      if (difficultiesParam) params.append("difficulty", difficultiesParam);
      if (skillsParam) params.append("skill", skillsParam);

      const response = await fetch(`/api/questions?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch questions");
      let questionsData = await response.json();

      // If we came in via a question_id and that question isn't in the
      // filtered set (e.g. filters don't match it), fetch it separately
      // and prepend it so it can still be selected.
      if (
        questionIdParam &&
        !questionsData.find((q: any) => q.question_id === questionIdParam)
      ) {
        const singleRes = await fetch(
          `/api/questions?question_id=${questionIdParam}`,
        );
        if (singleRes.ok) {
          const singleData = await singleRes.json();
          if (Array.isArray(singleData) && singleData.length > 0) {
            questionsData = [...singleData, ...questionsData];
          }
        }
      }

      setQuestions(questionsData);
      setFilteredQuestions(questionsData);
      setLoading(false);
      setHasMore(shouldFetchAll ? false : questionsData.length === BATCH_SIZE);
      setCurrentOffset(shouldFetchAll ? 0 : BATCH_SIZE);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  }

  async function loadMoreQuestions() {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      const params = new URLSearchParams();
      params.append("limit", BATCH_SIZE.toString());
      params.append("offset", currentOffset.toString());

      if (domainsParam) params.append("domain", domainsParam);
      if (difficultiesParam) params.append("difficulty", difficultiesParam);
      const skillsParam = searchParams.get("skills");
      if (skillsParam) params.append("skill", skillsParam);

      const response = await fetch(`/api/questions?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch more questions");
      const questionsData = await response.json();

      setQuestions((prev) => [...prev, ...questionsData]);
      setFilteredQuestions((prev) => [...prev, ...questionsData]);
      setCurrentOffset((prev) => prev + BATCH_SIZE);
      setHasMore(questionsData.length === BATCH_SIZE);
    } catch (error) {
      console.error("Error fetching more questions:", error);
    } finally {
      setLoadingMore(false);
    }
  }

  function filterQuestions() {
    let filtered = questions;
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((q) =>
        selectedDifficulties.includes(q.difficulty),
      );
    }
    if (selectedDomains.length > 0) {
      filtered = filtered.filter((q) => selectedDomains.includes(q.domain));
    }
    if (skill !== "all") {
      filtered = filtered.filter((q) => q.skill === skill);
    }

    // Filter by status (correct/incorrect)
    if (statusFilter !== "all") {
      filtered = filtered.filter((q) => {
        const answered = answeredQuestions.get(q.question_id);
        if (!answered) return false;
        return statusFilter === "correct"
          ? answered.isCorrect
          : !answered.isCorrect;
      });
    }

    // Filter by attempt status (tried/not-tried)
    if (attemptFilter !== "all") {
      console.log(
        `Applying attempt filter: ${attemptFilter}, answeredQuestions size: ${answeredQuestions.size}`,
      );
      console.log(
        "Answered question IDs:",
        Array.from(answeredQuestions.keys()),
      );
      filtered = filtered.filter((q) => {
        const attempted = answeredQuestions.has(q.question_id);
        const shouldInclude =
          attemptFilter === "tried" ? attempted : !attempted;
        console.log(
          `Question ${q.question_id}: attempted=${attempted}, attemptFilter=${attemptFilter}, shouldInclude=${shouldInclude}`,
        );
        return shouldInclude;
      });
    }

    setFilteredQuestions(filtered);

    // Always update total questions count to reflect the actual filtered questions
    setTotalQuestions(filtered.length);
  }

  function handleAnswerHighlight(answer: string) {
    if (showExplanation) return;
    setHighlightedAnswer(answer);
  }

  async function handleAnswerSubmit() {
    if (!highlightedAnswer || showExplanation) return;
    setSelectedAnswer(highlightedAnswer);
    setJustAnswered(true);
    if (selectedQuestion) {
      const isCorrect = highlightedAnswer === selectedQuestion.correct_answer;
      setAnsweredQuestions((prev) => {
        const newMap = new Map(prev);
        newMap.set(selectedQuestion.question_id, {
          isCorrect,
          answer: highlightedAnswer,
        });
        return newMap;
      });

      // Stop timer when answer is correct
      if (isCorrect) {
        setIsTimerPaused(true);
      }

      if (selectedQuestion) {
        const timeSpent = Date.now() - questionStartTime;
        // Save to localStorage as fallback (user-specific)
        const userId = user?.uid || "guest";
        const newAttempt: Attempt = {
          answer: highlightedAnswer,
          isCorrect,
          timeSpent,
          attemptedAt: new Date(),
        };

        const storedAttempts = localStorage.getItem(
          `attempts_${userId}_${selectedQuestion.question_id}`,
        );
        const attempts = storedAttempts ? JSON.parse(storedAttempts) : [];
        attempts.push(newAttempt);
        localStorage.setItem(
          `attempts_${userId}_${selectedQuestion.question_id}`,
          JSON.stringify(attempts),
        );
        setQuestionAttempts(attempts);

        // Save to Firebase if user is authenticated
        if (user) {
          try {
            await saveUserProgress(
              user.uid,
              selectedQuestion.question_id,
              highlightedAnswer,
              isCorrect,
              timeSpent,
              selectedQuestion,
            );
            await updateUserStats(user.uid, isCorrect, timeSpent);
          } catch (error) {
            console.error("Error saving to Firebase:", error);
          }
        }
      }
    }
  }

  function toggleElimination(e: React.MouseEvent, key: string) {
    e.stopPropagation();
    if (showExplanation) return;
    setEliminatedChoices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
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
    if (isRemixMode && selectedQuestion) {
      // Add current question to history before navigating
      setNavigationHistory((prev) => [...prev, selectedQuestion.question_id]);

      // Get all questions in the same domain
      const sameDomainQuestions = filteredQuestions.filter(
        (q) =>
          q.domain === selectedQuestion.domain &&
          q.question_id !== selectedQuestion.question_id,
      );

      if (sameDomainQuestions.length > 0) {
        // Select a random question from the same domain
        const randomIndex = Math.floor(
          Math.random() * sameDomainQuestions.length,
        );
        setSelectedQuestion(sameDomainQuestions[randomIndex] || null);
      }
    } else {
      // Normal sequential navigation
      const currentIndex = filteredQuestions.findIndex(
        (q) => q.question_id === selectedQuestion?.question_id,
      );
      if (currentIndex === -1) return; // current question isn't in the list — don't jump anywhere
      if (currentIndex < filteredQuestions.length - 1) {
        setSelectedQuestion(filteredQuestions[currentIndex + 1] || null);
      }
    }
  }

  function handlePreviousQuestion() {
    if (isRemixMode) {
      // Go back through navigation history
      if (navigationHistory.length > 0) {
        const previousQuestionId =
          navigationHistory[navigationHistory.length - 1];
        const previousQuestion = filteredQuestions.find(
          (q) => q.question_id === previousQuestionId,
        );
        if (previousQuestion) {
          setSelectedQuestion(previousQuestion);
          setNavigationHistory((prev) => prev.slice(0, -1));
        }
      }
    } else {
      // Normal sequential navigation
      const currentIndex = filteredQuestions.findIndex(
        (q) => q.question_id === selectedQuestion?.question_id,
      );
      if (currentIndex === -1) return; // current question isn't in the list — don't jump anywhere
      if (currentIndex > 0) {
        setSelectedQuestion(filteredQuestions[currentIndex - 1] || null);
      }
    }
  }

  function handleRemix() {
    setIsRemixMode(!isRemixMode);
    // Reset navigation history when toggling remix mode
    if (!isRemixMode) {
      setNavigationHistory([]);
    }
  }

  function handleGoBack() {
    setIsReturningToSelection(true);
    setSelectedQuestion(null);
  }

  function handleQuestionSelect(index: number) {
    setIsReturningToSelection(false);
    setSelectedQuestion(filteredQuestions[index] || null);
    setShowQuestionPicker(false);
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const container = document.querySelector("main");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const newWidth =
          ((e.clientX - containerRect.left) / containerRect.width) * 100;
        if (newWidth > 20 && newWidth < 80) {
          setLeftPaneWidth(newWidth);
        }
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleTextSelection = () => {
    if (!isHighlightActive) {
      setHighlightMenu({ visible: false, x: 0, y: 0 });
      return;
    }
    const selection = window.getSelection();
    if (
      !selection ||
      selection.rangeCount === 0 ||
      selection.toString().trim().length === 0
    ) {
      setHighlightMenu({ visible: false, x: 0, y: 0 });
      return;
    }
    const range = selection.getRangeAt(0);
    const node = selection.anchorNode;
    const isInsidePassage =
      passageRef.current &&
      node &&
      (passageRef.current === node || passageRef.current.contains(node));
    const isInsideQuestion =
      questionRef.current &&
      node &&
      (questionRef.current === node || questionRef.current.contains(node));

    if (isInsidePassage || isInsideQuestion) {
      const rect = range.getBoundingClientRect();
      setCurrentSelection(range);
      setMenuDisplayColor(activeHighlightColor);

      // --- VIEWPORT BOUNDARY FIX ---

      // 1. Estimate the dimensions of your highlight menu
      const menuWidth = 320;
      const menuHeight = 50;
      const edgePadding = 16; // Gives the menu 16px of breathing room from the screen edge

      // 2. Calculate the default center coordinates
      let menuX = rect.left + rect.width / 2;
      let menuY = rect.top - 10;

      // 3. Prevent cutting off on the Left and Right edges
      // Math.max prevents it from going too far left, Math.min prevents going too far right
      const minX = menuWidth / 2 + edgePadding;
      const maxX = window.innerWidth - menuWidth / 2 - edgePadding;
      menuX = Math.max(minX, Math.min(menuX, maxX));

      // 4. Prevent cutting off on the Top edge
      // If there isn't enough room above the text, flip the menu BELOW the selected text
      if (menuY < menuHeight + edgePadding) {
        // We add menuHeight because your CSS uses translateY(-100%), so this offsets it
        menuY = rect.bottom + 10 + menuHeight;
      }

      // --- END VIEWPORT BOUNDARY FIX ---

      setHighlightMenu({
        visible: true,
        x: menuX,
        y: menuY,
      });
    } else {
      setHighlightMenu({ visible: false, x: 0, y: 0 });
    }
  };

  const wrapRangeMultiNode = (range: Range, span: HTMLElement) => {
    // Whole selection sits inside one text node — surroundContents handles this natively
    if (
      range.startContainer === range.endContainer &&
      range.startContainer.nodeType === Node.TEXT_NODE
    ) {
      range.surroundContents(span);
      return;
    }

    // Selection spans multiple nodes/elements — walk and wrap each intersecting text node
    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) =>
          range.intersectsNode(node)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT,
      },
    );

    const nodes: Text[] = [];
    let n: Node | null;
    while ((n = walker.nextNode())) nodes.push(n as Text);

    nodes.forEach((textNode) => {
      const nodeRange = document.createRange();
      nodeRange.selectNodeContents(textNode);
      if (textNode === range.startContainer)
        nodeRange.setStart(textNode, range.startOffset);
      if (textNode === range.endContainer)
        nodeRange.setEnd(textNode, range.endOffset);
      if (nodeRange.collapsed) return;
      nodeRange.surroundContents(span.cloneNode() as HTMLElement);
    });
  };

  const applyUnderlineStyle = (
    style: "solid" | "dashed" | "dotted" | "none",
    overrideRange?: Range,
  ) => {
    const targetRange = overrideRange || currentSelection;
    if (!targetRange || targetRange.collapsed) {
      cleanupSelectionAndMenu();
      return;
    }

    const node = targetRange.commonAncestorContainer;
    const parentElement =
      node.nodeType === Node.TEXT_NODE
        ? node.parentElement
        : (node as HTMLElement);

    const decorationClasses = [
      "decoration-solid",
      "decoration-dashed",
      "decoration-dotted",
    ];

    if (parentElement && parentElement.classList.contains("dsat-highlight")) {
      parentElement.classList.remove(
        "underline",
        "decoration-2",
        "decoration-gray-400",
        ...decorationClasses,
      );

      if (style !== "none") {
        parentElement.classList.add(
          "underline",
          "decoration-2",
          "decoration-gray-400",
          `decoration-${style}`,
        );
      } else {
        // Pure underline highlight (no background) with underline removed
        // has nothing left to show — unwrap it. Otherwise just leave the
        // background color in place.
        const hasBg =
          parentElement.style.backgroundColor &&
          parentElement.style.backgroundColor !== "transparent";
        if (!hasBg) {
          const parent = parentElement.parentNode;
          if (parent) {
            while (parentElement.firstChild)
              parent.insertBefore(parentElement.firstChild, parentElement);
            parent.removeChild(parentElement);
          }
        }
      }
      cleanupSelectionAndMenu();
      return;
    }

    if (style === "none") {
      cleanupSelectionAndMenu();
      return;
    }

    const span = document.createElement("span");
    span.className = `dsat-highlight underline decoration-2 decoration-gray-400 decoration-${style}`;
    try {
      wrapRangeMultiNode(targetRange, span);
    } catch (e) {
      console.error("Underline error:", e);
    }
    cleanupSelectionAndMenu();
  };

  // FIX: Accept an optional overrideRange parameter
  const applyHighlight = (colorClass: string, overrideRange?: Range) => {
    const targetRange = overrideRange || currentSelection;
    if (!targetRange || targetRange.collapsed) {
      cleanupSelectionAndMenu();
      return;
    }

    setActiveHighlightColor(colorClass);

    const bgColor =
      colorClass === "bg-yellow-200/80"
        ? "#fde68a"
        : colorClass === "bg-pink-200/80"
          ? "#fbcfe8"
          : "#bfdbfe";

    const node = targetRange.commonAncestorContainer;
    const parentElement =
      node.nodeType === Node.TEXT_NODE
        ? node.parentElement
        : (node as HTMLElement);

    if (parentElement && parentElement.classList.contains("dsat-highlight")) {
      const hadUnderline = parentElement.classList.contains("underline");
      const decorationStyle = [
        "decoration-solid",
        "decoration-dashed",
        "decoration-dotted",
      ].find((c) => parentElement.classList.contains(c));
      parentElement.style.backgroundColor = bgColor;
      parentElement.className = "dsat-highlight";
      if (hadUnderline) {
        parentElement.classList.add(
          "underline",
          "decoration-2",
          "decoration-gray-400",
        );
        if (decorationStyle) parentElement.classList.add(decorationStyle);
      }
      cleanupSelectionAndMenu();
      return;
    }

    const span = document.createElement("span");
    span.classList.add("dsat-highlight");
    span.style.backgroundColor = bgColor;
    span.style.padding = "2px 0";
    span.style.borderRadius = "2px";

    try {
      wrapRangeMultiNode(targetRange, span);
    } catch (e) {
      console.error("Highlight error:", e);
    }
    cleanupSelectionAndMenu();
  };

  const clearHighlights = () => {
    // Check both containers efficiently
    [passageRef.current, questionRef.current].forEach((container) => {
      if (container) {
        // ONLY target the specific highlights we dynamically generated
        const highlights = container.querySelectorAll(".dsat-highlight");
        highlights.forEach((highlight) => {
          const parent = highlight.parentNode;
          if (parent) {
            // Replace the span with its inner text
            while (highlight.firstChild) {
              parent.insertBefore(highlight.firstChild, highlight);
            }
            parent.removeChild(highlight);
          }
        });
      }
    });
  };

  const handleWordDoubleClick = (e: React.MouseEvent) => {
    // FIX: Respect the highlighter toggle state
    if (!isHighlightActive) return;

    if (e.detail === 2) {
      setTimeout(() => {
        const selection = window.getSelection();

        if (
          selection &&
          !selection.isCollapsed &&
          selection.toString().trim().length > 0
        ) {
          const range = selection.getRangeAt(0);
          setCurrentSelection(range);

          // FIX: Pass the range directly to bypass React's async state delay
          applyHighlight(activeHighlightColor || "bg-yellow-200", range);
        }
      }, 10);
    }
  };

  // Clear highlights when highlight tool is disabled
  useEffect(() => {
    if (!isHighlightActive) {
      clearHighlights();
    }
  }, [isHighlightActive]);

  // Setup text selection listener for highlighting
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (!isHighlightActive) return;

      const target = e.target as HTMLElement;

      // Clicks inside the highlight toolbar (color swatches, underline submenu,
      // copy/trash) shouldn't trigger a re-check of the text selection — that
      // re-check can close the toolbar/submenu a moment after it opens.
      if (target.closest(".dsat-highlight-toolbar")) return;

      const highlightSpan = target.closest(
        ".dsat-highlight",
      ) as HTMLElement | null;

      if (highlightSpan) {
        // Don't call window.getSelection().addRange() here — the native
        // selection visually competes with the custom pastel background
        // (under `selection:bg-cyan-200`) and makes the highlight look like
        // it disappeared. Build a Range for reference only, no visible select.
        const range = document.createRange();
        range.selectNodeContents(highlightSpan);
        setCurrentSelection(range);
        setMenuDisplayColor(getHighlightColorClass(highlightSpan));

        const rect = highlightSpan.getBoundingClientRect();
        const menuWidth = 320;
        const menuHeight = 50;
        const edgePadding = 16;
        let menuX = rect.left + rect.width / 2;
        let menuY = rect.top - 10;
        const minX = menuWidth / 2 + edgePadding;
        const maxX = window.innerWidth - menuWidth / 2 - edgePadding;
        menuX = Math.max(minX, Math.min(menuX, maxX));
        if (menuY < menuHeight + edgePadding) {
          menuY = rect.bottom + 10 + menuHeight;
        }
        setHighlightMenu({ visible: true, x: menuX, y: menuY });
        return;
      }

      setTimeout(() => {
        handleTextSelection();
      }, 10);
    };

    document.addEventListener("mouseup", handleMouseUp);

    // Debug code to trace selection clearing
    let lastNonEmpty = "";
    const handleSelectionChange = () => {
      const s = window.getSelection()?.toString() || "";
      if (s === "" && lastNonEmpty !== "") {
        console.log(
          "%cSELECTION CLEARED — last value was:",
          "color:red;font-weight:bold",
          lastNonEmpty,
        );
        console.trace();
      }
      if (s !== "") lastNonEmpty = s;
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    // Watch for DOM mutations in passage
    const passageEl = document.querySelector(".passage-content");
    let observer: MutationObserver | null = null;
    if (passageEl) {
      observer = new MutationObserver((mutations) => {
        console.log(
          "%cPASSAGE DOM MUTATED:",
          "color:orange;font-weight:bold",
          mutations,
        );
      });
      observer.observe(passageEl, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (observer) observer.disconnect();
    };
  }, [isHighlightActive]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".directions-menu") &&
        !target.closest(".directions-btn")
      )
        setShowDirections(false);
      if (!target.closest(".more-menu") && !target.closest(".more-btn"))
        setShowMoreMenu(false);
      if (!target.closest(".info-menu") && !target.closest(".info-btn"))
        setShowInfo(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const domainSkills: Record<string, string[]> = {
    "Information and Ideas": [
      "Central Ideas and Details",
      "Inferences",
      "Command of Evidence — Textual",
      "Command of Evidence — Quantitative",
    ],
    "Craft and Structure": [
      "Words in Context",
      "Text Structure and Purpose",
      "Cross-Text Connections",
    ],
    "Expression of Ideas": ["Rhetorical Synthesis", "Transitions"],
    "Standard English Convention": ["Boundaries", "Form Structure and Sense"],
  };
  const domains = Object.keys(domainSkills);
  const availableSkills =
    selectedDomains.length === 0
      ? Array.from(new Set(questions.map((q) => q.skill)))
      : selectedDomains.flatMap((d) => domainSkills[d] || []);

  // Memoize passage to prevent re-render on highlight menu state changes
  const memoizedPassage = useMemo(() => {
    if (!selectedQuestion?.passage) return null;

    const htmlContent =
      selectedQuestion.has_underline && selectedQuestion.underlined_text
        ? selectedQuestion.passage.replace(
            selectedQuestion.underlined_text,
            `<u class="bg-yellow-200 px-1">${selectedQuestion.underlined_text}</u>`,
          )
        : selectedQuestion.passage;

    return (
      <div className="mb-6" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
  }, [
    selectedQuestion?.passage,
    selectedQuestion?.has_underline,
    selectedQuestion?.underlined_text,
  ]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      {selectedQuestion ? (
        <div className="flex flex-col min-h-screen md:h-screen max-w-[1920px] mx-auto bg-white font-sans text-gray-900 overflow-auto md:overflow-hidden selection:bg-cyan-200 relative">
          {/* Highlighter Tool Popover */}
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
                  onMouseDown={(e) => e.preventDefault()}
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

          {/* Top Header Bar strictly matching Screenshot 2026-07-22 at 17.54.13.jpg */}
          <header className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 py-3 sm:py-2.5 shrink-0 bg-white z-40 relative border-b-2 border-gray-200">
            {/* Left: Go back & Directions */}
            <div className="flex items-center gap-3 sm:gap-6 w-auto sm:w-1/3 relative">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 text-base sm:text-sm font-medium text-gray-500 hover:text-black transition-colors"
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
                  className="directions-btn flex items-center gap-1.5 text-base sm:text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                  Directions{" "}
                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    className="mt-0.5 w-[16px] h-[16px] sm:w-[14px] sm:h-[14px]"
                  />
                </button>
                {showDirections && (
                  <div className="directions-menu absolute top-10 left-0 w-[90vw] max-w-[550px] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-gray-200 p-6 z-50 text-[15px] leading-relaxed text-gray-800">
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

            {/* Center: Timer aligned to match screenshot */}
            <div className="order-3 sm:order-none flex flex-col items-center justify-center w-full sm:w-1/3 pt-2 sm:pt-0">
              <div className="text-[20px] font-bold tracking-wide text-black mb-1.5 h-7 flex items-center">
                {isTimerHidden ? (
                  <Clock size={20} className="text-gray-400" />
                ) : (
                  formatTime(elapsedSeconds)
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={isTimerPaused ? "play" : "pause"}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isTimerPaused ? (
                        <Play
                          size={12}
                          strokeWidth={2.5}
                          className="text-red-500 fill-red-500"
                        />
                      ) : (
                        <Pause
                          size={12}
                          strokeWidth={2.5}
                          className="text-gray-500 fill-gray-500"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </button>
                <button
                  onClick={() => setIsTimerHidden(!isTimerHidden)}
                  className="px-3 py-0.5 border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {isTimerHidden ? "Show" : "Hide"}
                </button>
              </div>
            </div>

            {/* Right: Tools & Badges */}
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
                  className="more-btn flex flex-col items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-2xl px-3 py-1.5 transition-colors"
                >
                  <MoreVertical size={16} strokeWidth={2.5} />
                  <span className="text-[10px] font-bold tracking-wide mt-1">
                    More
                  </span>
                </button>
                {showMoreMenu && (
                  <div className="more-menu absolute top-14 right-0 w-64 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50">
                    <button
                      onClick={toggleFullscreen}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {isFullscreen ? (
                        <Minimize2 size={18} className="text-gray-400" />
                      ) : (
                        <Maximize2 size={18} className="text-gray-400" />
                      )}
                      {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                      <Command size={18} className="text-gray-400" /> Keyboard
                      shortcuts
                    </button>
                    <button
                      onClick={toggleDarkMode}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Moon size={18} className="text-gray-400" /> Switch to
                      {isDarkMode ? " light mode" : " dark mode"}
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                      <AlertCircle size={18} className="text-gray-400" /> Bug
                      Report
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-2">
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1 bg-white">
                  <span className="text-sm font-semibold text-gray-700">
                    #{selectedQuestion?.question_id || "N/A"}
                  </span>
                </div>
                {selectedQuestion?.difficulty && (
                  <div className="flex items-center gap-1.5 rounded-full px-3 py-1 bg-white">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {selectedQuestion.difficulty}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Split Content */}
          <main className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
            {/* Left Pane: Reading Material */}
            <div
              style={!isMobile ? { width: `${leftPaneWidth}%` } : undefined}
              className={`passage-content w-full md:w-auto shrink-0 md:shrink p-6 sm:p-8 md:p-10 overflow-y-auto bg-white ${isHighlightActive ? "cursor-text" : "cursor-default"}`}
              onClick={handleWordDoubleClick}
            >
              {isQuestionLoading ? (
                <PassageSkeletonBlock />
              ) : (
                <div
                  ref={passageRef}
                  className="max-w-3xl mx-auto md:mx-0 text-[17px] sm:text-[19px] leading-[1.7] text-[#1C1C1E] font-serif"
                >
                  {selectedQuestion.has_graphic &&
                    selectedQuestion.graphics &&
                    selectedQuestion.graphics.length > 0 && (
                      <div className="my-4">
                        {selectedQuestion.graphics.map((graphic, idx) => (
                          <div key={idx} className="mb-6">
                            {graphic.image_path && (
                              <img
                                src={`/questions_charts/${graphic.image_path.split("/").pop()}`}
                                alt="Question graphic"
                                className="max-w-full h-auto rounded-lg border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  {memoizedPassage}
                </div>
              )}
            </div>

            {/* Divider: draggable hairline on desktop, static rule on mobile */}
            {isMobile ? (
              <div className="h-px w-full bg-gray-200 shrink-0" />
            ) : (
              <div
                role="separator"
                aria-orientation="vertical"
                className="group hidden md:flex w-3 relative flex-col items-center justify-center shrink-0 z-10 cursor-col-resize"
                onMouseDown={handleMouseDown}
              >
                <div
                  className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 transition-colors ${isResizing ? "bg-sky-400" : "bg-gray-200 group-hover:bg-gray-300"}`}
                />
                <div
                  className={`relative w-2 h-10 rounded-full transition-colors ${isResizing ? "bg-sky-400" : "bg-gray-300 group-hover:bg-gray-400"}`}
                />
              </div>
            )}

            {/* Right Pane: Question and Answers */}
            <div
              style={
                !isMobile ? { width: `${100 - leftPaneWidth}%` } : undefined
              }
              className="w-full md:w-auto overflow-y-auto bg-white flex flex-col relative"
            >
              {/* Question Header Bar matching target screenshot: number badge + gray pill container */}
              <div className="px-6 md:px-8 py-3 bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between gap-2 bg-gray-100 border-2 border-gray-200 rounded-full px-2 py-1.5">
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                    <div className="bg-black text-white w-8 h-8 rounded-full text-[15px] font-bold flex items-center justify-center shrink-0">
                      {filteredQuestions.findIndex(
                        (q) => q.question_id === selectedQuestion.question_id,
                      ) + 1}
                    </div>

                    <button
                      onClick={toggleMarkForReview}
                      className={`flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-1.5 rounded-full border-2 whitespace-nowrap ${markedQuestions.has(selectedQuestion.question_id) ? "bg-gray-900 border-gray-900 text-white" : "border-transparent text-gray-700 hover:border-gray-300 hover:bg-gray-200"}`}
                    >
                      <Bookmark
                        size={16}
                        strokeWidth={2.5}
                        className={
                          markedQuestions.has(selectedQuestion.question_id)
                            ? "text-white fill-white shrink-0"
                            : "text-gray-600 shrink-0"
                        }
                      />
                      <span className="hidden sm:inline">Mark for Review</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        if (selectedQuestion) {
                          const passageText = selectedQuestion.passage || "";
                          const questionText = selectedQuestion.question || "";
                          const choices = Object.entries(
                            selectedQuestion.choices || {},
                          )
                            .map(([key, value]) => `${key}. ${value}`)
                            .join("\n");
                          const fullText = `${questionText}\n\n${choices}`;
                          navigator.clipboard
                            .writeText(fullText)
                            .then(() => {
                              setToastMessage("Copied to clipboard");
                              setShowCopyToast(true);
                              setTimeout(() => setShowCopyToast(false), 2000);
                            })
                            .catch((err) => {
                              console.error("Clipboard write failed:", err);
                            });
                        }
                      }}
                      className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-900 border-2 border-transparent hover:border-gray-300 transition-colors rounded-full hover:bg-gray-200"
                    >
                      <Copy size={16} strokeWidth={2} />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedReportOption("");
                        setReportDetails("");
                        setShowReportModal(true);
                      }}
                      className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 border-2 border-transparent hover:border-gray-300 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-200"
                    >
                      <Flag size={16} strokeWidth={2} /> Report
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReportOption("");
                        setReportDetails("");
                        setShowReportModal(true);
                      }}
                      className="sm:hidden w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-900 border-2 border-transparent hover:border-gray-300 transition-colors rounded-full hover:bg-gray-200"
                    >
                      <Flag size={16} strokeWidth={2} />
                    </button>

                    <button
                      onClick={() => setIsCrossOutMode(!isCrossOutMode)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center relative border-2 transition-colors ${isCrossOutMode ? "bg-sky-400 border-sky-500 text-white" : "border-transparent text-gray-900 hover:border-gray-300 hover:bg-gray-200"}`}
                    >
                      <span className="font-sans font-bold text-xs">S</span>
                      <div className="absolute w-[16px] h-[1.5px] bg-current -rotate-45" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Question Area */}
              <div
                ref={questionRef}
                className={`p-5 sm:p-6 md:p-8 pt-5 sm:pt-6 pb-6 ${isHighlightActive ? "cursor-text" : "cursor-default"}`}
                onMouseUp={handleTextSelection}
                onClick={handleWordDoubleClick}
              >
                {isQuestionLoading ? (
                  <QuestionSkeletonBlock />
                ) : (
                  <div className="max-w-3xl mx-auto md:mx-0">
                    {selectedQuestion.prompt && (
                      <div className="mb-6 text-[17px] sm:text-[19px] font-serif text-[#1C1C1E] leading-relaxed">
                        {selectedQuestion.prompt}
                      </div>
                    )}

                    {/* Answers List */}
                    <div className="space-y-3">
                      {Object.entries(selectedQuestion.choices).map(
                        ([key, value]) => {
                          const isSelected = selectedAnswer === key;
                          const isHighlighted = highlightedAnswer === key;
                          const isEliminated = eliminatedChoices.has(key);
                          const isCorrectAnswer =
                            key === selectedQuestion.correct_answer;
                          // Use local session state, not lifetime history — lets you re-attempt a
                          // question you've answered before instead of it being permanently locked
                          // with the old answer revealed.
                          const hasAnswered = !!selectedAnswer;
                          const isWrongSelected =
                            hasAnswered && isSelected && !isCorrectAnswer;
                          const isRightAnswerShown =
                            hasAnswered && isSelected && isCorrectAnswer;

                          let borderClass = "border-gray-400";
                          let bgClass = "bg-white";
                          let textClass = isEliminated
                            ? "text-gray-400 line-through"
                            : "text-[#1C1C1E]";

                          if (hasAnswered) {
                            if (isSelected && isCorrectAnswer) {
                              // Only show correct answer in green if user selected it
                              borderClass = "border-green-600";
                              bgClass = "bg-green-50";
                            } else if (isSelected && !isCorrectAnswer) {
                              // Show wrong answer in red
                              borderClass = "border-red-600";
                              bgClass = "bg-red-50";
                            }
                          } else if (isHighlighted) {
                            borderClass = "border-sky-500";
                            bgClass = "bg-white";
                          } else if (!isEliminated) {
                            borderClass =
                              "border-gray-600 hover:border-gray-900";
                          } else {
                            borderClass = "border-gray-300 bg-gray-50/40";
                          }

                          return (
                            <div
                              key={key}
                              onClick={() =>
                                !hasAnswered && handleAnswerHighlight(key)
                              }
                              className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${borderClass} ${bgClass} min-w-0 ${hasAnswered ? "cursor-default" : "cursor-pointer"}`}
                            >
                              <div
                                className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-sm font-bold font-sans transition-colors ${
                                  isRightAnswerShown
                                    ? "bg-green-600 text-white"
                                    : isWrongSelected
                                      ? "bg-red-600 text-white"
                                      : isHighlighted
                                        ? "bg-sky-500 text-white"
                                        : isSelected
                                          ? "bg-black text-white"
                                          : isEliminated
                                            ? "border-2 border-gray-300 text-gray-400"
                                            : "border-2 border-gray-600 text-[#1C1C1E]"
                                }`}
                              >
                                {isRightAnswerShown ? (
                                  <Check size={16} strokeWidth={3} />
                                ) : isWrongSelected ? (
                                  <X size={16} strokeWidth={3} />
                                ) : (
                                  key
                                )}
                              </div>

                              <span
                                className={`text-[17px] sm:text-[19px] font-serif leading-relaxed flex-1 min-w-0 ${textClass}`}
                              >
                                {value}
                              </span>

                              {isHighlighted &&
                                !hasAnswered &&
                                !showExplanation && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAnswerSubmit();
                                    }}
                                    className="flex items-center justify-center px-4 py-2 shrink-0 bg-sky-500 hover:bg-sky-600 border-2 border-sky-600 rounded-full transition-colors ml-2 text-white text-sm font-semibold"
                                  >
                                    Check
                                  </button>
                                )}

                              {isWrongSelected && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowExplanation(true);
                                  }}
                                  className="flex items-center justify-center px-4 py-2 shrink-0 bg-black hover:bg-gray-800 rounded-full transition-colors ml-2 text-white text-sm font-semibold"
                                >
                                  Explain
                                </button>
                              )}

                              {isCrossOutMode && !hasAnswered && (
                                <button
                                  onClick={(e) => toggleElimination(e, key)}
                                  className="flex items-center justify-center w-9 h-9 shrink-0 hover:bg-gray-100 rounded-full transition-colors relative ml-2"
                                >
                                  <div
                                    className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 text-[11px] font-bold font-sans ${isEliminated ? "border-gray-400 text-gray-400" : "border-gray-500 text-gray-600 group-hover:border-gray-800 group-hover:text-gray-800"}`}
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
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Explanation Modal - Apple Inspired Design */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-6"
                onClick={() => setShowExplanation(false)}
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.92, opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white/95 backdrop-blur-xl rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border border-white/20"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 bg-white/50 border-b border-gray-100/60">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-sm">
                        <Info
                          size={18}
                          className="text-gray-600"
                          strokeWidth={2}
                        />
                      </div>
                      <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">
                        Explanation
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowExplanation(false)}
                      className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all active:scale-95 flex items-center justify-center border border-gray-200/60"
                    >
                      <X size={18} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                    {/* Rationale Section */}
                    <div className="space-y-3 px-2">
                      <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">
                        Step-by-step breakdown
                      </h3>
                      <p className="text-gray-600 leading-[1.7] text-[15px]">
                        {selectedQuestion.rationale}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Footer Navigation matching screenshot perfectly */}
          <footer className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 py-2.5 sm:py-3 border-t-2 border-gray-200 shrink-0 bg-white relative z-50">
            {/* Left: Question Navigator & Reload */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowQuestionBank(!showQuestionBank)}
                className="question-bank-btn flex items-center gap-2 text-white bg-black px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-800"
              >
                <span>
                  {Math.max(
                    1,
                    filteredQuestions.findIndex(
                      (q) => q.question_id === selectedQuestion.question_id,
                    ) + 1,
                  )}{" "}
                  of {Math.max(1, filteredQuestions.length)}
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
                  className="p-2.5 bg-white border border-gray-200/60 rounded-full text-gray-600 hover:text-black hover:border-gray-300 hover:bg-gray-50/80 transition-all active:scale-95 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                >
                  <History size={16} strokeWidth={2} />
                </button>
              )}
            </div>

            {/* Right: Suite of Tools */}
            <div className="flex items-center gap-2 sm:gap-3 relative overflow-x-auto max-w-full no-scrollbar">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="info-btn p-2 text-gray-500 hover:text-gray-800 border-2 border-gray-300 hover:border-gray-400 rounded-full transition-colors"
              >
                <Info size={16} strokeWidth={2} />
              </button>

              <button
                onClick={handleRemix}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-colors ${
                  isRemixMode
                    ? "bg-pink-500 border-pink-600 text-white hover:bg-pink-600"
                    : "bg-pink-50 border-pink-200 text-pink-500 hover:border-pink-400 hover:bg-pink-100"
                }`}
              >
                <Shuffle size={16} strokeWidth={2.5} /> Remix
              </button>

              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 rounded-full text-sm font-bold transition-colors"
              >
                <List size={16} strokeWidth={2.5} /> Explanation
              </button>

              <button
                onClick={handlePreviousQuestion}
                disabled={
                  filteredQuestions.findIndex(
                    (q) => q.question_id === selectedQuestion.question_id,
                  ) === 0
                }
                className="px-5 py-1.5 bg-white border-2 border-gray-300 text-gray-700 hover:text-black hover:border-gray-400 hover:bg-gray-50 rounded-full text-sm font-bold disabled:opacity-50 transition-colors"
              >
                Previous
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={
                  filteredQuestions.findIndex(
                    (q) => q.question_id === selectedQuestion.question_id,
                  ) ===
                  filteredQuestions.length - 1
                }
                className="px-5 py-1.5 bg-white border-2 border-gray-300 text-gray-700 hover:text-black hover:border-gray-400 hover:bg-gray-50 rounded-full text-sm font-bold disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>

            {/* Info Menu Popup */}
            {showInfo && (
              <div className="info-menu absolute bottom-20 right-4 sm:right-[350px] w-[calc(100vw-2rem)] max-w-64 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-gray-200 p-4 z-50">
                <h4 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                  Question Details
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-semibold">Question ID:</span>{" "}
                    <span>{selectedQuestion.question_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Difficulty:</span>{" "}
                    <span className="capitalize">
                      {selectedQuestion.difficulty || "Medium"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Domain:</span>{" "}
                    <span>
                      {selectedQuestion.domain || "Craft & Structure"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Skill:</span>{" "}
                    <span>{selectedQuestion.skill || "Words in Context"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* History Popup */}
            {showHistory && (
              <div className="absolute bottom-20 left-4 sm:left-20 right-4 sm:right-auto w-auto sm:w-[400px] max-w-[calc(100vw-2rem)] max-h-[500px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-gray-200 p-6 z-50 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900">Previous attempts</h4>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-400 hover:text-black"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[400px] space-y-4">
                  {questionAttempts.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                      No previous attempts
                    </p>
                  ) : (
                    questionAttempts.map((attempt, index) => {
                      const date = new Date(attempt.attemptedAt);
                      const timeSpent = Math.floor(attempt.timeSpent / 1000);
                      const minutes = Math.floor(timeSpent / 60)
                        .toString()
                        .padStart(2, "0");
                      const seconds = (timeSpent % 60)
                        .toString()
                        .padStart(2, "0");

                      return (
                        <div
                          key={index}
                          className="bg-gray- rounded-lg p-4 border border-gray-100"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                              Attempt #{index + 1}
                            </span>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${attempt.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                            >
                              {attempt.isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          </div>
                          <div className="text-gray-600 text-sm mb-2">
                            Answer:{" "}
                            <span className="font-semibold">
                              {attempt.answer}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {minutes}:{seconds}
                            </span>
                            <span>
                              {date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Question Bank Popup */}
            {showQuestionBank && (
              <div
                className="question-bank-popup absolute bottom-20 left-4 sm:left-6 right-4 sm:right-auto w-auto sm:w-[600px] max-w-[calc(100vw-2rem)] max-h-[400px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-gray-200 p-6 z-50 overflow-hidden"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900">Question Bank</h4>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-green-500" />
                      <span className="text-gray-600">Correct</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-red-500" />
                      <span className="text-gray-600">Incorrect</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300" />
                      <span className="text-gray-600">Not Attempted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bookmark size={16} className="text-gray-400" />
                      <span className="text-gray-600">For Review</span>
                    </div>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[320px] custom-scrollbar">
                  <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                    {filteredQuestions.map((question, index) => {
                      const answerData = answeredQuestions.get(
                        question.question_id,
                      );
                      const isMarked = markedQuestions.has(
                        question.question_id,
                      );
                      const isSelected =
                        selectedQuestion?.question_id === question.question_id;

                      let bgClass =
                        "bg-gray-100 hover:bg-gray-200 text-gray-600";
                      if (answerData) {
                        if (answerData.isCorrect) {
                          bgClass =
                            "bg-green-500 text-white hover:bg-green-600";
                        } else {
                          bgClass = "bg-red-500 text-white hover:bg-red-600";
                        }
                      }
                      if (isSelected) {
                        bgClass = "bg-black text-white";
                      }

                      return (
                        <button
                          key={question.question_id}
                          onClick={() => handleQuestionSelect(index)}
                          className={`relative w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${bgClass} flex items-center justify-center`}
                        >
                          {index + 1}
                          {isMarked && (
                            <Bookmark
                              size={10}
                              className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-500"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </footer>
        </div>
      ) : (
        /* Show configuration message only if no specific question was requested */
        !questionIdParam && (
          <div className="flex flex-col h-screen bg-white font-sans text-gray-900 items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Configure Your Practice
              </h2>
              <p className="text-gray-600 mb-6">
                Please configure your practice session from the main practice
                page.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push("/practice")}
                  className="px-6 py-3 bg-zinc-900 text-white rounded-full font-medium hover:bg-black transition-colors"
                >
                  Go to Practice
                </button>
                {/* Try to use saved configuration if available */}
                {hasSavedConfig && (
                  <button
                    onClick={() => {
                      const savedConfig =
                        localStorage.getItem("practiceConfig");
                      if (savedConfig) {
                        try {
                          const config = JSON.parse(savedConfig);
                          const params = new URLSearchParams();
                          if (config.difficulties?.length > 0) {
                            params.set(
                              "difficulties",
                              config.difficulties.join(","),
                            );
                          }
                          if (config.domains?.length > 0) {
                            params.set("domains", config.domains.join(","));
                          }
                          if (config.skills?.length > 0) {
                            params.set("skills", config.skills.join(","));
                          }
                          if (
                            config.statusFilter &&
                            config.statusFilter !== "all"
                          ) {
                            params.set("statusFilter", config.statusFilter);
                          }
                          if (
                            config.attemptFilter &&
                            config.attemptFilter !== "all"
                          ) {
                            params.set("attemptFilter", config.attemptFilter);
                          }
                          router.push(`/practice/rw?${params.toString()}`);
                        } catch (e) {
                          console.error("Error parsing saved config:", e);
                          router.push("/practice");
                        }
                      }
                    }}
                    className="px-6 py-3 bg-white text-zinc-900 border border-zinc-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
                  >
                    Use Saved Config
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      )}

      {/* Copy Toast */}
      <AnimatePresence>
        {showCopyToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-200"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-100 p-4 sm:p-6"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 backdrop-blur-xl rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden flex flex-col border border-white/20"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-white/50 border-b border-gray-100/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center shadow-sm">
                    <Flag size={18} className="text-red-500" strokeWidth={2} />
                  </div>
                  <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">
                    Report Question
                  </h2>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all active:scale-95 flex items-center justify-center border border-gray-200/60"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  What issue would you like to report?
                </p>
                <div className="space-y-2 mb-4">
                  {[
                    "Wrong answer",
                    "Unclear question",
                    "Typo or error",
                    "Other",
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedReportOption(option)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm ${
                        selectedReportOption === option
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedReportOption === option
                              ? "border-red-500 bg-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedReportOption === option && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                        {option}
                      </div>
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Please provide more details..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-400 focus:outline-none resize-none text-sm text-gray-700 placeholder-gray-400"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 px-6 py-4 bg-white/50 border-t border-gray-100/60">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!selectedReportOption) {
                      setToastMessage("Please select a report type");
                      setShowCopyToast(true);
                      setTimeout(() => setShowCopyToast(false), 2000);
                      return;
                    }

                    if (user && selectedQuestion) {
                      try {
                        await saveQuestionReport(
                          user.uid,
                          selectedQuestion.question_id,
                          selectedReportOption,
                          reportDetails,
                        );
                        setShowReportModal(false);
                        setToastMessage("Report submitted");
                        setShowCopyToast(true);
                        setTimeout(() => setShowCopyToast(false), 2000);
                      } catch (error) {
                        console.error("Error submitting report:", error);
                        setToastMessage("Failed to submit report");
                        setShowCopyToast(true);
                        setTimeout(() => setShowCopyToast(false), 2000);
                      }
                    } else {
                      setToastMessage("Please sign in to report");
                      setShowCopyToast(true);
                      setTimeout(() => setShowCopyToast(false), 2000);
                    }
                  }}
                  className="flex-1 px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
      <style jsx global>{`
        .passage-content,
        .passage-content * {
          user-select: text !important;
          -webkit-user-select: text !important;
        }
        .dsat-highlight {
          cursor: pointer;
          transition: opacity 0.15s ease;
        }
        .dsat-highlight:hover {
          opacity: 0.6;
        }
      `}</style>
    </Suspense>
  );
}
