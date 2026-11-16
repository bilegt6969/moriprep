"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  createSrsSession,
  formatDelay,
  isNew,
  isRelearning,
  newSrsCard,
  previewSrsCard,
  type SrsCard,
  type SrsSession,
} from "@/lib/vocabulary-srs";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  FolderOpen,
  Keyboard,
  Layers,
  RotateCcw,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  loadVocabularyProgress,
  saveVocabularyProgress,
  VOCABULARY_DECKS,
} from "../data";

const cardFlipVariants: Variants = {
  front: { rotateY: 0 },
  back: { rotateY: 180 },
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function VocabularyStudyContent() {
  const searchParams = useSearchParams();
  const deckId = searchParams.get("deck");
  const deck = useMemo(
    () => VOCABULARY_DECKS.find((item) => item.id === deckId) ?? null,
    [deckId],
  );
  const reduce = useReducedMotion();
  const sessionRef = useRef<SrsSession | null>(null);
  const [currentCard, setCurrentCard] = useState<SrsCard | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    if (!deck) {
      setIsReady(true);
      return;
    }

    try {
      const progress = loadVocabularyProgress();
      const savedCards = progress[deck.id] ?? [];
      const savedById = new Map(savedCards.map((card) => [card.id, card]));
      const cards = deck.cards.map((term) => {
        const saved = savedById.get(term.id);
        if (
          saved &&
          (saved.front !== term.word || saved.back !== term.definition)
        ) {
          throw new Error(
            `Saved card "${term.word}" no longer matches this deck.`,
          );
        }
        return saved ?? newSrsCard(term.id, term.word, term.definition);
      });
      const session = createSrsSession(cards);
      sessionRef.current = session;
      setCurrentCard(session.current());
      setRemaining(session.remaining());
      setReviewed(0);
      setIsFlipped(false);
      setStorageError(null);
    } catch (error) {
      console.error("Could not load vocabulary study progress.", error);
      setStorageError(getErrorMessage(error));
      sessionRef.current = null;
      setCurrentCard(null);
      setRemaining(0);
    } finally {
      setIsReady(true);
    }
  }, [deck]);

  useEffect(() => {
    if (!sessionRef.current || sessionRef.current.done()) return;
    const timer = window.setInterval(() => {
      const session = sessionRef.current;
      if (!session) return;
      setClock(Date.now());
      setCurrentCard(session.current());
      setRemaining(session.remaining());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isReady, remaining]);

  const answer = useCallback(
    (remembered: boolean) => {
      const session = sessionRef.current;
      if (!session || !currentCard || !isFlipped || !deck) return;

      const updated = session.answer(remembered);
      if (!updated) return;

      setReviewed((count) => count + 1);
      setCurrentCard(session.current());
      setRemaining(session.remaining());
      setIsFlipped(false);

      try {
        const progress = loadVocabularyProgress();
        progress[deck.id] = session.cards();
        saveVocabularyProgress(progress);
        setStorageError(null);
      } catch (error) {
        console.error("Could not save vocabulary study progress.", error);
        setStorageError(
          `Your answer was recorded for this session, but could not be saved: ${getErrorMessage(error)}`,
        );
      }
    },
    [currentCard, deck, isFlipped],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(
            target.tagName,
          ))
      ) {
        return;
      }

      if (event.code === "Space" && currentCard) {
        event.preventDefault();
        if (isFlipped) answer(true);
        else setIsFlipped(true);
      } else if (
        (event.key === "f" || event.key === "F") &&
        currentCard &&
        isFlipped
      ) {
        answer(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answer, currentCard, isFlipped]);

  const session = sessionRef.current;
  const nextAvailableAt = session?.nextAvailableAt() ?? null;
  const isWaiting = isReady && !currentCard && remaining > 0;
  const isComplete = isReady && !currentCard && remaining === 0;
  const schedule = currentCard ? previewSrsCard(currentCard) : null;
  const sessionSize = reviewed + remaining;
  const progressPercent =
    sessionSize === 0 ? 100 : Math.min(100, (reviewed / sessionSize) * 100);

  if (!deck) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f5f5f7] p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-[#1d1d1f]">
            Vocabulary deck not found
          </h1>
          <p className="mt-2 text-sm text-[#86868b]">
            Choose one of the SAT vocabulary decks to start reviewing.
          </p>
          <Link
            href="/vocabulary"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#1d1d1f] px-5 text-sm font-medium text-white"
          >
            Browse decks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white font-sans text-[#242424] antialiased">
      <header className="h-14 shrink-0 border-b border-[#e7e7e7] bg-white">
        <div className="flex h-10 items-center justify-between gap-2 px-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href="/vocabulary"
              className="flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-[#dedede] bg-white px-2.5 text-[13px] font-medium text-[#555] shadow-sm transition-colors hover:bg-gray-50"
            >
              <FolderOpen className="h-3.5 w-3.5 text-[#777]" />
              All decks
            </Link>
            <span className="min-w-0 truncate text-[13px] text-[#777]">
              {deck.name}
            </span>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 text-[12px] tabular-nums text-[#777] sm:text-[13px]">
            <Layers className="h-3.5 w-3.5" />
            {currentCard ? reviewed + 1 : reviewed} /{" "}
            {Math.max(sessionSize, reviewed)}
          </span>
        </div>
        <div
          className="mx-3 mt-2 h-1 overflow-hidden rounded-full bg-[#e8e8e8] sm:mx-4"
          role="progressbar"
          aria-label="Study session progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPercent)}
        >
          <motion.div
            className="h-full rounded-full bg-[#c9c9c9]"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto overscroll-contain bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        {storageError && (
          <p
            role="alert"
            className="mb-2 w-full max-w-[490px] shrink-0 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900"
          >
            {storageError}
          </p>
        )}

        <div className="flex w-full max-w-[490px] shrink-0 items-center justify-between text-xs text-[#888]">
          <span>{currentCard ? "Study card" : "Study session"}</span>
          {currentCard && (
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3 w-3" />
              {isNew(currentCard)
                ? "NEW"
                : isRelearning(currentCard)
                  ? "RELEARNING"
                  : "DUE"}
            </span>
          )}
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center py-2">
          {!isReady ? (
            <div className="h-[min(234px,31dvh)] min-h-[150px] w-full max-w-[490px] animate-pulse rounded-xl bg-white shadow-sm" />
          ) : storageError && !session ? (
            <section className="w-full max-w-[490px] rounded-xl border border-[#e5e7eb] bg-white px-5 py-8 text-center shadow-sm">
              <h1 className="text-lg font-medium text-[#333]">
                Could not open this deck
              </h1>
              <p className="mt-2 text-sm text-[#777]">
                Saved progress could not be read. Resolve the storage issue and
                reload to continue.
              </p>
            </section>
          ) : isWaiting ? (
            <section className="w-full max-w-[490px] rounded-xl border border-[#e5e7eb] bg-white px-5 py-8 text-center shadow-sm">
              <Clock3 className="mx-auto h-5 w-5 text-[#888]" />
              <h1 className="mt-3 text-lg font-medium text-[#333]">
                Quick break
              </h1>
              <p className="mt-1 text-sm text-[#777]">
                Your forgotten word returns in{" "}
                {formatDelay(Math.max(0, (nextAvailableAt ?? clock) - clock))}.
              </p>
            </section>
          ) : isComplete ? (
            <section className="w-full max-w-[490px] rounded-xl border border-[#e5e7eb] bg-white px-5 py-8 text-center shadow-sm">
              <Check className="mx-auto h-5 w-5 text-emerald-600" />
              <h1 className="mt-3 text-lg font-medium text-[#333]">
                {reviewed === 0 ? "You’re all caught up" : "Session complete"}
              </h1>
              <p className="mt-1 text-sm text-[#777]">
                {reviewed === 0
                  ? "No new or due words in this deck right now."
                  : `You reviewed ${reviewed} ${reviewed === 1 ? "card" : "cards"}.`}
              </p>
              <Link
                href="/vocabulary"
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-full border border-[#e4e4e4] bg-white px-4 text-sm font-medium text-[#555] shadow-sm transition-colors hover:bg-gray-50"
              >
                Back to decks
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          ) : currentCard ? (
            <div
              className="relative w-full max-w-[490px]"
              style={{ perspective: "1200px" }}
            >
              <motion.button
                type="button"
                aria-label={
                  isFlipped
                    ? `Definition: ${currentCard.back}`
                    : `Reveal definition for ${currentCard.front}`
                }
                onClick={() => setIsFlipped((flipped) => !flipped)}
                className="relative block h-[min(234px,31dvh)] min-h-[150px] w-full cursor-pointer rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[#1d1d1f]/30"
                style={{ transformStyle: "preserve-3d" }}
                animate={isFlipped ? "back" : "front"}
                variants={cardFlipVariants}
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        duration: 0.55,
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                      }
                }
              >
                <span
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-6 text-center shadow-[0_4px_18px_rgba(0,0,0,0.08)]"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#f4f4f4] px-2 py-1 text-[10px] font-medium text-[#888]">
                    <Clock3 className="h-3 w-3" />
                    {isNew(currentCard)
                      ? "NEW"
                      : isRelearning(currentCard)
                        ? "RELEARNING"
                        : "DUE"}
                  </span>
                  <span className="text-center text-xl font-medium tracking-tight text-[#3d3d3d] sm:text-2xl">
                    {currentCard.front}
                  </span>
                  <span className="mt-3 text-xs text-[#aaa]">
                    Tap or press Space to reveal
                  </span>
                </span>

                <span
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.08)]"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-5">
                    <span className="absolute left-4 top-3 inline-flex items-center gap-1 rounded-full bg-[#f4f4f4] px-2 py-1 text-[10px] font-medium text-[#888]">
                      <Clock3 className="h-3 w-3" />
                      {isNew(currentCard)
                        ? "NEW"
                        : isRelearning(currentCard)
                          ? "RELEARNING"
                          : "DUE"}
                    </span>
                    <span className="break-words pt-3 text-center text-lg font-medium tracking-tight text-[#3d3d3d]">
                      {currentCard.front}
                    </span>
                  </span>
                  <span className="h-px w-full shrink-0 bg-gray-100" />
                  <span className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-6 py-3 text-center text-sm leading-relaxed text-[#3d3d3d] sm:text-base">
                    {currentCard.back}
                  </span>
                  <span className="flex shrink-0 items-center border-t border-gray-100 bg-gray-50/80 px-5 py-2 text-xs font-medium text-gray-500">
                    ✓ {currentCard.reps} reviews
                  </span>
                </span>
              </motion.button>
            </div>
          ) : null}
        </div>

        {currentCard && schedule ? (
          <div className="relative w-full max-w-[490px] shrink-0 pt-2">
            <p className="mb-2 text-center text-[11px] text-[#aaa]">
              {isFlipped
                ? "Choose the answer that feels right"
                : "Think of the meaning, then reveal"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pr-8 sm:pr-0">
              <button
                type="button"
                disabled={!isFlipped || Boolean(storageError && !session)}
                onClick={() => answer(false)}
                className="flex h-9 items-center gap-2 rounded-full border border-[#e4e4e4] bg-white px-3.5 text-sm font-medium text-[#737373] shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-4 w-4 text-red-500" />
                Forgot
                <span className="text-xs text-[#aaa]">{schedule.forgot}</span>
              </button>
              <button
                type="button"
                disabled={!isFlipped || Boolean(storageError && !session)}
                onClick={() => answer(true)}
                className="flex h-9 items-center gap-2 rounded-full border border-[#e4e4e4] bg-white px-3.5 text-sm font-medium text-[#737373] shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check className="h-4 w-4 text-green-500" />
                Remembered
                <span className="text-xs text-[#aaa]">
                  {schedule.remembered}
                </span>
              </button>
            </div>
            <button
              type="button"
              aria-label="Keyboard shortcuts"
              aria-expanded={showKeyboardHelp}
              onClick={() => setShowKeyboardHelp((visible) => !visible)}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full text-[#a6a6a6] transition-colors hover:bg-white hover:text-[#666]"
            >
              <Keyboard className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {showKeyboardHelp && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute bottom-11 right-0 z-10 w-48 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg"
                >
                  <p>
                    <kbd className="font-semibold">Space</kbd> Reveal or
                    remember
                  </p>
                  <p className="mt-2">
                    <kbd className="font-semibold">F</kbd> Mark forgot
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : isWaiting ? (
          <p className="flex shrink-0 items-center gap-2 pt-2 text-[11px] text-[#999]">
            <RotateCcw className="h-3.5 w-3.5" />
            Forgotten cards return in this session
          </p>
        ) : null}
      </main>
    </div>
  );
}

export default function VocabularyStudyPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-dvh flex-col bg-white"
          aria-busy="true"
          role="status"
          aria-label="Loading vocabulary study session"
        >
          <div className="h-14 shrink-0 border-b border-[#e7e7e7]" />
          <div className="flex flex-1 items-center justify-center px-4">
            <div className="h-[min(234px,31dvh)] min-h-[150px] w-full max-w-[490px] animate-pulse rounded-xl bg-[#f5f5f7]" />
          </div>
        </div>
      }
    >
      <VocabularyStudyContent />
    </Suspense>
  );
}
