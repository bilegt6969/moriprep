"use client";

import {
  getAnsweredQuestions,
  saveAnsweredQuestions,
  saveUserProgress,
  updateUserStats,
} from "@/lib/dsat/questions";
import { auth } from "@/lib/firebase";
import { Attempt, DSATQuestion } from "@/types/dsat";
import { onAuthStateChanged } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BellOff,
  Bookmark,
  CheckCircle2,
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

// Skeleton Loading Components
function SkeletonHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0 bg-white z-40 relative sticky top-0">
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
        <div className="w-16 h-12 bg-gray-200 rounded-[20px] animate-pulse" />
        <div className="w-12 h-12 bg-gray-200 rounded-[20px] animate-pulse" />
        <div className="w-16 h-8 bg-gray-200 rounded-full animate-pulse ml-2" />
      </div>
    </header>
  );
}

function SkeletonPassage() {
  return (
    <div className="p-10 md:p-12">
      <div className="max-w-3xl space-y-5">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-10/12" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-9/12" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-10/12" />
      </div>
    </div>
  );
}

function SkeletonQuestion() {
  return (
    <div className="p-8 md:p-12 pt-8 pb-8">
      <div className="mb-8 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-11/12" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-10/12" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-200 bg-white"
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

function SkeletonQuestionHeader() {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      {/* Left: Number & Mark for Review */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-28 h-5 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-9 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonFooter() {
  return (
    <footer className="flex items-center justify-between px-6 py-4 border-t border-gray-200 shrink-0 bg-white">
      {/* Left: Navigator & History */}
      <div className="flex items-center gap-3">
        <div className="w-24 h-9 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* Right: Suite of Tools */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-9 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-28 h-9 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-24 h-9 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-24 h-9 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </footer>
  );
}

function RWPracticePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const domainParam = searchParams.get("domain");
  const domainsParam = searchParams.get("domains");
  const difficultyParam = searchParams.get("difficulty");
  const difficultiesParam = searchParams.get("difficulties");

  const [questions, setQuestions] = useState<any[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
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
  const [eliminatedChoices, setEliminatedChoices] = useState<Set<string>>(
    new Set(),
  );
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Map<string, { isCorrect: boolean; answer: string }>
  >(new Map());

  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    difficultiesParam
      ? difficultiesParam.split(",")
      : difficultyParam
        ? [difficultyParam]
        : [],
  );
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    domainsParam ? domainsParam.split(",") : domainParam ? [domainParam] : [],
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skill, setSkill] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [attemptFilter, setAttemptFilter] = useState<string>("all");

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

  const [leftPaneWidth, setLeftPaneWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [hasSavedConfig, setHasSavedConfig] = useState(false);

  const passageRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  // Load answered questions from localStorage on mount or Firebase if user is authenticated
  useEffect(() => {
    const loadAnsweredQuestions = async () => {
      if (user) {
        try {
          const firebaseAnsweredQuestions = await getAnsweredQuestions(
            user.uid,
          );
          setAnsweredQuestions(firebaseAnsweredQuestions);
        } catch (e) {
          console.error("Error loading answered questions from Firebase:", e);
          // Fallback to localStorage
          const savedAnsweredQuestions =
            localStorage.getItem("answeredQuestions");
          if (savedAnsweredQuestions) {
            try {
              const parsed = JSON.parse(savedAnsweredQuestions);
              setAnsweredQuestions(new Map(parsed));
            } catch (e) {
              console.error(
                "Error loading answered questions from localStorage:",
                e,
              );
            }
          }
        }
      } else {
        // Load from localStorage for non-authenticated users
        const savedAnsweredQuestions =
          localStorage.getItem("answeredQuestions");
        if (savedAnsweredQuestions) {
          try {
            const parsed = JSON.parse(savedAnsweredQuestions);
            setAnsweredQuestions(new Map(parsed));
          } catch (e) {
            console.error(
              "Error loading answered questions from localStorage:",
              e,
            );
          }
        }
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
    filterQuestions();
  }, [
    questions,
    selectedDomains,
    selectedDifficulties,
    statusFilter,
    attemptFilter,
    answeredQuestions,
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
    // Keep eliminator mode on when moving to next question
    // setIsCrossOutMode(false);
    setShowExplanation(false);
    setElapsedSeconds(0);
    setIsTimerPaused(false);
    showHistory && setShowHistory(false);

    // Clear highlights when moving to a new question
    clearHighlights();

    // Fetch attempt history from localStorage as fallback
    if (selectedQuestion) {
      const storedAttempts = localStorage.getItem(
        `attempts_${selectedQuestion.question_id}`,
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
    if (
      !isReturningToSelection &&
      filteredQuestions.length > 0 &&
      !selectedQuestion
    ) {
      setSelectedQuestion(filteredQuestions[0] || null);
    }
  }, [
    domainsParam,
    difficultiesParam,
    difficultyParam,
    domainParam,
    filteredQuestions,
    selectedQuestion,
    isReturningToSelection,
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
      // First, get the total count
      const countParams = new URLSearchParams();
      if (domainsParam) countParams.append("domain", domainsParam);
      if (difficultiesParam)
        countParams.append("difficulty", difficultiesParam);
      const skillsParam = searchParams.get("skills");
      if (skillsParam) countParams.append("skill", skillsParam);
      countParams.append("count_only", "true");

      const countResponse = await fetch(
        `/api/questions?${countParams.toString()}`,
      );
      if (countResponse.ok) {
        const countData = await countResponse.json();
        setTotalQuestions(countData.count || 0);
      }

      // Then fetch the questions
      const params = new URLSearchParams();
      params.append("limit", BATCH_SIZE.toString());

      if (domainsParam) params.append("domain", domainsParam);
      if (difficultiesParam) params.append("difficulty", difficultiesParam);
      if (skillsParam) params.append("skill", skillsParam);

      const response = await fetch(`/api/questions?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch questions");
      const questionsData = await response.json();
      setQuestions(questionsData);
      setFilteredQuestions(questionsData);
      setLoading(false);
      setHasMore(questionsData.length === BATCH_SIZE);
      setCurrentOffset(BATCH_SIZE);
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
      filtered = filtered.filter((q) => {
        const attempted = answeredQuestions.has(q.question_id);
        return attemptFilter === "tried" ? attempted : !attempted;
      });
    }

    setFilteredQuestions(filtered);
  }

  function handleAnswerHighlight(answer: string) {
    if (showExplanation) return;
    setHighlightedAnswer(answer);
  }

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

      // Stop timer when answer is correct
      if (isCorrect) {
        setIsTimerPaused(true);
      }

      // Clear highlights when answer is submitted
      clearHighlights();

      if (selectedQuestion) {
        const timeSpent = Date.now() - questionStartTime;
        // Save to localStorage as fallback
        const newAttempt: Attempt = {
          answer: highlightedAnswer,
          isCorrect,
          timeSpent,
          attemptedAt: new Date(),
        };

        const storedAttempts = localStorage.getItem(
          `attempts_${selectedQuestion.question_id}`,
        );
        const attempts = storedAttempts ? JSON.parse(storedAttempts) : [];
        attempts.push(newAttempt);
        localStorage.setItem(
          `attempts_${selectedQuestion.question_id}`,
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

  // FIX: Accept an optional overrideRange parameter
  const applyHighlight = (colorClass: string, overrideRange?: Range) => {
    // Use the passed range from double-click, or fallback to state for manual drag selections
    const targetRange = overrideRange || currentSelection;

    if (!targetRange || targetRange.collapsed) {
      setHighlightMenu({ visible: false, x: 0, y: 0 });
      return;
    }

    setActiveHighlightColor(colorClass);

    const bgColor = colorClass.includes("yellow")
      ? "#fde68a"
      : colorClass.includes("pink")
        ? "#fbcfe8"
        : colorClass.includes("underline")
          ? "transparent"
          : "#bfdbfe";

    // --- NEW: Check if we are updating an existing highlight ---
    const node = targetRange.commonAncestorContainer;
    // Get the parent element if the node is a text node
    const parentElement =
      node.nodeType === Node.TEXT_NODE
        ? node.parentElement
        : (node as HTMLElement);

    // If the selection is already inside one of our highlights, just update its style!
    if (parentElement && parentElement.classList.contains("dsat-highlight")) {
      if (colorClass.includes("underline")) {
        parentElement.style.backgroundColor = "transparent";
        parentElement.className = `dsat-highlight ${colorClass}`;
      } else {
        parentElement.style.backgroundColor = bgColor;
        parentElement.className = "dsat-highlight"; // Clear underline classes if changing to a solid color
      }
      window.getSelection()?.removeAllRanges();
      setCurrentSelection(null);
      setHighlightMenu({ visible: false, x: 0, y: 0 });
      return;
    }
    // --- END NEW LOGIC ---

    const span = document.createElement("span");
    span.classList.add("dsat-highlight"); // Add tracking class

    if (colorClass.includes("underline")) {
      span.className = `dsat-highlight ${colorClass}`;
    } else {
      span.style.backgroundColor = bgColor;
      span.style.padding = "2px 0";
      span.style.borderRadius = "2px";
    }

    try {
      // FIX: Use targetRange here instead of currentSelection
      wrapRangeMultiNode(targetRange, span);
    } catch (e) {
      console.error("Highlight error:", e);
    }

    window.getSelection()?.removeAllRanges();
    setCurrentSelection(null);
    setHighlightMenu({ visible: false, x: 0, y: 0 });
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

      // --- NEW: Intercept clicks on existing highlights ---
      const target = e.target as HTMLElement;
      const highlightSpan = target.closest(".dsat-highlight");

      if (highlightSpan) {
        // Programmatically select the exact text inside the highlight
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(highlightSpan);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      // --- END NEW LOGIC ---

      // Small delay to ensure selection is complete
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
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
        <SkeletonHeader />
        <main className="flex flex-1 overflow-hidden relative">
          <div className="w-1/2 border-r border-gray-200">
            <SkeletonPassage />
          </div>
          <div className="w-1/2 bg-gray-50/30 flex flex-col">
            <SkeletonQuestionHeader />
            <SkeletonQuestion />
          </div>
        </main>
        <SkeletonFooter />
      </div>
    );
  }

  return (
    <>
      {selectedQuestion ? (
        <div className="flex flex-col h-screen bg-white font-sans text-gray-900 overflow-hidden selection:bg-cyan-200 relative">
          {/* Highlighter Tool Popover */}
          {highlightMenu.visible && (
            <div
              className="fixed z-[100] flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 max-w-[90vw]"
              style={{
                top: highlightMenu.y,
                left: highlightMenu.x,
                transform: "translate(-50%, -100%)",
              }}
            >
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyHighlight("bg-yellow-200/80")}
                className={`w-7 h-7 rounded-full bg-[#fde68a] border-2 transition-transform ${activeHighlightColor === "bg-yellow-200/80" ? "border-black" : "border-transparent"}`}
              />
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyHighlight("bg-blue-200/80")}
                className={`w-7 h-7 rounded-full bg-[#bfdbfe] border-2 transition-transform ${activeHighlightColor === "bg-blue-200/80" ? "border-black" : "border-transparent"}`}
              />
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyHighlight("bg-pink-200/80")}
                className={`w-7 h-7 rounded-full bg-[#fbcfe8] border-2 transition-transform ${activeHighlightColor === "bg-pink-200/80" ? "border-black" : "border-transparent"}`}
              />
              <div className="w-[1px] h-6 bg-gray-200 mx-1" />
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  applyHighlight("underline decoration-2 decoration-gray-400")
                }
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <UnderlineIcon size={18} />
              </button>
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
                  // FIX: Actually clear the highlights before closing the menu
                  clearHighlights();
                  setHighlightMenu({ visible: false, x: 0, y: 0 });
                }}
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <div className="w-[1px] h-6 bg-gray-200 mx-1" />
              <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                <Flag size={18} fill="currentColor" />
              </button>
            </div>
          )}

          {/* Top Header Bar strictly matching Screenshot 2026-07-22 at 17.54.13.jpg */}
          <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0 bg-white z-40 relative">
            {/* Left: Go back & Directions */}
            <div className="flex items-center gap-6 w-1/3 relative">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black transition-colors"
              >
                <ChevronLeft size={16} strokeWidth={2} /> Go back
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowDirections(!showDirections)}
                  className="directions-btn flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                  Directions{" "}
                  <ChevronDown size={14} strokeWidth={2} className="mt-0.5" />
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
            <div className="flex flex-col items-center justify-center w-1/3">
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
            <div className="flex items-center justify-end gap-3 w-1/3 relative">
              <button
                onClick={() => setIsHighlightActive(!isHighlightActive)}
                className={`flex flex-col items-center justify-center rounded-[20px] px-6 py-2 transition-colors ${isHighlightActive ? "bg-cyan-100/50 text-cyan-400" : "text-gray-500 hover:text-black hover:bg-gray-50"}`}
              >
                <Highlighter
                  size={16}
                  strokeWidth={2.5}
                  className={
                    isHighlightActive ? "text-cyan-400" : "text-gray-500"
                  }
                />
                <span
                  className="text-[10px] font-bold tracking-wide mt-1"
                  style={{ color: isHighlightActive ? "#2DD4BF" : "" }}
                >
                  Highlight
                </span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="more-btn flex flex-col items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-[20px] px-3 py-2 transition-colors"
                >
                  <MoreVertical size={16} strokeWidth={2.5} />
                  <span className="text-[10px] font-bold tracking-wide mt-1">
                    More
                  </span>
                </button>
                {showMoreMenu && (
                  <div className="more-menu absolute top-14 right-0 w-64 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50">
                    <button
                      onClick={() =>
                        document.documentElement.requestFullscreen()
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Maximize2 size={18} className="text-gray-400" />{" "}
                      Fullscreen
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                      <BellOff size={18} className="text-gray-400" /> Show
                      Preppy popups
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                      <Command size={18} className="text-gray-400" /> Keyboard
                      shortcuts
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                      <Moon size={18} className="text-gray-400" /> Switch to
                      dark mode
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                      <AlertCircle size={18} className="text-gray-400" /> Bug
                      Report
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-2">
                <div className="flex items-center gap-1.5 border border-gray-100 rounded-full px-3 py-1.5 bg-white shadow-sm">
                  <span className="text-sm font-semibold text-gray-700">
                    #{selectedQuestion?.question_id || "N/A"}
                  </span>
                </div>
                {selectedQuestion?.difficulty && (
                  <div className="flex items-center gap-1.5 border border-gray-100 rounded-full px-3 py-1.5 bg-white shadow-sm">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {selectedQuestion.difficulty}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Split Content */}
          <main className="flex flex-1 overflow-hidden relative">
            {/* Left Pane: Reading Material */}
            <div
              style={{ width: `${leftPaneWidth}%` }}
              className={`passage-content p-10 md:p-12 overflow-y-auto ${isHighlightActive ? "cursor-text" : "cursor-default"}`}
              onClick={handleWordDoubleClick}
            >
              <div
                ref={passageRef}
                className="max-w-3xl text-[16px] leading-[1.8] text-[#1C1C1E] font-serif"
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
            </div>

            {/* Draggable Divider */}
            <div
              className="w-0 relative flex flex-col items-center justify-center z-10"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute top-0 bottom-0 border-l border-gray-200" />
              <div className="absolute w-4 h-8 bg-gray-100 border border-gray-200 rounded-sm flex flex-col items-center justify-center gap-[2px] shadow-sm cursor-col-resize text-gray-400 hover:text-gray-500 transition-colors">
                <div className="flex gap-[2px]">
                  <div className="w-0.5 h-0.5 rounded-full bg-current" />
                  <div className="w-0.5 h-0.5 rounded-full bg-current" />
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-0.5 h-0.5 rounded-full bg-current" />
                  <div className="w-0.5 h-0.5 rounded-full bg-current" />
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-0.5 h-0.5 rounded-full bg-current" />
                  <div className="w-0.5 h-0.5 rounded-full bg-current" />
                </div>
              </div>
            </div>

            {/* Right Pane: Question and Answers */}
            <div
              style={{ width: `${100 - leftPaneWidth}%` }}
              className="overflow-y-auto bg-gray-50/30 flex flex-col relative border-l border-gray-100"
            >
              {/* Question Header Bar matching screenshot */}
              <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="bg-black text-white w-8 h-8 rounded-lg text-[15px] font-bold flex items-center justify-center shadow-sm">
                    {filteredQuestions.findIndex(
                      (q) => q.question_id === selectedQuestion.question_id,
                    ) + 1}
                  </div>

                  <button
                    onClick={toggleMarkForReview}
                    className={`flex items-center gap-2 text-sm font-semibold transition-colors ${markedQuestions.has(selectedQuestion.question_id) ? "text-gray-900" : "text-gray-500 hover:text-black"}`}
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

                <div className="flex items-center gap-4 text-gray-500">
                  <button className="w-9 h-9 flex items-center justify-center hover:text-gray-800 transition-colors rounded-full hover:bg-gray-50">
                    <Copy size={16} strokeWidth={2} />
                  </button>
                  <button className="flex items-center gap-1.5 text-sm font-semibold hover:text-gray-800 transition-colors px-3 py-2 rounded-full hover:bg-gray-50">
                    <Flag size={16} strokeWidth={2} /> Report
                  </button>
                  <button
                    onClick={() => setIsCrossOutMode(!isCrossOutMode)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center relative shadow-sm transition-colors ${isCrossOutMode ? "bg-sky-400 text-white" : "bg-black text-white hover:bg-gray-800"}`}
                  >
                    <span className="font-sans font-bold text-xs">S</span>
                    <div className="absolute w-[16px] h-[1.5px] bg-current -rotate-45" />
                  </button>
                </div>
              </div>

              {/* Question Area */}
              <div
                ref={questionRef}
                className={`p-8 md:p-12 pt-8 pb-8 ${isHighlightActive ? "cursor-text" : "cursor-default"}`}
                onMouseUp={handleTextSelection}
                onClick={handleWordDoubleClick}
              >
                {selectedQuestion.prompt && (
                  <div className="mb-8 text-[16px] font-serif text-[#1C1C1E] leading-relaxed">
                    {selectedQuestion.prompt}
                  </div>
                )}

                {/* Answers List */}
                <div className="space-y-4">
                  {Object.entries(selectedQuestion.choices).map(
                    ([key, value]) => {
                      const isSelected = selectedAnswer === key;
                      const isHighlighted = highlightedAnswer === key;
                      const isEliminated = eliminatedChoices.has(key);
                      const isCorrectAnswer =
                        key === selectedQuestion.correct_answer;

                      let borderClass = "border-gray-300";
                      let bgClass = "bg-white";
                      let textClass = isEliminated
                        ? "text-gray-400 line-through"
                        : "text-[#1C1C1E]";

                      if (showExplanation) {
                        if (isCorrectAnswer) {
                          borderClass = "border-green-500 bg-green-50/20";
                        } else if (isSelected) {
                          borderClass = "border-red-500 bg-red-50/20";
                        }
                      } else if (isHighlighted) {
                        borderClass = "border-sky-400";
                        bgClass = "bg-white";
                      } else if (!isEliminated) {
                        borderClass = "border-gray-400 hover:border-gray-500";
                      } else {
                        borderClass = "border-gray-200 bg-gray-50/30";
                      }

                      return (
                        <div
                          key={key}
                          onClick={() => handleAnswerHighlight(key)}
                          className={`group relative flex items-center gap-4 px-5 py-4 rounded-xl border-[1px] cursor-pointer transition-all ${borderClass} ${bgClass} min-w-0`}
                        >
                          <div
                            className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-sm font-bold font-sans transition-colors ${isHighlighted ? "bg-sky-400 text-white" : showExplanation && isCorrectAnswer ? "bg-green-500 text-white" : showExplanation && isSelected ? "bg-red-500 text-white" : isSelected ? "bg-black text-white" : isEliminated ? "border-[1.5px] border-gray-300 text-gray-400" : "border-[1.5px] border-gray-400 text-[#1C1C1E]"}`}
                          >
                            {key}
                          </div>

                          <span
                            className={`text-[15px] font-serif leading-relaxed flex-1 min-w-0 ${textClass}`}
                          >
                            {value}
                          </span>

                          {isHighlighted && !showExplanation && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAnswerSubmit();
                              }}
                              className="flex items-center justify-center px-4 py-2 shrink-0 bg-sky-400 hover:bg-sky-500 rounded-full transition-colors ml-2 text-white text-sm font-semibold"
                            >
                              Check
                            </button>
                          )}

                          {isCrossOutMode && (
                            <button
                              onClick={(e) => toggleElimination(e, key)}
                              disabled={showExplanation}
                              className="flex items-center justify-center w-9 h-9 shrink-0 hover:bg-gray-100 rounded-full transition-colors relative ml-2"
                            >
                              <div
                                className={`relative flex items-center justify-center w-6 h-6 rounded-full border text-[11px] font-bold font-sans ${isEliminated ? "border-gray-400 text-gray-400" : "border-gray-400 text-gray-500 group-hover:border-gray-600 group-hover:text-gray-600"}`}
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
            </div>
          </main>

          {/* Explanation Modal - Apple Inspired Design */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // Changed from absolute z-30 to fixed z-[100] to sit above the footer
                className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                onClick={() => setShowExplanation(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 10 }}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-[32px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Info
                          size={16}
                          className="text-gray-600"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">
                        Explanation
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowExplanation(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 overflow-y-auto">
                    <div className="flex flex-col gap-4 mb-8">
                      {/* Conditional logic: Did the user answer this, and was it wrong? */}
                      {answeredQuestions.has(selectedQuestion.question_id) &&
                        !answeredQuestions.get(selectedQuestion.question_id)
                          ?.isCorrect && (
                          <div className="bg-red-50/50 border border-red-100 rounded-[24px] p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <X
                                size={14}
                                strokeWidth={3}
                                className="text-red-500"
                              />
                              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                                Your Answer
                              </span>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-[17px] shrink-0">
                                {
                                  answeredQuestions.get(
                                    selectedQuestion.question_id,
                                  )?.answer
                                }
                              </div>
                              <div className="flex-1 pt-1.5">
                                <p className="text-gray-800 leading-relaxed font-medium text-[15px]">
                                  {
                                    selectedQuestion.choices[
                                      answeredQuestions.get(
                                        selectedQuestion.question_id,
                                      )
                                        ?.answer as keyof typeof selectedQuestion.choices
                                    ]
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* The Correct Answer Block */}
                      <div
                        className={`border rounded-[24px] p-6 ${
                          answeredQuestions.get(selectedQuestion.question_id)
                            ?.isCorrect
                            ? "bg-green-50/50 border-green-100"
                            : "bg-gray-50/50 border-gray-200/60"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircle2
                            size={14}
                            strokeWidth={3}
                            className={
                              answeredQuestions.get(
                                selectedQuestion.question_id,
                              )?.isCorrect
                                ? "text-green-500"
                                : "text-gray-500"
                            }
                          />
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider ${
                              answeredQuestions.get(
                                selectedQuestion.question_id,
                              )?.isCorrect
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            Correct Answer
                          </span>
                        </div>
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[17px] shrink-0 ${
                              answeredQuestions.get(
                                selectedQuestion.question_id,
                              )?.isCorrect
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {selectedQuestion.correct_answer}
                          </div>
                          <div className="flex-1 pt-1.5">
                            <p className="text-gray-800 leading-relaxed font-medium text-[15px]">
                              {
                                selectedQuestion.choices[
                                  selectedQuestion.correct_answer as keyof typeof selectedQuestion.choices
                                ]
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

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
          <footer className="flex items-center justify-between px-6 py-4 border-t border-gray-200 shrink-0 bg-white relative z-50">
            {/* Left: Question Navigator & Reload */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowQuestionBank(!showQuestionBank)}
                className="flex items-center gap-2 text-white bg-black px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-800"
              >
                <span>
                  {filteredQuestions.findIndex(
                    (q) => q.question_id === selectedQuestion.question_id,
                  ) + 1}{" "}
                  of {totalQuestions}
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  className={showQuestionBank ? "rotate-180" : ""}
                />
              </button>

              {user && questionAttempts.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <History size={16} strokeWidth={2} />
                </button>
              )}
            </div>

            {/* Right: Suite of Tools */}
            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="info-btn p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full transition-colors shadow-sm"
              >
                <Info size={16} strokeWidth={2} />
              </button>

              <button
                onClick={handleRemix}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-colors shadow-sm ${
                  isRemixMode
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-pink-50 text-pink-500 hover:bg-pink-100"
                }`}
              >
                <Shuffle size={16} strokeWidth={2.5} /> Remix
              </button>

              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-bold transition-colors shadow-sm"
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
                className="px-5 py-2 bg-white border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 rounded-full text-sm font-bold disabled:opacity-50 transition-colors shadow-sm"
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
                className="px-5 py-2 bg-white border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 rounded-full text-sm font-bold disabled:opacity-50 transition-colors shadow-sm"
              >
                Next
              </button>
            </div>

            {/* Info Menu Popup */}
            {showInfo && (
              <div className="info-menu absolute bottom-20 right-[350px] w-64 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-gray-200 p-4 z-50">
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
              <div className="absolute bottom-20 left-20 w-[400px] max-h-[500px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-gray-200 p-6 z-50 overflow-hidden">
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
              <div className="absolute bottom-20 left-6 w-[600px] max-h-[400px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-gray-200 p-6 z-50 overflow-hidden">
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
                      <Bookmark size={16} className="text-gray-400" />
                      <span className="text-gray-600">For Review</span>
                    </div>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[320px] custom-scrollbar">
                  <div className="grid grid-cols-10 gap-2">
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
        /* Redirect to practice page if no configuration */
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
                    const savedConfig = localStorage.getItem("practiceConfig");
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
      )}
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
      `}</style>
    </Suspense>
  );
}
