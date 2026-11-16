"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { isDue, isNew, type SrsCard } from "@/lib/vocabulary-srs";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  FileText,
  Layers3,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadVocabularyProgress,
  VOCABULARY_DECKS,
  type VocabularyDeck,
  type VocabularyProgress,
} from "./data";

const DECK_ICONS = [FileText, BookOpen, Sparkles, Layers3, Clock3];
const ACTIVE_DECKS_STORAGE_KEY = "activeVocabDecks";

function getStudyCounts(
  deck: VocabularyDeck,
  savedCards: SrsCard[],
): { newCount: number; dueCount: number } {
  const savedById = new Map(savedCards.map((card) => [card.id, card]));
  const now = Date.now();
  return deck.cards.reduce(
    (counts, term) => {
      const saved = savedById.get(term.id);
      if (!saved || isNew(saved)) counts.newCount += 1;
      else if (isDue(saved, now)) counts.dueCount += 1;
      return counts;
    },
    { newCount: 0, dueCount: 0 },
  );
}

const ease = [0.22, 1, 0.36, 1] as const;
const spring = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.8,
} as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease },
  },
};

function DeckCard({
  deck,
  icon: Icon,
  newCount,
  dueCount,
  isActive,
  onToggle,
  reduce,
}: {
  deck: VocabularyDeck;
  icon: (typeof DECK_ICONS)[number];
  newCount: number;
  dueCount: number;
  isActive: boolean;
  onToggle: () => void;
  reduce: boolean;
}) {
  return (
    <motion.article
      variants={item}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={spring}
      className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-black/[0.04] bg-white p-5 text-[#1d1d1f] shadow-[0_8px_28px_-24px_rgba(0,0,0,0.28)] md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f5f5f7] text-[#1d1d1f]">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
        </span>
        <button
          type="button"
          onClick={onToggle}
          aria-label={`${isActive ? "Remove" : "Add"} ${deck.name} ${isActive ? "from" : "to"} active decks`}
          aria-pressed={isActive}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/40 ${
            isActive
              ? "bg-[#1d1d1f] text-white"
              : "bg-white text-[#86868b] hover:bg-black/[0.06]"
          }`}
        >
          {isActive ? (
            <Check className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Plus className="h-4 w-4" strokeWidth={2} />
          )}
        </button>
      </div>

      <h2 className="mt-5 text-[21px] font-semibold leading-tight tracking-[-0.03em] md:text-[23px]">
        {deck.name}
      </h2>
      <p className="mt-2 min-h-10 text-[13px] leading-relaxed text-[#86868b]">
        {deck.description}
      </p>

      <div className="mt-5 space-y-3 rounded-2xl bg-[#f7f7f8] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#86868b]">
          A taste of this deck
        </p>
        <dl className="space-y-2.5">
          {deck.cards.slice(0, 2).map((term) => (
            <div key={term.id}>
              <dt className="text-[13px] font-semibold text-[#1d1d1f]">
                {term.word}
              </dt>
              <dd className="mt-0.5 text-xs leading-relaxed text-[#737373]">
                {term.definition}
              </dd>
            </div>
          ))}
        </dl>
        {deck.cards.length > 2 && (
          <p className="border-t border-black/[0.06] pt-2.5 text-[11px] font-medium text-[#86868b]">
            + {deck.cards.length - 2} words to explore
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/[0.06] pt-4 text-xs text-[#737373]">
        <span className="inline-flex items-center gap-1.5">
          <Layers3 className="h-3.5 w-3.5 text-[#999]" />
          <strong className="font-semibold text-[#333]">
            {deck.cards.length}
          </strong>{" "}
          cards
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#999]" />
          <strong className="font-semibold text-[#333]">{newCount}</strong> new
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5 text-[#999]" />
          <strong className="font-semibold text-[#333]">{dueCount}</strong> due
        </span>
      </div>

      <div className="mt-auto pt-6">
        <div className="relative inline-block w-full p-1.5">
          <Link
            href={`/vocabulary/study?deck=${deck.id}`}
            className="relative z-10 flex h-11 items-center justify-between rounded-xl bg-[#1d1d1f] px-4 text-[14px] font-medium tracking-[-0.01em] text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/50"
          >
            Study these words
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function VocabularyPage() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [activeDecks, setActiveDecks] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<VocabularyProgress>({});
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedDecks = localStorage.getItem(ACTIVE_DECKS_STORAGE_KEY);
      if (savedDecks) {
        const parsed: unknown = JSON.parse(savedDecks);
        if (
          !Array.isArray(parsed) ||
          !parsed.every((deckId) => typeof deckId === "string")
        ) {
          throw new Error(
            "Saved active vocabulary decks have an invalid format.",
          );
        }
        const availableDecks = new Set(VOCABULARY_DECKS.map((deck) => deck.id));
        setActiveDecks(
          new Set(parsed.filter((deckId) => availableDecks.has(deckId))),
        );
      }
      setProgress(loadVocabularyProgress());
      setStorageError(null);
    } catch (error) {
      console.error("Could not load vocabulary progress.", error);
      setStorageError(
        error instanceof Error
          ? error.message
          : "Could not load saved progress.",
      );
    } finally {
      setMounted(true);
    }
  }, []);

  const toggleDeck = (deckId: string) => {
    const next = new Set(activeDecks);
    if (next.has(deckId)) next.delete(deckId);
    else next.add(deckId);
    try {
      localStorage.setItem(ACTIVE_DECKS_STORAGE_KEY, JSON.stringify([...next]));
      setActiveDecks(next);
      setStorageError(null);
    } catch (error) {
      console.error("Could not save active vocabulary decks.", error);
      setStorageError(
        error instanceof Error
          ? error.message
          : "Could not save deck selection.",
      );
    }
  };

  const totalCards = VOCABULARY_DECKS.reduce(
    (total, deck) => total + deck.cards.length,
    0,
  );
  const totalStudyCounts = VOCABULARY_DECKS.reduce(
    (totals, deck) => {
      const counts = getStudyCounts(deck, progress[deck.id] ?? []);
      return {
        newCount: totals.newCount + counts.newCount,
        dueCount: totals.dueCount + counts.dueCount,
      };
    },
    { newCount: 0, dueCount: 0 },
  );

  return (
    <main className="min-h-full bg-white font-sans antialiased selection:bg-gray-200 selection:text-black">
      <motion.div
        variants={container}
        initial={reduce || !mounted ? false : "hidden"}
        animate={mounted ? "show" : false}
        className="mx-auto w-full max-w-6xl px-3 pb-12 pt-5 sm:px-5 md:px-8 md:pt-8"
      >
        {storageError && (
          <p
            role="alert"
            className="mb-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            Saved progress could not be loaded or updated: {storageError}
          </p>
        )}
        <motion.header variants={item} className="mb-7 md:mb-9">
          <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86868b]">
            <BookOpen className="h-3.5 w-3.5" />
            SAT word bank
          </p>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="max-w-3xl text-[36px] font-semibold leading-[1.04] tracking-[-0.04em] text-[#1d1d1f] md:text-[52px]">
                Make every word stick.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#737373] md:text-base">
                Pick a month, review a few words, and let spaced repetition
                handle what comes next.
              </p>
            </div>
            <p className="shrink-0 rounded-full border border-black/[0.06] bg-white px-3.5 py-2 text-xs font-medium text-[#686868]">
              5 monthly decks · {totalCards} SAT words
            </p>
          </div>
        </motion.header>

        <div className="mb-5 grid grid-cols-3 gap-2.5 sm:gap-3">
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-2xl bg-[#1d1d1f] p-4 text-white sm:rounded-[22px] sm:p-5"
          >
            <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-[#0080FF]/25 blur-3xl" />
            <div className="relative z-10">
              <p className="text-[11px] font-medium text-white/60 sm:text-xs">
                Active
              </p>
              <p className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.045em] tabular-nums sm:text-[36px]">
                {activeDecks.size}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-2xl border border-black/[0.04] bg-white p-4 text-[#1d1d1f] sm:rounded-[22px] sm:p-5"
          >
            <div>
              <p className="text-[11px] font-medium text-[#86868b] sm:text-xs">
                Study decks
              </p>
              <p className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.045em] tabular-nums sm:text-[36px]">
                {VOCABULARY_DECKS.length}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-2xl border border-black/[0.04] bg-white p-4 text-[#1d1d1f] sm:rounded-[22px] sm:p-5"
          >
            <div>
              <p className="text-[11px] font-medium text-[#86868b] sm:text-xs">
                Total cards
              </p>
              <p className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.045em] tabular-nums sm:text-[36px]">
                {totalCards.toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.section variants={item}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.025em] text-[#1d1d1f]">
                Your decks
              </h2>
              <p className="mt-1 text-xs text-[#86868b]">
                {totalStudyCounts.dueCount} due · {totalStudyCounts.newCount}{" "}
                new words ready
              </p>
            </div>
            <p className="text-xs font-medium text-[#86868b]">
              Select a deck to begin
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
            {VOCABULARY_DECKS.map((deck, index) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                icon={DECK_ICONS[index] ?? BookOpen}
                {...getStudyCounts(deck, progress[deck.id] ?? [])}
                isActive={activeDecks.has(deck.id)}
                onToggle={() => toggleDeck(deck.id)}
                reduce={reduce}
              />
            ))}
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
