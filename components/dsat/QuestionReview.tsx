"use client";

import DesmosCalculator from "@/components/dsat/DesmosCalculator";
import {
    getCorrectDisplay,
    getCorrectKey,
    isAnswerCorrect,
    type ModuleRecord,
} from "@/lib/test-attempts";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Check, ChevronLeft, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/* ----------------------------- passage content ----------------------------- */
// Same transformation the live test uses, so the review looks identical.

const SERIF =
  "text-[17px] sm:text-[19px] leading-[1.7] text-[#1C1C1E] dark:text-gray-100 font-serif";

function PassageContent({ q }: { q: any }) {
  const html = useMemo(() => {
    if (!q.passage) return null;
    let h: string = q.passage;
    h = h.replace(/\[Graph:.*?\]/g, "").replace(/\[Table:.*?\]/g, "");

    if (q.table?.title) {
      const parts = h.split(q.table.title);
      if (parts.length > 1) {
        h = parts[1]
          .split("\n")
          .filter((l: string) => l.trim() && !l.includes("|"))
          .join(" ")
          .trim();
      }
    }
    if (q.has_underline && q.underlined_text) {
      h = h.replace(
        q.underlined_text,
        `<u class="bg-gray-200 dark:bg-gray-700 px-1">${q.underlined_text}</u>`,
      );
    }
    if (h.includes("Text 1") && h.includes("Text 2")) {
      const parts = h.split("Text 2");
      h =
        parts[0].replace("Text 1", "<strong>Text 1</strong> ") +
        (parts[1] ? ` <strong>Text 2</strong> ${parts[1]}` : "");
    }
    return h
      .replace(/\n+/g, " ")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>\s*<p>/gi, " ")
      .replace(/<\/?p>/gi, "");
  }, [q]);

  if (!q.passage) return null;

  if (q.notes?.length) {
    return (
      <div className={SERIF}>
        {q.introduction && (
          <span dangerouslySetInnerHTML={{ __html: q.introduction }} />
        )}
        <span className={q.introduction ? "pl-12" : ""}>
          While researching a topic, a student has taken the following notes:{" "}
          {q.notes.map((n: string, i: number) => (
            <span key={i}>
              {i > 0 && "; "}
              {n}
            </span>
          ))}
        </span>
      </div>
    );
  }

  return (
    <div className={SERIF}>
      {q.introduction && (
        <span dangerouslySetInnerHTML={{ __html: q.introduction }} />
      )}
      <span
        className={q.introduction ? "pl-12" : ""}
        dangerouslySetInnerHTML={{ __html: html ?? "" }}
      />
    </div>
  );
}

function Graphics({ q }: { q: any }) {
  if (!q.has_graphic || !q.graphics?.length || q.choice_graphics) return null;
  return (
    <div className="my-4 space-y-4">
      {q.graphics.map((g: any, i: number) => {
        const src = typeof g === "string" ? g : g.image_path;
        return src ? (
          <img
            key={i}
            src={src}
            alt="Question graphic"
            className="h-auto max-w-full rounded-lg border border-gray-200 dark:border-gray-700"
            onError={(e) =>
              ((e.target as HTMLImageElement).style.display = "none")
            }
          />
        ) : null;
      })}
    </div>
  );
}

function TableBlock({ q }: { q: any }) {
  if (!q.table?.columns || q.has_graphic) return null;
  return (
    <div className="my-4 overflow-x-auto">
      <table className="border border-gray-300 dark:border-gray-600 text-base">
        <thead>
          <tr>
            {q.table.columns.map((c: string) => (
              <th
                key={c}
                className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-800 font-semibold"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {q.table.rows.map((row: string[], i: number) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------------- choices --------------------------------- */

function ChoiceRow({
  k,
  value,
  graphic,
  isUser,
  isCorrect,
}: {
  k: string;
  value: string;
  graphic?: string;
  isUser: boolean;
  isCorrect: boolean;
}) {
  const tone = isCorrect
    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
    : isUser
      ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
      : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800";
  const dot = isCorrect
    ? "bg-emerald-500 text-white"
    : isUser
      ? "bg-rose-500 text-white"
      : "border-2 border-gray-400 text-[#1C1C1E] dark:text-gray-100";
  const badge = isCorrect
    ? isUser
      ? "Your answer · Correct"
      : "Correct answer"
    : isUser
      ? "Your answer"
      : null;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 min-w-0 ${tone}`}
    >
      <div
        className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-sm font-bold font-sans ${dot}`}
      >
        {isCorrect ? (
          <Check size={15} strokeWidth={3} />
        ) : isUser ? (
          <X size={15} strokeWidth={3} />
        ) : (
          k
        )}
      </div>
      {graphic ? (
        <img src={graphic} alt={`Choice ${k}`} className="h-auto max-w-full" />
      ) : (
        <span className={`${SERIF} flex-1 min-w-0`}>{value}</span>
      )}
      {badge && (
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold font-sans ${
            isCorrect
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
              : "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
          }`}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

/* ---------------------------------- review --------------------------------- */

export default function QuestionReview({
  records,
  index,
  onIndexChange,
  onClose,
}: {
  records: ModuleRecord[];
  /** flat question index across all modules (driven by the URL) */
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const items = useMemo(
    () =>
      records.flatMap((rec, mi) =>
        rec.questions.map((q, idx) => ({ rec, q: q as any, idx, mi })),
      ),
    [records],
  );
  const i = index;
  const setI = onIndexChange;
  const [showCalc, setShowCalc] = useState(false);
  const item = items[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        onIndexChange(Math.min(items.length - 1, i + 1));
      if (e.key === "ArrowLeft") onIndexChange(Math.max(0, i - 1));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length, i, onIndexChange, onClose]);

  if (!item) return null;
  const { rec, q, idx } = item;
  const isMath = rec.section === "Math";
  const userAnswer = rec.answers[idx];
  const answered = userAnswer != null && String(userAnswer).trim() !== "";
  const correct = isAnswerCorrect(q, userAnswer);
  const correctKey = getCorrectKey(q);
  const marked = rec.marked.includes(q.question_id);
  const hasChoices = q.choices && Object.keys(q.choices).length > 0;

  const status = !answered
    ? {
        label: "Skipped",
        cls: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
      }
    : correct
      ? {
          label: "Correct",
          cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
        }
      : {
          label: "Incorrect",
          cls: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
        };

  const questionPane = (
    <div className="max-w-3xl mx-auto md:mx-0">
      {(q.prompt || q.question) && (
        <div className={`mb-6 ${SERIF}`}>{q.prompt || q.question}</div>
      )}
      {isMath && (
        <>
          <Graphics q={q} />
          <TableBlock q={q} />
        </>
      )}

      {hasChoices ? (
        <div className="space-y-3">
          {Object.entries(q.choices).map(([k, v]) => (
            <ChoiceRow
              key={k}
              k={k}
              value={String(v)}
              graphic={q.choice_graphics?.[k]}
              isUser={answered && userAnswer === k}
              isCorrect={correctKey === k}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div
            className={`rounded-lg border-2 p-4 ${
              !answered
                ? "border-gray-300 dark:border-gray-700"
                : correct
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                  : "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
            }`}
          >
            <p className="text-xs font-semibold font-sans text-gray-500 dark:text-gray-400">
              Your answer
            </p>
            <p className="mt-1 font-mono text-2xl">
              {answered ? userAnswer : "—"}
            </p>
          </div>
          <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-4">
            <p className="text-xs font-semibold font-sans text-gray-500 dark:text-gray-400">
              Correct answer
            </p>
            <p className="mt-1 font-mono text-2xl">{getCorrectDisplay(q)}</p>
          </div>
        </div>
      )}

      {q.rationale && (
        <div className="mt-8 rounded-2xl bg-[#f5f5f7] dark:bg-gray-800 p-6">
          <h4 className="mb-2 text-sm font-semibold font-sans text-gray-900 dark:text-gray-100">
            Why this is the answer
          </h4>
          <p className="text-[16px] leading-[1.7] font-serif text-gray-700 dark:text-gray-300">
            {q.rationale}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      <header className="flex flex-nowrap items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b-2 border-gray-200 dark:border-gray-700 shrink-0">
        <button
          onClick={onClose}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          Back to results
        </button>

        <div className="flex min-w-0 items-center gap-2 whitespace-nowrap text-sm font-semibold">
          <span className="truncate">
            {isMath ? "Math" : "Reading & Writing"} · Module {rec.module} ·
            Question {idx + 1}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}
          >
            {status.label}
          </span>
          {marked && (
            <span className="flex items-center gap-1 rounded-full bg-gray-900 dark:bg-gray-700 px-3 py-1 text-xs font-semibold text-white">
              <Bookmark size={12} className="fill-white" /> Marked
            </span>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          {q.domain && (
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
              {q.domain}
            </span>
          )}
          {q.skill && (
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
              {q.skill}
            </span>
          )}
          {q.difficulty && (
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
              {q.difficulty}
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
        {isMath ? (
          <div className="flex h-full min-h-0 w-full">
            <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
              <div className="sticky top-0 z-10 mx-auto w-full max-w-3xl bg-white px-6 py-3 dark:bg-gray-900 md:px-8">
                <div className="flex items-center justify-between gap-2 rounded-full border-2 border-gray-200 bg-gray-100 px-2 py-1.5 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-[15px] font-bold text-white">
                    {idx + 1}
                  </div>
                  <button
                    onClick={() => setShowCalc((v) => !v)}
                    className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                      showCalc
                        ? "border-sky-500 bg-sky-400 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Calculator
                  </button>
                </div>
              </div>
              <div
                className={`${showCalc ? "" : "mx-auto"} w-full max-w-3xl px-6 pb-8 pt-2 md:px-8`}
              >
                {questionPane}
              </div>
            </div>

            <AnimatePresence>
              {showCalc && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "50%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="hidden shrink-0 flex-col overflow-hidden border-l-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:flex"
                >
                  <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-2.5 dark:border-gray-700">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Graphing Calculator
                    </h3>
                    <button
                      onClick={() => setShowCalc(false)}
                      aria-label="Close calculator"
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X
                        size={18}
                        className="text-gray-600 dark:text-gray-400"
                      />
                    </button>
                  </div>
                  <div className="min-h-0 flex-1">
                    <DesmosCalculator />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:h-full">
            <div className="md:w-1/2 md:overflow-y-auto p-6 sm:p-8 md:p-10 md:border-r-2 border-gray-200 dark:border-gray-700">
              <div className="max-w-3xl mx-auto md:mx-0">
                <PassageContent q={q} />
                {q.has_graphic && <Graphics q={q} />}
                <TableBlock q={q} />
              </div>
            </div>
            <div className="md:w-1/2 md:overflow-y-auto p-5 sm:p-6 md:p-8 border-t-2 md:border-t-0 border-gray-200 dark:border-gray-700">
              {questionPane}
            </div>
          </div>
        )}
      </main>

      <footer className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t-2 border-gray-200 dark:border-gray-700 shrink-0">
        <span className="rounded-full bg-black dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-white">
          {i + 1} of {items.length}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setI(i - 1)}
            disabled={i === 0}
            className="px-5 py-1.5 border-2 border-gray-300 dark:border-gray-600 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setI(i + 1)}
            disabled={i === items.length - 1}
            className="px-5 py-1.5 border-2 border-gray-300 dark:border-gray-600 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}
