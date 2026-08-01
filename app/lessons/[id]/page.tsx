"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Check, CornerUpLeft, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const smoothEase = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const smoothFadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: smoothEase },
  },
};

// ---- streak dots, filled in as interactions land correct ----
function StreakDots({ total, correct }: { total: number; correct: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            backgroundColor: i < correct ? "#111" : "#DDD",
            scale: i === correct - 1 ? [1, 1.4, 1] : 1,
          }}
          transition={{ duration: 0.35, ease: smoothEase }}
          className="w-2 h-2 rounded-full"
        />
      ))}
    </div>
  );
}

type QuizProps = {
  prompt: string;
  options: { label: string; correct: boolean; note: string }[];
  onCorrect: () => void;
};

function TapQuiz({ prompt, options, onCorrect }: QuizProps) {
  const [picked, setPicked] = useState<number | null>(null);

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (options[i]?.correct) onCorrect();
  };

  return (
    <motion.div
      animate={
        picked !== null && options[picked]?.correct
          ? { scale: [1, 1.015, 1] }
          : picked !== null
            ? { x: [0, -6, 6, -4, 4, 0] }
            : {}
      }
      transition={{ duration: 0.4, ease: smoothEase }}
      className="bg-white rounded-[24px] p-8 md:p-10 my-8 shadow-sm"
    >
      <p className="text-[15px] text-[#555] mb-5">{prompt}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const showState = picked !== null;
          return (
            <button
              key={i}
              onClick={() => handlePick(i)}
              disabled={picked !== null}
              className={`text-left text-[14px] rounded-[12px] px-4 py-3 border transition-colors ${
                showState && isPicked && opt.correct
                  ? "border-[#4C9A6A] bg-[#EEF7F1] text-[#111]"
                  : showState && isPicked && !opt.correct
                    ? "border-[#D8534E] bg-[#FBEDEC] text-[#111]"
                    : "border-[#E5E5E5] text-[#555] hover:border-[#bbb]"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {picked !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            transition={{ duration: 0.4, ease: smoothEase }}
            className="flex items-start gap-2 text-[14px] mt-4 pt-4 border-t border-[#E5E5E5]"
          >
            {options[picked]?.correct ? (
              <Check className="w-4 h-4 text-[#4C9A6A] shrink-0 mt-0.5" />
            ) : (
              <X className="w-4 h-4 text-[#D8534E] shrink-0 mt-0.5" />
            )}
            <span className="text-[#111]">{options[picked]?.note}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SentenceBoundariesLesson() {
  const [correctCount, setCorrectCount] = useState(0);
  const bump = () => setCorrectCount((c) => Math.min(c + 1, 3));

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#111] font-sans selection:bg-neutral-300">
      <div className="max-w-[1100px] mx-auto px-6 py-20 flex flex-col md:flex-row gap-16 lg:gap-28">
        <aside className="hidden md:block w-52 shrink-0 sticky top-20 h-fit">
          <Link
            href="/lessons"
            className="flex items-center gap-2 text-[#888] hover:text-[#111] transition-colors text-[14px] mb-12"
          >
            <CornerUpLeft className="w-4 h-4" /> Back to Lessons
          </Link>

          <nav className="flex flex-col gap-3.5 text-[14px]">
            <span className="text-[#111] font-medium mb-1">
              Standard English
            </span>
            <a
              href="#idea"
              className="text-[#888] hover:text-[#111] transition-colors"
            >
              The idea
            </a>
            <a
              href="#run-on"
              className="text-[#888] hover:text-[#111] transition-colors"
            >
              Run-ons
            </a>
            <a
              href="#fragment"
              className="text-[#888] hover:text-[#111] transition-colors"
            >
              Fragments
            </a>
            <a
              href="#fixes"
              className="text-[#888] hover:text-[#111] transition-colors"
            >
              The four fixes
            </a>
            <a
              href="#next-steps"
              className="text-[#888] hover:text-[#111] transition-colors"
            >
              Next steps
            </a>
          </nav>
        </aside>

        <motion.main
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex-1 max-w-[620px]"
        >
          <motion.header variants={smoothFadeUp} className="mb-6">
            <h1 className="text-[16px] font-medium mb-1">
              Sentence Boundaries
            </h1>
            <p className="text-[14px] text-[#888]">
              Standard English Conventions · 4 min
            </p>
          </motion.header>

          <motion.div variants={smoothFadeUp}>
            <StreakDots total={3} correct={correctCount} />
          </motion.div>

          <div className="space-y-6 text-[15px] leading-[1.75] text-[#555]">
            <motion.div variants={smoothFadeUp}>
              <h2
                id="idea"
                className="text-[16px] font-medium text-[#111] mb-3"
              >
                The idea
              </h2>
              <p>
                A sentence needs exactly one complete thought. Cram two in, or
                stop before you finish one — the SAT flags both.
              </p>
            </motion.div>

            <motion.hr
              variants={smoothFadeUp}
              className="border-t border-[#E5E5E5] my-10"
            />

            <motion.div variants={smoothFadeUp}>
              <h2
                id="run-on"
                className="text-[16px] font-medium text-[#111] mb-3"
              >
                Run-ons
              </h2>
              <p>
                Two complete sentences, jammed together with no punctuation.
              </p>
            </motion.div>

            <motion.div variants={smoothFadeUp}>
              <TapQuiz
                prompt='"The storm hit fast the town lost power." What went wrong?'
                options={[
                  {
                    label: "Two sentences glued together",
                    correct: true,
                    note: "Exactly. Both halves can stand alone — they need a period, comma + and, or semicolon between them.",
                  },
                  {
                    label: "Missing a subject",
                    correct: false,
                    note: 'Both halves already have one ("the storm", "the town"). That\'s not the problem here.',
                  },
                ]}
                onCorrect={bump}
              />
            </motion.div>

            <motion.hr
              variants={smoothFadeUp}
              className="border-t border-[#E5E5E5] my-10"
            />

            <motion.div variants={smoothFadeUp}>
              <h2
                id="fragment"
                className="text-[16px] font-medium text-[#111] mb-3"
              >
                Fragments
              </h2>
              <p>
                The opposite problem — a piece pretending to be the whole thing.
              </p>
            </motion.div>

            <motion.div variants={smoothFadeUp}>
              <TapQuiz
                prompt='"Because the storm hit fast." Is this a full sentence?'
                options={[
                  {
                    label: "Yes, it has a subject and verb",
                    correct: false,
                    note: 'That\'s the trap. "Because" makes it depend on something else — it never finishes the thought.',
                  },
                  {
                    label: "No, it's left hanging",
                    correct: true,
                    note: 'Right. "Because" promises a result that never shows up. Needs a second half to land.',
                  },
                ]}
                onCorrect={bump}
              />
            </motion.div>

            <motion.hr
              variants={smoothFadeUp}
              className="border-t border-[#E5E5E5] my-10"
            />

            <motion.div variants={smoothFadeUp}>
              <h2
                id="fixes"
                className="text-[16px] font-medium text-[#111] mb-3"
              >
                The four fixes
              </h2>
              <p>
                Every run-on gets patched the same four ways. Pick the cleanest
                one.
              </p>
            </motion.div>

            <motion.div variants={smoothFadeUp}>
              <TapQuiz
                prompt='"The storm hit fast ___ the town lost power." Best fix?'
                options={[
                  {
                    label: "…fast, the town lost power.",
                    correct: false,
                    note: "That's the trap answer for people who just add a comma and move on. A comma alone can't join two full sentences.",
                  },
                  {
                    label: "…fast, and the town lost power.",
                    correct: true,
                    note: "That's a keeper. Comma plus a joining word — one of your four fixes.",
                  },
                ]}
                onCorrect={bump}
              />
            </motion.div>

            <motion.hr
              variants={smoothFadeUp}
              className="border-t border-[#E5E5E5] my-10"
            />

            <motion.div variants={smoothFadeUp} className="pb-24">
              <h2
                id="next-steps"
                className="text-[16px] font-medium text-[#111] mb-4"
              >
                Next steps
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[#888]" />
                  <span className="text-[#111] font-medium">
                    Practice 5 Sentence Boundaries questions
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[#888]" />
                  <span className="text-[#111] font-medium">
                    Review any you miss right here
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
