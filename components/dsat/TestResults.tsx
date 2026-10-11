"use client";

import { auth } from "@/lib/firebase";
import {
    deleteAttempt,
    hasAttempt,
    isAnswerCorrect,
    pct,
    saveAttempt,
    summarize,
    type Section,
    type Tally,
    type TestAttempt,
} from "@/lib/test-attempts";
import { Bookmark, Check, ChevronLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import QuestionReview from "./QuestionReview";

const COLOR: Record<Section, string> = {
  "Reading and Writing": "#10B981",
  Math: "#0080FF",
};
const SHORT: Record<Section, string> = {
  "Reading and Writing": "Reading & Writing",
  Math: "Math",
};
const LEVEL: Record<string, string> = {
  Easy: "Easier",
  Medium: "Standard",
  Hard: "Harder",
};

const card = "rounded-[28px] bg-[#f5f5f7] dark:bg-gray-900 p-6 md:p-8";
const h2 =
  "text-[22px] font-medium tracking-[-0.02em] text-[#1d1d1f] dark:text-white";
const muted = "text-[#86868b] dark:text-gray-400";

function Bar({
  t,
  color,
  height = "h-2",
}: {
  t: Tally;
  color: string;
  height?: string;
}) {
  return (
    <div
      className={`${height} w-full overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/10`}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700"
        style={{ width: `${pct(t)}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function TestResults({
  attempt,
  onExitAction,
}: {
  attempt: TestAttempt;
  onExitAction: () => void;
}) {
  const uid = auth?.currentUser?.uid;
  const s = useMemo(() => summarize(attempt), [attempt]);
  const [saved, setSaved] = useState(() => hasAttempt(attempt.id, uid));
  const [saveError, setSaveError] = useState(false);

  // The open question lives in the URL: /practice-test?attempt=<id>&q=<n>
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalQuestions = attempt.modules.reduce(
    (n, m) => n + m.questions.length,
    0,
  );
  const qNum = parseInt(searchParams.get("q") ?? "", 10);
  const review =
    Number.isFinite(qNum) && qNum >= 1 && qNum <= totalQuestions
      ? qNum - 1
      : null;
  const openedHere = useRef(false);

  const reviewUrl = useCallback(
    (i: number | null) =>
      `${pathname}?attempt=${attempt.id}${i !== null ? `&q=${i + 1}` : ""}`,
    [pathname, attempt.id],
  );
  const openReview = (i: number) => {
    openedHere.current = true;
    router.push(reviewUrl(i), { scroll: false });
  };
  const changeReview = useCallback(
    (i: number) => router.replace(reviewUrl(i), { scroll: false }),
    [router, reviewUrl],
  );
  const closeReview = useCallback(() => {
    if (openedHere.current) {
      openedHere.current = false;
      router.back(); // returns to the results URL without q
    } else {
      router.replace(reviewUrl(null), { scroll: false }); // deep-linked
    }
  }, [router, reviewUrl]);

  const incorrect = s.overall.total - s.overall.correct - s.overall.skipped;
  const sectionsPresent = (Object.keys(s.sections) as Section[]).filter(
    (k) => s.sections[k].total > 0,
  );

  // Offsets so a chip in module N opens the right question in the flat review list.
  const offsets = attempt.modules.reduce<number[]>((acc, _, i) => {
    acc.push(
      i === 0 ? 0 : acc[i - 1] + attempt.modules[i - 1].questions.length,
    );
    return acc;
  }, []);

  const weakSkills = s.skillList
    .filter((k) => k.total - k.correct > 0)
    .sort((a, b) => pct(a) - pct(b) || b.total - a.total)
    .slice(0, 5);

  const handleSave = () => {
    if (saved) {
      deleteAttempt(attempt.id, uid);
      setSaved(false);
    } else {
      const ok = saveAttempt(attempt, uid);
      setSaved(ok);
      setSaveError(!ok);
    }
  };

  const date = new Date(attempt.date);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-3 py-6 md:px-8 lg:px-10 font-sans antialiased text-[#1d1d1f] dark:text-gray-100">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4 pb-2">
          <div>
            <button
              onClick={onExitAction}
              className="mb-4 flex items-center gap-1.5 text-base text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <ChevronLeft size={18} strokeWidth={2} />
              Practice tests
            </button>
            <h1 className="text-[38px] md:text-[48px] font-medium leading-[1.05] tracking-[-0.035em]">
              {attempt.testName}
            </h1>
            <p className={`mt-3 text-base md:text-lg ${muted}`}>
              Completed{" "}
              {date.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              at{" "}
              {date.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className={`flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium transition-colors ${
                saved
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-[#171717] text-white hover:bg-black"
              }`}
            >
              {saved && <Check size={16} strokeWidth={2.5} />}
              {saved ? "Saved to history" : "Save results"}
            </button>
            {saved && (
              <button
                onClick={handleSave}
                className="text-sm text-gray-500 hover:text-rose-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </header>
        {saveError && (
          <p className="text-sm text-rose-600">
            Couldn&apos;t save — browser storage is full. Delete an older
            attempt and try again.
          </p>
        )}

        {/* Summary */}
        <section
          className={`${card} grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}
        >
          <div>
            <p className={`text-[15px] font-medium ${muted}`}>
              Overall accuracy
            </p>
            <p className="mt-1 text-[88px] md:text-[104px] font-medium leading-none tracking-[-0.05em] tabular-nums">
              {pct(s.overall)}
              <span className={`text-[40px] tracking-normal ${muted}`}>%</span>
            </p>
            <p className="mt-3 text-[17px] text-[#494440] dark:text-gray-300">
              {s.overall.correct} of {s.overall.total} correct
              {s.overall.skipped > 0 && ` · ${s.overall.skipped} skipped`}
            </p>

            {/* every question, in order, as one strip */}
            <div className="mt-6 flex flex-wrap gap-[3px]" aria-hidden="true">
              {attempt.modules.flatMap((rec, mi) =>
                rec.questions.map((q, qi) => {
                  const a = rec.answers[qi];
                  const skipped = a == null || String(a).trim() === "";
                  const ok = isAnswerCorrect(q, a);
                  return (
                    <span
                      key={`${mi}-${qi}`}
                      className={`h-3 w-[7px] rounded-[2px] ${
                        skipped
                          ? "bg-gray-300 dark:bg-gray-600"
                          : ok
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                      }`}
                    />
                  );
                }),
              )}
            </div>
            <p className={`mt-3 text-[13px] ${muted}`}>
              {s.overall.correct} correct · {incorrect} incorrect ·{" "}
              {s.overall.skipped} skipped
            </p>
          </div>

          <div className="grid content-start gap-3 sm:grid-cols-2">
            {sectionsPresent.map((sec) => (
              <div
                key={sec}
                className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center gap-2 text-[14px] font-medium">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLOR[sec] }}
                  />
                  {SHORT[sec]}
                </div>
                <p className="mt-3 text-[40px] font-medium leading-none tracking-[-0.03em] tabular-nums">
                  {pct(s.sections[sec])}%
                </p>
                <p className={`mt-1 mb-4 text-[14px] ${muted}`}>
                  {s.sections[sec].correct} of {s.sections[sec].total} correct
                </p>
                <Bar t={s.sections[sec]} color={COLOR[sec]} />
              </div>
            ))}

            {s.modules.map(({ rec, tally }, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[14px] font-medium">
                    {SHORT[rec.section]} · Module {rec.module}
                  </p>
                  <p className="text-[14px] tabular-nums font-medium">
                    {tally.correct}/{tally.total}
                  </p>
                </div>
                <div className="mt-3">
                  <Bar t={tally} color={COLOR[rec.section]} />
                </div>
                {rec.module === 2 && rec.difficulty && (
                  <p className={`mt-3 text-[13px] ${muted}`}>
                    Routed to the{" "}
                    {(LEVEL[rec.difficulty] ?? rec.difficulty).toLowerCase()}{" "}
                    module
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Domains */}
        <section className="grid gap-4 md:grid-cols-2">
          {sectionsPresent.map((sec) => {
            const rows = Object.entries(s.domains[sec]).sort(
              (a, b) => pct(a[1]) - pct(b[1]),
            );
            return (
              <div key={sec} className={card}>
                <h2 className={h2}>{SHORT[sec]} by domain</h2>
                <p className={`mt-1 mb-6 text-[14px] ${muted}`}>
                  Weakest first
                </p>
                <ul className="space-y-5">
                  {rows.map(([name, t]) => (
                    <li key={name}>
                      <div className="mb-2 flex items-baseline justify-between gap-3 text-[15px]">
                        <span className="font-medium">{name}</span>
                        <span className="tabular-nums text-[#494440] dark:text-gray-300">
                          {t.correct}/{t.total} · {pct(t)}%
                        </span>
                      </div>
                      <Bar t={t} color={COLOR[sec]} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        {/* Difficulty + focus */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className={card}>
            <h2 className={h2}>By difficulty</h2>
            <p className={`mt-1 mb-6 text-[14px] ${muted}`}>
              How you did as questions got harder
            </p>
            <ul className="space-y-5">
              {[
                "Easy",
                "Medium",
                "Hard",
                ...Object.keys(s.difficulty).filter(
                  (d) => !["Easy", "Medium", "Hard"].includes(d),
                ),
              ]
                .filter((d) => s.difficulty[d])
                .map((d) => (
                  <li key={d}>
                    <div className="mb-2 flex items-baseline justify-between text-[15px]">
                      <span className="font-medium">{d}</span>
                      <span className="tabular-nums text-[#494440] dark:text-gray-300">
                        {s.difficulty[d].correct}/{s.difficulty[d].total} ·{" "}
                        {pct(s.difficulty[d])}%
                      </span>
                    </div>
                    <Bar t={s.difficulty[d]} color="#171717" />
                  </li>
                ))}
            </ul>
          </div>

          <div className={card}>
            <h2 className={h2}>Skills to practice next</h2>
            <p className={`mt-1 mb-6 text-[14px] ${muted}`}>
              Lowest accuracy among skills you missed
            </p>
            {weakSkills.length === 0 ? (
              <p className="text-[15px] text-[#494440] dark:text-gray-300">
                No missed questions — nothing to flag.
              </p>
            ) : (
              <ul className="divide-y divide-black/[0.06] dark:divide-white/10">
                {weakSkills.map((k) => (
                  <li
                    key={`${k.section}${k.name}`}
                    className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: COLOR[k.section] }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium">
                        {k.name}
                      </p>
                      <p className={`truncate text-[13px] ${muted}`}>
                        {k.domain}
                      </p>
                    </div>
                    <p className="shrink-0 text-[15px] tabular-nums font-medium">
                      {k.correct}/{k.total}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Question review */}
        <section className={card}>
          <h2 className={h2}>Question review</h2>
          <p className={`mt-1 mb-6 text-[14px] ${muted}`}>
            Select a question to see it as you took it, with the correct answer
            and your choice.
          </p>

          <div className="space-y-7">
            {attempt.modules.map((rec, mi) => (
              <div key={mi}>
                <p className="mb-3 flex items-center gap-2 text-[14px] font-medium">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLOR[rec.section] }}
                  />
                  {SHORT[rec.section]} · Module {rec.module}
                </p>
                <div className="grid grid-cols-7 gap-2 sm:grid-cols-9 lg:grid-cols-[repeat(14,minmax(0,1fr))]">
                  {rec.questions.map((q, qi) => {
                    const a = rec.answers[qi];
                    const skipped = a == null || String(a).trim() === "";
                    const ok = isAnswerCorrect(q, a);
                    const flagged = rec.marked.includes((q as any).question_id);
                    return (
                      <button
                        key={qi}
                        onClick={() => openReview(offsets[mi] + qi)}
                        aria-label={`Question ${qi + 1}, ${skipped ? "skipped" : ok ? "correct" : "incorrect"}`}
                        className={`relative h-11 rounded-xl text-[14px] font-semibold tabular-nums transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/60 ${
                          skipped
                            ? "border-2 border-dashed border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400"
                            : ok
                              ? "bg-emerald-500 text-white"
                              : "bg-rose-500 text-white"
                        }`}
                      >
                        {qi + 1}
                        {flagged && (
                          <Bookmark
                            size={10}
                            className="absolute right-1 top-1 fill-current"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-7 flex flex-wrap gap-5 text-[13px] ${muted}`}>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-emerald-500" />
              Correct
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-rose-500" />
              Incorrect
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded border-2 border-dashed border-gray-400" />
              Skipped
            </span>
            <span className="flex items-center gap-2">
              <Bookmark size={11} className="fill-current" />
              Marked for review
            </span>
          </div>
        </section>

        <div className="flex justify-center pt-4 pb-10">
          <button
            onClick={onExitAction}
            className="h-12 rounded-full bg-[#171717] px-8 text-[16px] font-medium text-white hover:bg-black transition-colors"
          >
            Back to practice tests
          </button>
        </div>
      </div>

      {review !== null && (
        <QuestionReview
          records={attempt.modules}
          index={review}
          onIndexChange={changeReview}
          onClose={closeReview}
        />
      )}
    </div>
  );
}
