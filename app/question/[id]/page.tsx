"use client";

import { saveUserProgress, updateUserStats } from "@/lib/dsat/questions";
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
    Trash2,
    Underline as UnderlineIcon,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, use, useEffect, useRef, useState } from "react";

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

function QuestionDetailPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [question, setQuestion] = useState<DSATQuestion | null>(null);
  const [loading, setLoading] = useState(true);
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

  const [user, setUser] = useState<any>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const [showDirections, setShowDirections] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [leftPaneWidth, setLeftPaneWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const passageRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
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
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/questions?question_id=${id}`);
        if (response.ok) {
          const questions: DSATQuestion[] = await response.json();
          const foundQuestion = questions[0];
          setQuestion(foundQuestion || null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

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
    setIsCrossOutMode(false);
    setShowExplanation(false);
    setElapsedSeconds(0);
    setIsTimerPaused(false);
    showHistory && setShowHistory(false);
    setQuestionAttempts([]);

    // Clear highlights when moving to a new question
    clearHighlights();

    // Fetch attempt history from localStorage as fallback
    if (question) {
      const storedAttempts = localStorage.getItem(
        `attempts_${question.question_id}`,
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
    }
  }, [question, user, isAuthLoaded]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (question && !isTimerPaused) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [question, isTimerPaused]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  function handleAnswerHighlight(answer: string) {
    if (showExplanation) return;
    setHighlightedAnswer(answer);
  }

  async function handleAnswerSubmit() {
    if (!highlightedAnswer || showExplanation) return;
    setSelectedAnswer(highlightedAnswer);
    if (question) {
      setShowExplanation(true);
      const isCorrect = highlightedAnswer === question.correct_answer;
      setAnsweredQuestions((prev) => {
        const newMap = new Map(prev);
        newMap.set(question.question_id, {
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

      if (question) {
        const timeSpent = Date.now() - questionStartTime;
        // Save to localStorage as fallback
        const newAttempt: Attempt = {
          answer: highlightedAnswer,
          isCorrect,
          timeSpent,
          attemptedAt: new Date(),
        };

        const storedAttempts = localStorage.getItem(
          `attempts_${question.question_id}`,
        );
        const attempts = storedAttempts ? JSON.parse(storedAttempts) : [];
        attempts.push(newAttempt);
        localStorage.setItem(
          `attempts_${question.question_id}`,
          JSON.stringify(attempts),
        );
        setQuestionAttempts(attempts);

        // Save to Firebase if user is authenticated
        if (user) {
          try {
            await saveUserProgress(
              user.uid,
              question.question_id,
              highlightedAnswer,
              isCorrect,
              timeSpent,
              question,
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
    if (!question) return;
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(question.question_id)) {
        newSet.delete(question.question_id);
      } else {
        newSet.add(question.question_id);
      }
      return newSet;
    });
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
      setHighlightMenu({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    } else {
      setHighlightMenu({ visible: false, x: 0, y: 0 });
    }
  };

  const applyHighlight = (colorClass: string) => {
    if (!currentSelection || currentSelection.toString().length === 0) return;

    setActiveHighlightColor(colorClass);

    try {
      const range = currentSelection.cloneRange();
      const span = document.createElement("span");
      span.className = colorClass;

      const startNode = range.startContainer;
      const endNode = range.endContainer;

      if (
        startNode === endNode ||
        startNode.contains?.(endNode) ||
        endNode.contains?.(startNode)
      ) {
        try {
          range.surroundContents(span);
        } catch (e) {
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
      } else {
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
      }

      window.getSelection()?.removeAllRanges();
      setHighlightMenu({ visible: false, x: 0, y: 0 });
    } catch (e) {
      console.error("Highlight error:", e);
      setHighlightMenu({ visible: false, x: 0, y: 0 });
    }
  };

  const clearHighlights = () => {
    if (passageRef.current) {
      const highlights =
        passageRef.current.querySelectorAll('span[class*="bg-"]');
      highlights.forEach((highlight) => {
        const parent = highlight.parentNode;
        if (parent) {
          while (highlight.firstChild) {
            parent.insertBefore(highlight.firstChild, highlight);
          }
          parent.removeChild(highlight);
        }
      });

      const underlines = passageRef.current.querySelectorAll(
        'span[class*="decoration-"]',
      );
      underlines.forEach((underline) => {
        const parent = underline.parentNode;
        if (parent) {
          while (underline.firstChild) {
            parent.insertBefore(underline.firstChild, underline);
          }
          parent.removeChild(underline);
        }
      });
    }

    if (questionRef.current) {
      const highlights =
        questionRef.current.querySelectorAll('span[class*="bg-"]');
      highlights.forEach((highlight) => {
        const parent = highlight.parentNode;
        if (parent) {
          while (highlight.firstChild) {
            parent.insertBefore(highlight.firstChild, highlight);
          }
          parent.removeChild(highlight);
        }
      });

      const underlines = questionRef.current.querySelectorAll(
        'span[class*="decoration-"]',
      );
      underlines.forEach((underline) => {
        const parent = underline.parentNode;
        if (parent) {
          while (underline.firstChild) {
            parent.insertBefore(underline.firstChild, underline);
          }
          parent.removeChild(underline);
        }
      });
    }
  };

  useEffect(() => {
    if (!isHighlightActive) {
      clearHighlights();
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-3 tracking-tight text-gray-900">
            Question not found
          </h2>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-gray-900 overflow-hidden selection:bg-cyan-200 relative">
      {/* Highlighter Tool Popover */}
      {highlightMenu.visible && (
        <div
          className="fixed z-[100] flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100"
          style={{
            top: highlightMenu.y,
            left: highlightMenu.x,
            transform: "translate(-50%, -100%)",
          }}
        >
          <button
            onClick={() => applyHighlight("bg-yellow-200/80")}
            className={`w-7 h-7 rounded-full bg-[#fde68a] border-2 transition-transform ${activeHighlightColor === "bg-yellow-200/80" ? "border-black" : "border-transparent"}`}
          />
          <button
            onClick={() => applyHighlight("bg-blue-200/80")}
            className={`w-7 h-7 rounded-full bg-[#bfdbfe] border-2 transition-transform ${activeHighlightColor === "bg-blue-200/80" ? "border-black" : "border-transparent"}`}
          />
          <button
            onClick={() => applyHighlight("bg-pink-200/80")}
            className={`w-7 h-7 rounded-full bg-[#fbcfe8] border-2 transition-transform ${activeHighlightColor === "bg-pink-200/80" ? "border-black" : "border-transparent"}`}
          />
          <div className="w-[1px] h-6 bg-gray-200 mx-1" />
          <button
            onClick={() =>
              applyHighlight("underline decoration-2 decoration-gray-400")
            }
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <UnderlineIcon size={18} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(currentSelection?.toString() || "");
              setHighlightMenu({ visible: false, x: 0, y: 0 });
            }}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={() => setHighlightMenu({ visible: false, x: 0, y: 0 })}
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

      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0 bg-white z-40 relative">
        {/* Left: Go back & Directions */}
        <div className="flex items-center gap-6 w-1/3 relative">
          <button
            onClick={() => router.back()}
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
              <div className="directions-menu absolute top-10 left-0 w-[550px] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-gray-200 p-6 z-50 text-[15px] leading-relaxed text-gray-800">
                The questions in this section address a number of important
                reading and writing skills. Each question includes one or more
                passages, which may include a table or graph. Read each passage
                and question carefully, and then choose the best answer to the
                question based on the passage(s).
                <br />
                <br />
                All questions in this section are multiple-choice with four
                answer choices. Each question has a single best answer.
              </div>
            )}
          </div>
        </div>

        {/* Center: Timer */}
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
              className="w-7 h-7 flex items-center justify-center border border-gray-200 hover:bg-gray-50 rounded-full transition-colors"
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
              className={isHighlightActive ? "text-cyan-400" : "text-gray-500"}
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
                  onClick={() => document.documentElement.requestFullscreen()}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Maximize2 size={18} className="text-gray-400" /> Fullscreen
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                  <BellOff size={18} className="text-gray-400" /> Show Preppy
                  popups
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                  <Command size={18} className="text-gray-400" /> Keyboard
                  shortcuts
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                  <Moon size={18} className="text-gray-400" /> Switch to dark
                  mode
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                  <AlertCircle size={18} className="text-gray-400" /> Bug Report
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-2">
            <div className="flex items-center gap-1.5 border border-gray-100 rounded-full px-3 py-1.5 bg-white shadow-sm">
              <span className="text-sm font-semibold text-gray-700">
                #{question.question_id}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Left Pane: Reading Material */}
        <div
          style={{ width: `${leftPaneWidth}%` }}
          className={`p-10 md:p-12 overflow-y-auto ${isHighlightActive ? "cursor-text" : "cursor-default"}`}
          onMouseUp={handleTextSelection}
        >
          <div
            ref={passageRef}
            className="max-w-3xl text-[16px] leading-[1.8] text-[#1C1C1E] font-serif"
          >
            {question.has_graphic &&
              question.graphics &&
              question.graphics.length > 0 && (
                <div className="my-4">
                  {question.graphics.map((graphic, idx) => (
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
            {question.passage && (
              <div
                className="mb-6"
                dangerouslySetInnerHTML={{
                  __html:
                    question.has_underline && question.underlined_text
                      ? question.passage.replace(
                          question.underlined_text,
                          `<u class="bg-yellow-200 px-1">${question.underlined_text}</u>`,
                        )
                      : question.passage,
                }}
              />
            )}
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
          {/* Question Header Bar */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="bg-black text-white w-8 h-8 rounded-lg text-[15px] font-bold flex items-center justify-center shadow-sm">
                1
              </div>

              <button
                onClick={toggleMarkForReview}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${markedQuestions.has(question.question_id) ? "text-gray-900" : "text-gray-500 hover:text-black"}`}
              >
                <Bookmark
                  size={16}
                  strokeWidth={2.5}
                  className={
                    markedQuestions.has(question.question_id)
                      ? "text-gray-900 fill-gray-900"
                      : "text-gray-400"
                  }
                />
                Mark for Review
              </button>
            </div>

            <div className="flex items-center gap-4 text-gray-500">
              <button className="hover:text-gray-800 transition-colors">
                <Copy size={16} strokeWidth={2} />
              </button>
              <button className="flex items-center gap-1.5 text-sm font-semibold hover:text-gray-800 transition-colors">
                <Flag size={16} strokeWidth={2} /> Report
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsCrossOutMode(!isCrossOutMode)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center relative shadow-sm transition-colors ${isCrossOutMode ? "bg-sky-400 text-white" : "bg-black text-white hover:bg-gray-800"}`}
                >
                  <span className="font-sans font-bold text-xs">S</span>
                  <div className="absolute w-[16px] h-[1.5px] bg-current -rotate-45" />
                </button>
                {isCrossOutMode && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-50">
                    Cross out answer choices you think are wrong
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Question Area */}
          <div
            ref={questionRef}
            className={`p-8 md:p-12 pt-8 pb-8 ${isHighlightActive ? "cursor-text" : "cursor-default"}`}
            onMouseUp={handleTextSelection}
          >
            {question.prompt && (
              <div className="mb-8 text-[16px] font-serif text-[#1C1C1E] leading-relaxed">
                {question.prompt}
              </div>
            )}

            {/* Answers List */}
            <div className="space-y-4">
              {Object.entries(question.choices).map(([key, value]) => {
                const isSelected = selectedAnswer === key;
                const isHighlighted = highlightedAnswer === key;
                const isEliminated = eliminatedChoices.has(key);
                const isCorrectAnswer = key === question.correct_answer;

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
                        className="flex items-center justify-center w-8 h-8 shrink-0 hover:bg-gray-100 rounded-full transition-colors relative ml-2"
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
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Explanation Modal */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-30 p-4"
            onClick={() => setShowExplanation(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-gray-100/50"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                      Explanation
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                      Question Analysis
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowExplanation(false)}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200 flex items-center justify-center"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(85vh-80px)]">
                {/* Correct Answer Section */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-6 mb-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Correct Answer
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/30 shrink-0">
                      {question.correct_answer}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-800 leading-relaxed font-medium text-[16px]">
                        {
                          question.choices[
                            question.correct_answer as keyof typeof question.choices
                          ]
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanation Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Info
                        size={16}
                        className="text-indigo-600"
                        strokeWidth={2.5}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                      Step-by-step explanation
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-gray-700 leading-[1.8] font-serif text-[15px]">
                      {question.rationale}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Footer Navigation */}
      <footer className="flex items-center justify-between px-6 py-4 border-t border-gray-200 shrink-0 bg-white relative z-50">
        {/* Left: Question Navigator & Reload */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white bg-black px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-800"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
            Back
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
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-bold transition-colors shadow-sm"
          >
            <List size={16} strokeWidth={2.5} /> Explanation
          </button>
        </div>

        {/* Info Menu Popup */}
        {showInfo && (
          <div className="info-menu absolute bottom-20 right-[100px] w-64 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-gray-200 p-4 z-50">
            <h4 className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
              Question Details
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Question ID:</span>{" "}
                <span>{question.question_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Difficulty:</span>{" "}
                <span className="capitalize">
                  {question.difficulty || "Medium"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Domain:</span>{" "}
                <span>{question.domain || "Craft & Structure"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Skill:</span>{" "}
                <span>{question.skill || "Words in Context"}</span>
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
                questionAttempts.map((attempt, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      attempt.isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">
                        {attempt.isCorrect ? "Correct" : "Incorrect"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(attempt.timeSpent / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Answer: {attempt.answer}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}

export default function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
        </div>
      }
    >
      <QuestionDetailPageContent params={params} />
    </Suspense>
  );
}
