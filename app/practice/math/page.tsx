"use client";

import DesmosCalculator from "@/components/dsat/DesmosCalculator";
import { MathText } from "@/components/MathText";
import { mathDomainSkills } from "@/lib/dsat/math-domain-skills";
import {
    saveAnsweredQuestions,
    saveUserProgress,
    updateUserStats,
} from "@/lib/dsat/questions";
import { DSATQuestion } from "@/types/dsat";
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
import React, {
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

// Skeleton Loading Components
function SkeletonHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-2.5 border-b border-gray-200 shrink-0 bg-white z-40 relative sticky top-0">
      <div className="flex items-center gap-6 w-1/3">
        <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
        <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex items-center gap-4 w-1/3 justify-center">
        <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex items-center gap-4 w-1/3 justify-end">
        <div className="w-16 h-5 bg-gray-200 rounded animate-pulse" />
        <div className="w-16 h-5 bg-gray-200 rounded animate-pulse" />
      </div>
    </header>
  );
}

function SkeletonQuestion() {
  return (
    <div className="max-w-3xl mx-auto">
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

function SkeletonLoader() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <SkeletonHeader />
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <SkeletonQuestion />
      </div>
    </div>
  );
}

function MathPracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [questionsData, setQuestionsData] = useState<DSATQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Map<string, { isCorrect: boolean; answer: string }>
  >(new Map());
  const [isAnsweredDataSettled, setIsAnsweredDataSettled] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<number[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isHighlightActive, setIsHighlightActive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [highlightedAnswer, setHighlightedAnswer] = useState<string>("");
  const [eliminatedChoices, setEliminatedChoices] = useState<Set<string>>(
    new Set(),
  );
  const [isCrossOutMode, setIsCrossOutMode] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const [showCalculator, setShowCalculator] = useState(false);
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

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const HIGHLIGHT_COLORS: Record<string, string> = {
    "bg-yellow-200/80": "rgb(253, 230, 138)",
    "bg-blue-200/80": "rgb(191, 219, 254)",
    "bg-pink-200/80": "rgb(251, 207, 232)",
  };

  const getHighlightColorClass = useCallback(
    (span: HTMLElement): string | null => {
      const bg = span.style.backgroundColor;
      const match = Object.entries(HIGHLIGHT_COLORS).find(
        ([, rgb]) => rgb === bg,
      );
      return match ? match[0] : null;
    },
    [],
  );

  const cleanupSelectionAndMenu = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    setCurrentSelection(null);
    setHighlightMenu({ visible: false, x: 0, y: 0 });
    setShowUnderlineSubmenu(false);
  }, []);

  // Helper function to wrap range with span (handles multi-node selections)
  const wrapRangeMultiNode = (range: Range, span: HTMLElement) => {
    if (range.collapsed) return;

    const startNode = range.startContainer;
    const endNode = range.endContainer;

    // If start and end are the same node, simple case
    if (startNode === endNode) {
      if (startNode.nodeType === Node.TEXT_NODE) {
        const textNode = startNode as Text;
        const parent = textNode.parentNode;
        if (parent) {
          const beforeText =
            textNode.textContent?.substring(0, range.startOffset) || "";
          const highlightedText =
            textNode.textContent?.substring(
              range.startOffset,
              range.endOffset,
            ) || "";
          const afterText =
            textNode.textContent?.substring(range.endOffset) || "";

          if (beforeText) {
            parent.insertBefore(document.createTextNode(beforeText), textNode);
          }
          span.textContent = highlightedText;
          parent.insertBefore(span, textNode);
          if (afterText) {
            parent.insertBefore(document.createTextNode(afterText), textNode);
          }
          parent.removeChild(textNode);
        }
      }
      return;
    }

    // For multi-node selections, use extractContents and insertContents
    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      cleanupSelectionAndMenu();
      return;
    }

    const text = selection.toString().trim();
    if (text.length === 0) {
      cleanupSelectionAndMenu();
      return;
    }

    const range = selection.getRangeAt(0);
    setCurrentSelection(range);

    const rect = range.getBoundingClientRect();
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
  }, [cleanupSelectionAndMenu]);

  const applyUnderlineStyle = useCallback(
    (style: string) => {
      const targetRange = currentSelection;
      if (!targetRange || targetRange.collapsed) {
        cleanupSelectionAndMenu();
        return;
      }

      const node = targetRange.commonAncestorContainer;
      const parentElement =
        node.nodeType === Node.TEXT_NODE
          ? node.parentElement
          : (node as HTMLElement);

      if (parentElement && parentElement.classList.contains("dsat-highlight")) {
        const hadBg =
          parentElement.style.backgroundColor &&
          parentElement.style.backgroundColor !== "transparent";

        if (style === "none") {
          parentElement.classList.remove(
            "underline",
            "decoration-2",
            "decoration-gray-400",
            "decoration-solid",
            "decoration-dashed",
            "decoration-dotted",
          );
        } else {
          parentElement.classList.add(
            "underline",
            "decoration-2",
            "decoration-gray-400",
            `decoration-${style}`,
          );
        }

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
    },
    [currentSelection, cleanupSelectionAndMenu],
  );

  const applyHighlight = useCallback(
    (colorClass: string, overrideRange?: Range) => {
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
    },
    [currentSelection, cleanupSelectionAndMenu],
  );

  const clearHighlights = useCallback(() => {
    const container = questionRef.current;
    if (container) {
      const highlights = container.querySelectorAll(".dsat-highlight");
      highlights.forEach((highlight) => {
        const parent = highlight.parentNode;
        if (parent) {
          while (highlight.firstChild) {
            parent.insertBefore(highlight.firstChild, highlight);
          }
          parent.removeChild(highlight);
        }
      });
    }
  }, []);

  const handleWordDoubleClick = useCallback(
    (e: React.MouseEvent) => {
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
            applyHighlight(activeHighlightColor || "bg-yellow-200", range);
          }
        }, 10);
      }
    },
    [isHighlightActive, activeHighlightColor, applyHighlight],
  );

  // Get filters from URL
  const domainParam = searchParams.get("domain");
  const skillParam = searchParams.get("skill");
  const difficultyParam = searchParams.get("difficulty");

  // Initialize skills based on selected domains
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    if (domainParam) {
      const domains = domainParam.split(",");
      const skills: string[] = [];
      domains.forEach((domain) => {
        const domainSkillsList = mathDomainSkills[domain] || [];
        skills.push(...domainSkillsList);
      });
      setSelectedSkills(skills);
    }
  }, [domainParam]);

  // Timer logic
  useEffect(() => {
    if (!isPaused && !showExplanation && !loading) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, showExplanation, loading]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      setIsQuestionLoading(true);
      const params = new URLSearchParams();
      if (domainParam) params.append("domain", domainParam);
      if (skillParam) params.append("skill", skillParam);
      if (difficultyParam) params.append("difficulty", difficultyParam);
      params.append("test", "Math");

      const response = await fetch(`/api/questions?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setQuestionsData(Array.isArray(data) ? data : []);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsQuestionLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthLoaded) {
      fetchQuestions();
    }
  }, [isAuthLoaded, domainParam, skillParam, difficultyParam]);

  // Load answered questions from Firebase/localStorage
  useEffect(() => {
    const loadAnsweredQuestions = async () => {
      setIsAnsweredDataSettled(false);
      try {
        if (user) {
          const { getAnsweredQuestions } = await import("@/lib/dsat/questions");
          const answered = await getAnsweredQuestions(user.uid);
          setAnsweredQuestions(answered);
        } else {
          const localAnswered = localStorage.getItem("answeredQuestions_math");
          if (localAnswered) {
            setAnsweredQuestions(new Map(JSON.parse(localAnswered)));
          }
        }
      } catch (error) {
        console.error("Error loading answered questions:", error);
      } finally {
        setIsAnsweredDataSettled(true);
      }
    };

    loadAnsweredQuestions();
  }, [user]);

  // Auth state
  useEffect(() => {
    const { auth } = require("@/lib/firebase");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  const currentQuestion = questionsData[currentQuestionIndex];

  // Handle answer selection
  const handleAnswerSelect = (letter: string) => {
    if (showExplanation) return;
    setSelectedAnswer(letter);
    const correct = letter === currentQuestion.correct_answer;
    setIsCorrect(correct);

    // Track wrong answers for persistent red highlighting
    if (!correct) {
      setWrongAnswers((prev) => new Set(prev).add(letter));
    }

    // Save progress
    if (user) {
      const timeSpent = timeElapsed;
      saveUserProgress(
        user.uid,
        currentQuestion.question_id,
        letter,
        correct,
        timeSpent,
        currentQuestion,
      );
      updateUserStats(user.uid, correct, timeSpent);
    } else {
      // Save to localStorage for guest users
      const localProgress = JSON.parse(
        localStorage.getItem("userProgress_math") || "[]",
      );
      localProgress.push({
        questionId: currentQuestion.question_id,
        answer: letter,
        isCorrect: correct,
        timeSpent: timeElapsed,
        attemptedAt: new Date().toISOString(),
      });
      localStorage.setItem("userProgress_math", JSON.stringify(localProgress));
    }

    // Update answered questions
    setAnsweredQuestions((prev) => {
      const updated = new Map(prev);
      updated.set(currentQuestion.question_id, {
        isCorrect: correct,
        answer: letter,
      });
      if (user) {
        saveAnsweredQuestions(user.uid, updated);
      } else {
        localStorage.setItem(
          "answeredQuestions_math",
          JSON.stringify(Array.from(updated)),
        );
      }
      return updated;
    });
  };

  // Navigation
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questionsData.length) {
      setCurrentQuestionIndex(index);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(null);
      setWrongAnswers(new Set());
      setHistoryIndex(-1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      // Reset state for next question
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(null);
      setWrongAnswers(new Set());
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      // Reset state for previous question
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(null);
      setWrongAnswers(new Set());
      goToQuestion(currentQuestionIndex - 1);
    }
  };

  // Mark for review
  const toggleMark = () => {
    setMarkedQuestions((prev) => {
      const updated = new Set(prev);
      if (updated.has(currentQuestionIndex)) {
        updated.delete(currentQuestionIndex);
      } else {
        updated.add(currentQuestionIndex);
      }
      return updated;
    });
  };

  // Handle answer highlight (RW-style)
  const handleAnswerHighlight = (key: string) => {
    if (selectedAnswer) return; // Don't allow highlighting after answering
    setHighlightedAnswer(key);
  };

  // Handle answer submit (RW-style)
  const handleAnswerSubmit = () => {
    if (!highlightedAnswer) return;
    handleAnswerSelect(highlightedAnswer);
  };

  // Toggle elimination (cross-out mode)
  const toggleElimination = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setEliminatedChoices((prev) => {
      const updated = new Set(prev);
      if (updated.has(key)) {
        updated.delete(key);
      } else {
        updated.add(key);
      }
      return updated;
    });
  };

  // Clear highlights when highlight tool is disabled
  useEffect(() => {
    if (!isHighlightActive) {
      clearHighlights();
    }
  }, [isHighlightActive, clearHighlights]);

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

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isHighlightActive, getHighlightColorClass, handleTextSelection]);

  // Reset question state when the actual question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);
    setHighlightedAnswer("");
    setEliminatedChoices(new Set());
    clearHighlights();
  }, [currentQuestion?.question_id, clearHighlights]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showKeyboardShortcuts) {
        if (e.key === "Escape") setShowKeyboardShortcuts(false);
        return;
      }

      if (e.key === "Escape") {
        setShowQuestionList(false);
      }

      if (e.key === "?" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
      }

      if (e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4") {
        const letter = String.fromCharCode(64 + parseInt(e.key));
        if (!showExplanation) {
          handleAnswerSelect(letter);
        }
      }

      if (e.key === "ArrowRight" && !showExplanation) {
        goToNext();
      }

      if (e.key === "ArrowLeft" && !showExplanation) {
        goToPrevious();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowQuestionList(!showQuestionList);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showExplanation,
    currentQuestionIndex,
    questionsData.length,
    showKeyboardShortcuts,
    showQuestionList,
  ]);

  const answeredCount = answeredQuestions.size;
  const totalQuestions = questionsData.length;

  if (loading || !isAnsweredDataSettled) {
    return <SkeletonLoader />;
  }

  if (questionsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No questions found
        </h2>
        <p className="text-gray-600 mb-4">Try adjusting your filters</p>
        <button
          onClick={() => router.push("/practice")}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Back to Practice
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-[1920px] mx-auto">
      {/* Top Header Bar matching RW page exactly */}
      <header className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 py-3 sm:py-2.5 shrink-0 bg-white z-40 relative border-b-2 border-gray-200">
        {/* Left: Go back & Directions */}
        <div className="flex items-center gap-3 sm:gap-6 w-auto sm:w-1/3 relative">
          <button
            onClick={() => router.push("/practice")}
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
                The questions in this section address a number of important math
                skills. Each question may include a table, graph, or other
                visual information. Read each question carefully, and then
                choose the best answer from the four choices provided.
                <br />
                <br />
                All questions in this section are multiple-choice with four
                answer choices. Each question has a single best answer.
              </div>
            )}
          </div>
        </div>

        {/* Center: Timer aligned to match RW */}
        <div className="order-3 sm:order-none flex flex-col items-center justify-center w-full sm:w-1/3 pt-2 sm:pt-0">
          <div className="text-[20px] font-bold tracking-wide text-black mb-1.5 h-7 flex items-center">
            {isTimerHidden ? (
              <Clock size={20} className="text-gray-400" />
            ) : (
              formatTime(timeElapsed)
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:bg-gray-50 rounded-full transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isPaused ? "play" : "pause"}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                >
                  {isPaused ? (
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
              className={isHighlightActive ? "text-cyan-400" : "text-gray-500"}
            />
            <span
              className="text-[10px] font-bold tracking-wide mt-0.5"
              style={{ color: isHighlightActive ? "#2DD4BF" : "" }}
            >
              Highlight
            </span>
          </button>

          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`flex flex-col items-center justify-center rounded-2xl px-5 py-1.5 transition-colors ${showCalculator ? "bg-cyan-100/50 text-cyan-400" : "text-gray-500 hover:text-black hover:bg-gray-50"}`}
          >
            <span
              className="font-sans font-bold text-sm"
              style={{ color: showCalculator ? "#2DD4BF" : "" }}
            >
              π
            </span>
            <span
              className="text-[10px] font-bold tracking-wide mt-0.5"
              style={{ color: showCalculator ? "#2DD4BF" : "" }}
            >
              Calculator
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
                  onClick={() => {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                      setIsFullscreen(false);
                    } else {
                      document.documentElement.requestFullscreen();
                      setIsFullscreen(true);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 size={18} className="text-gray-400" />
                  ) : (
                    <Maximize2 size={18} className="text-gray-400" />
                  )}
                  {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                </button>
                <button
                  onClick={() => setShowKeyboardShortcuts(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Command size={18} className="text-gray-400" /> Keyboard
                  shortcuts
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Moon size={18} className="text-gray-400" /> Switch to
                  {isDarkMode ? " light mode" : " dark mode"}
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                  <AlertCircle size={18} className="text-gray-400" /> Bug Report
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

      {/* Main Content - Single column for math (no passage) */}
      <main className="flex flex-col flex-1 overflow-hidden relative">
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

        {/* Question Pane - Split with calculator when active */}
        <div
          className={`w-full bg-white flex flex-col relative ${showCalculator ? "md:flex-row md:h-[calc(100vh-8rem)]" : ""}`}
        >
          {/* Left Side: Header + Question + Answers */}
          <div
            className={`${showCalculator ? "md:w-1/2 md:flex md:flex-col md:h-full" : "w-full"}`}
          >
            {/* Question Header Bar matching RW */}
            <div className="px-6 md:px-8 py-3 bg-white sticky top-0 z-10">
              <div
                className={`${showCalculator ? "" : "max-w-3xl mx-auto"} flex items-center justify-between gap-2 bg-gray-100 border-2 border-gray-200 rounded-full px-2 py-1.5`}
              >
                <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                  <div className="bg-black text-white w-8 h-8 rounded-full text-[15px] font-bold flex items-center justify-center shrink-0">
                    {currentQuestionIndex + 1}
                  </div>

                  {(currentQuestion as any).parse_status ===
                    "partial_fallback" && (
                    <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                      Preview
                    </span>
                  )}

                  <button
                    onClick={toggleMark}
                    className={`flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-1.5 rounded-full border-2 whitespace-nowrap ${markedQuestions.has(currentQuestionIndex) ? "bg-gray-900 border-gray-900 text-white" : "border-transparent text-gray-700 hover:border-gray-300 hover:bg-gray-200"}`}
                  >
                    <Bookmark
                      size={16}
                      strokeWidth={2.5}
                      className={
                        markedQuestions.has(currentQuestionIndex)
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
                      if (currentQuestion) {
                        const questionText = currentQuestion.question || "";
                        const choices = Object.entries(
                          currentQuestion.choices || {},
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
              className={`flex-1 overflow-y-auto p-5 sm:p-6 md:p-8 pt-5 sm:pt-6 pb-6 ${isHighlightActive ? "cursor-text" : "cursor-default"}`}
              onMouseDown={handleWordDoubleClick}
            >
              {isPaused ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Pause className="w-16 h-16 text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Practice Paused
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Take a break, you can resume anytime
                  </p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Resume
                  </button>
                </div>
              ) : (
                <div
                  className={`${showCalculator ? "w-full" : "max-w-3xl mx-auto"}`}
                >
                  {/* Question prompt */}
                  <div className="mb-6 text-[17px] sm:text-[19px] font-serif text-[#1C1C1E] leading-relaxed">
                    <MathText
                      text={currentQuestion.question}
                      mathExpressions={
                        (currentQuestion as any).math_expressions || []
                      }
                      figures={(currentQuestion as any).figures || []}
                    />
                  </div>

                  {/* Answers List */}
                  {(currentQuestion as any).question_type === "spr" ? (
                    // Student-Produced Response (SPR) - text input
                    <div className="space-y-4">
                      <div className="p-4 border-2 border-gray-300 rounded-xl bg-white">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Answer
                        </label>
                        <input
                          type="text"
                          value={selectedAnswer || ""}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                          disabled={!!selectedAnswer}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-mono focus:outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-400"
                          placeholder="Enter your answer"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const correct =
                            selectedAnswer === currentQuestion.correct_answer;
                          setIsCorrect(correct);
                          setShowExplanation(true);
                          if (!correct) {
                            setWrongAnswers((prev) =>
                              new Set(prev).add(selectedAnswer),
                            );
                          }
                          if (user) {
                            const timeSpent = timeElapsed;
                            saveUserProgress(
                              user.uid,
                              currentQuestion.question_id,
                              selectedAnswer,
                              correct,
                              timeSpent,
                              currentQuestion,
                            );
                            updateUserStats(user.uid, correct, timeSpent);
                          }
                        }}
                        disabled={!selectedAnswer}
                        className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        Submit Answer
                      </button>
                    </div>
                  ) : (
                    // Multiple Choice (MCQ)
                    <div className="space-y-3">
                      {Object.entries(currentQuestion.choices).map(
                        ([key, value]) => {
                          const isSelected = selectedAnswer === key;
                          const isHighlighted = highlightedAnswer === key;
                          const isEliminated = eliminatedChoices.has(key);
                          const isCorrectAnswer =
                            key === currentQuestion.correct_answer;
                          const hasAnswered = !!selectedAnswer;
                          const isLocked =
                            !!selectedAnswer &&
                            selectedAnswer === currentQuestion.correct_answer;
                          const isWrongSelected =
                            hasAnswered && isSelected && !isCorrectAnswer;
                          const isRightAnswerShown =
                            hasAnswered && isSelected && isCorrectAnswer;
                          const isPreviouslyWrong = wrongAnswers.has(key);

                          let borderClass = "border-gray-400";
                          let bgClass = "bg-white";
                          let textClass = isEliminated
                            ? "text-gray-400 line-through"
                            : "text-[#1C1C1E]";

                          if (isPreviouslyWrong) {
                            borderClass = "border-red-600";
                            bgClass = "bg-red-50";
                          } else if (hasAnswered) {
                            if (isSelected && isCorrectAnswer) {
                              borderClass = "border-green-600";
                              bgClass = "bg-green-50";
                            } else if (isSelected && !isCorrectAnswer) {
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
                              onClick={() => handleAnswerHighlight(key)}
                              className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${borderClass} ${bgClass} min-w-0 ${isLocked ? "cursor-default" : "cursor-pointer"}`}
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
                                <MathText
                                  text={value as string}
                                  mathExpressions={
                                    (currentQuestion as any).math_expressions ||
                                    []
                                  }
                                  figures={
                                    (currentQuestion as any).figures || []
                                  }
                                />
                              </span>

                              {isHighlighted &&
                                !isLocked &&
                                !showExplanation &&
                                !isPreviouslyWrong && (
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

                              {isCrossOutMode && !isLocked && (
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
                  )}

                  {/* Explanation */}
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springTransition}
                      className="mt-6 p-6 rounded-xl border-2 bg-white"
                      style={{
                        borderColor: isCorrect ? "#22c55e" : "#ef4444",
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {isCorrect ? (
                          <div className="shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                            <X className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {isCorrect ? "Correct!" : "Incorrect"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {(currentQuestion as any).question_type === "spr"
                              ? `The correct answer is ${currentQuestion.correct_answer}`
                              : `The correct answer is ${currentQuestion.correct_answer}: ${currentQuestion.correct_answer_text}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        <MathText
                          text={currentQuestion.rationale}
                          mathExpressions={
                            (currentQuestion as any).math_expressions || []
                          }
                          figures={(currentQuestion as any).figures || []}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Calculator Panel */}
          <AnimatePresence>
            {showCalculator && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "50%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:block border-l border-gray-200 bg-white overflow-hidden"
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Graphing Calculator
                    </h3>
                    <button
                      onClick={() => setShowCalculator(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden p-5 sm:p-6 md:p-8">
                    <DesmosCalculator />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Footer Navigation matching RW exactly */}
      <footer className="flex flex-wrap items-center justify-between gap-y-2 px-4 sm:px-6 py-2.5 sm:py-3 border-t-2 border-gray-200 shrink-0 bg-white relative z-50">
        {/* Left: Question Navigator & Reload */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowQuestionList(!showQuestionList)}
            className="question-bank-btn flex items-center gap-2 text-white bg-black px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-800"
          >
            <span>
              {currentQuestionIndex + 1} of {questionsData.length}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={2.5}
              className={showQuestionList ? "rotate-180" : ""}
            />
          </button>
        </div>

        {/* Right: Suite of Tools */}
        <div className="flex items-center gap-2 sm:gap-3 relative overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to shuffle the questions?")) {
                const shuffled = [...questionsData].sort(
                  () => Math.random() - 0.5,
                );
                setQuestionsData(shuffled);
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setShowExplanation(false);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-colors bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-100"
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
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="px-5 py-1.5 bg-white border-2 border-gray-300 text-gray-700 hover:text-black hover:border-gray-400 hover:bg-gray-50 rounded-full text-sm font-bold disabled:opacity-50 transition-colors"
          >
            Previous
          </button>

          <button
            onClick={goToNext}
            disabled={currentQuestionIndex === questionsData.length - 1}
            className="px-5 py-1.5 bg-white border-2 border-gray-300 text-gray-700 hover:text-black hover:border-gray-400 hover:bg-gray-50 rounded-full text-sm font-bold disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </footer>

      {/* Question List Modal */}
      <AnimatePresence>
        {showQuestionList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuestionList(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={springTransition}
              className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  Question Navigator
                </h3>
                <button
                  onClick={() => setShowQuestionList(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-5 gap-2">
                  {questionsData.map((_, index) => {
                    const isAnswered = answeredQuestions.has(
                      questionsData[index].question_id,
                    );
                    const isCurrent = index === currentQuestionIndex;
                    const isMarked = markedQuestions.has(index);
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          goToQuestion(index);
                          setShowQuestionList(false);
                        }}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          isCurrent
                            ? "bg-black text-white"
                            : isAnswered
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } ${isMarked ? "ring-2 ring-yellow-400" : ""}`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={springTransition}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  Keyboard Shortcuts
                </h3>
                <button
                  onClick={() => setShowKeyboardShortcuts(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Select answer 1-4</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">
                    1, 2, 3, 4
                  </kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Next question</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">→</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Previous question</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">←</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Question list</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">
                    ⌘K
                  </kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Close modal</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">
                    Esc
                  </kbd>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MathPracticePage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MathPracticeContent />
    </Suspense>
  );
}
