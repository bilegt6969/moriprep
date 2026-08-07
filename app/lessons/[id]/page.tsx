"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightLeft,
  Check,
  Copy,
  CornerUpLeft,
  Eye,
  MousePointer2,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

// --- Utilities ---
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));
const smoothEase = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: smoothEase },
  },
};

// --- Lesson 01: Sentence Surgery ---
type Chunk = {
  id: string;
  text: string;
  label: string;
  isEssential: boolean;
};

const sentenceChunks: Chunk[] = [
  { id: "subj", text: "The researchers", label: "Subject", isEssential: true },
  { id: "verb", text: "published", label: "Verb", isEssential: true },
  { id: "obj", text: "their findings", label: "Object", isEssential: false },
  { id: "mod", text: "yesterday.", label: "Modifier", isEssential: false },
];

function SentenceSurgery() {
  const [activeChunks, setActiveChunks] = useState<string[]>(
    sentenceChunks.map((c) => c.id),
  );
  const [showLabels, setShowLabels] = useState(false);

  const toggleChunk = (id: string) => {
    setActiveChunks((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const hasSubject = activeChunks.includes("subj");
  const hasVerb = activeChunks.includes("verb");
  const isComplete = hasSubject && hasVerb;

  return (
    <div className="bg-neutral-50 border border-neutral-200/60 rounded-[32px] overflow-hidden shadow-sm my-10">
      <div className="p-8 md:p-10 relative">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[14px] font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
            <MousePointer2 className="w-4 h-4" /> Tap to remove pieces
          </p>
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={cn(
              "flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-full transition-all",
              showLabels
                ? "bg-neutral-900 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100",
            )}
          >
            <Eye className="w-4 h-4" />
            {showLabels ? "Hide Labels" : "Show Labels"}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 items-end min-h-[80px]">
          <AnimatePresence mode="popLayout">
            {sentenceChunks.map((chunk) => {
              const isActive = activeChunks.includes(chunk.id);
              return (
                <motion.button
                  key={chunk.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: isActive ? 1 : 0.4,
                    scale: 1,
                    y: isActive ? 0 : 4,
                  }}
                  whileHover={{ scale: isActive ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleChunk(chunk.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 transition-colors",
                    isActive
                      ? "text-neutral-900"
                      : "text-neutral-400 line-through decoration-neutral-300",
                  )}
                >
                  <AnimatePresence>
                    {showLabels && (
                      <motion.span
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 absolute -top-6"
                      >
                        {chunk.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="text-xl md:text-2xl font-medium tracking-tight bg-white border border-neutral-200 shadow-sm px-5 py-3 rounded-2xl">
                    {chunk.text}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        layout
        className={cn(
          "px-8 py-6 flex items-center justify-between border-t transition-colors duration-500",
          isComplete
            ? "bg-[#F2FBF5] border-[#D6F0E0]"
            : "bg-[#FFF4F4] border-[#FCE4E4]",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors",
              isComplete
                ? "bg-[#34C759] text-white"
                : "bg-[#FF3B30] text-white",
            )}
          >
            {isComplete ? (
              <Check className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3
              className={cn(
                "text-[16px] font-semibold transition-colors",
                isComplete ? "text-[#1B5E20]" : "text-[#B71C1C]",
              )}
            >
              {isComplete ? "Complete Sentence" : "Broken"}
            </h3>
            <p
              className={cn(
                "text-[14px] transition-colors",
                isComplete ? "text-[#2E7D32]/80" : "text-[#C62828]/80",
              )}
            >
              {isComplete
                ? "Can stand entirely on its own."
                : "Missing essential structural pieces."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Lesson 02: Can It Stand? ---
function StandAloneQuiz() {
  const [answered, setAnswered] = useState(false);

  return (
    <div className="bg-white border border-neutral-200 rounded-[32px] p-8 md:p-10 my-10 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
          <MousePointer2 className="w-4 h-4" />
        </div>
        <p className="text-[14px] font-medium text-neutral-500 uppercase tracking-wider">
          Can It Stand?
        </p>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 leading-tight">
          <span className="text-neutral-400">Because</span> the researchers
          published their findings
        </h2>
      </div>

      {!answered ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setAnswered(true)}
            className="py-5 px-6 rounded-[20px] border-2 border-neutral-200 hover:border-neutral-900 transition-colors text-[15px] font-semibold text-neutral-700 hover:text-neutral-900 flex flex-col items-center gap-1"
          >
            STAND ALONE
          </button>
          <button
            onClick={() => setAnswered(true)}
            className="py-5 px-6 rounded-[20px] border-2 border-neutral-200 hover:border-neutral-900 transition-colors text-[15px] font-semibold text-neutral-700 hover:text-neutral-900 flex flex-col items-center gap-1"
          >
            NEEDS MORE
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#FFF4F4] border border-[#FCE4E4] rounded-[24px] p-6 text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FF3B30] text-white mb-4 shadow-sm">
            <X className="w-6 h-6" />
          </div>
          <h3 className="text-[18px] font-semibold text-[#B71C1C] mb-2">
            Incomplete. It leaves you waiting.
          </h3>
          <p className="text-[15px] text-[#C62828]/80 max-w-md mx-auto">
            "Because" makes it a Dependent Clause. It promises a result that
            never shows up.
          </p>
          <button
            onClick={() => setAnswered(false)}
            className="mt-6 text-[14px] font-medium text-neutral-500 hover:text-neutral-900 underline underline-offset-4"
          >
            Reset
          </button>
        </motion.div>
      )}
    </div>
  );
}

// --- Lesson 03: The Semicolon ---
function SemicolonWall() {
  const [hasSemicolon, setHasSemicolon] = useState(false);

  return (
    <div className="bg-neutral-50 border border-neutral-200/60 rounded-[32px] p-8 md:p-10 my-10 shadow-sm relative text-center">
      <p className="text-[14px] font-medium text-neutral-500 uppercase tracking-wider mb-8 text-left flex items-center gap-2">
        <MousePointer2 className="w-4 h-4" /> Tap the gap to build the wall
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xl md:text-2xl font-medium tracking-tight">
        <div className="bg-white px-6 py-4 rounded-2xl border border-neutral-200 shadow-sm relative">
          The experiment was successful
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-[#34C759] font-bold tracking-widest uppercase">
            Complete
          </span>
        </div>

        <button
          onClick={() => setHasSemicolon(!hasSemicolon)}
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center text-4xl pb-2 transition-all duration-300",
            hasSemicolon
              ? "bg-neutral-900 text-white shadow-md scale-100"
              : "bg-neutral-200/50 text-transparent hover:bg-neutral-200 border-2 border-dashed border-neutral-300 scale-95",
          )}
        >
          {hasSemicolon ? ";" : "+"}
        </button>

        <div className="bg-white px-6 py-4 rounded-2xl border border-neutral-200 shadow-sm relative mt-6 md:mt-0">
          the researchers published the results
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-[#34C759] font-bold tracking-widest uppercase">
            Complete
          </span>
        </div>
      </div>

      <AnimatePresence>
        {hasSemicolon && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-14 inline-block bg-[#F2FBF5] border border-[#D6F0E0] text-[#1B5E20] px-6 py-3 rounded-full text-[14px] font-medium"
          >
            Correct! Complete ; Complete
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Lesson 04: Period vs Semicolon ---
function PunctuationToggle() {
  const [isSemicolon, setIsSemicolon] = useState(false);

  return (
    <div className="bg-white border border-neutral-200 rounded-[32px] p-8 md:p-10 my-10 shadow-sm relative text-center">
      <p className="text-[14px] font-medium text-neutral-500 uppercase tracking-wider mb-8 text-left flex items-center gap-2">
        <ArrowRightLeft className="w-4 h-4" /> Tap the punctuation to swap
      </p>

      <div className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 leading-relaxed max-w-xl mx-auto">
        The experiment was successful
        <button
          onClick={() => setIsSemicolon(!isSemicolon)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-100 text-3xl text-black transition-colors mx-1 translate-y-1"
        >
          {isSemicolon ? ";" : "."}
        </button>
        <br />
        <span
          className={cn(
            "transition-colors",
            isSemicolon ? "lowercase" : "capitalize",
          )}
        >
          the researchers published the results.
        </span>
      </div>

      <div className="mt-12 flex items-center justify-center gap-12">
        <div className="text-center">
          <div className="w-3 h-3 rounded-full bg-[#34C759] mx-auto mb-2" />
          <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest">
            Side 1: Complete
          </span>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 rounded-full bg-[#34C759] mx-auto mb-2" />
          <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest">
            Side 2: Complete
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Lesson 05: Comma + FANBOYS ---
function FanboysBuilder() {
  const [fixed, setFixed] = useState(false);

  return (
    <div className="bg-neutral-50 border border-neutral-200/60 rounded-[32px] overflow-hidden shadow-sm my-10">
      <div className="p-8 md:p-10 relative">
        <p className="text-[14px] font-medium text-neutral-500 uppercase tracking-wider mb-8 flex items-center gap-2">
          <MousePointer2 className="w-4 h-4" /> Fix the Comma Splice
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xl md:text-2xl font-medium tracking-tight">
          <div className="bg-white px-5 py-3 rounded-2xl border border-neutral-200 shadow-sm">
            The experiment was successful
          </div>

          <div className="flex items-center gap-1">
            <span className="text-3xl font-bold translate-y-1">,</span>
            <AnimatePresence mode="popLayout">
              {!fixed ? (
                <motion.button
                  key="broken"
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setFixed(true)}
                  className="ml-2 bg-[#FFF4F4] border-2 border-dashed border-[#FF3B30] text-[#FF3B30] text-[15px] px-4 py-2 rounded-xl hover:bg-[#ffeaea] transition-colors"
                >
                  Add FANBOYS
                </motion.button>
              ) : (
                <motion.div
                  key="fixed"
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-2 bg-neutral-900 text-white text-[18px] px-5 py-2 rounded-xl shadow-md"
                >
                  and
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl border border-neutral-200 shadow-sm">
            the researchers published the results.
          </div>
        </div>
      </div>

      <motion.div
        layout
        className={cn(
          "px-8 py-6 flex items-center justify-between border-t transition-colors duration-500",
          fixed
            ? "bg-[#F2FBF5] border-[#D6F0E0]"
            : "bg-[#FFF4F4] border-[#FCE4E4]",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors",
              fixed ? "bg-[#34C759] text-white" : "bg-[#FF3B30] text-white",
            )}
          >
            {fixed ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </div>
          <div>
            <h3
              className={cn(
                "text-[16px] font-semibold transition-colors",
                fixed ? "text-[#1B5E20]" : "text-[#B71C1C]",
              )}
            >
              {fixed ? "Correct Structure" : "Comma Splice (Trap)"}
            </h3>
            <p
              className={cn(
                "text-[14px] transition-colors",
                fixed ? "text-[#2E7D32]/80" : "text-[#C62828]/80",
              )}
            >
              {fixed
                ? "Complete , FANBOYS Complete"
                : "A comma alone cannot join two independent clauses."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- AI Prompt Component ---
function AIPromptBox() {
  const [copied, setCopied] = useState(false);
  const promptText = `I am studying for the SAT Digital Standard English Conventions section using the "Sentence Surgery" method. I want to practice recognizing independent vs. dependent clauses and sentence boundaries (semicolons, FANBOYS, colons). 

Give me 5 tricky SAT-style sentences, one at a time. For each:
1. Ask me to identify the core components (subject, verb).
2. Ask me if the clauses can stand alone.
3. Have me choose or fix the correct punctuation.

Do not give me the answers upfront. Guide me to discover the rule myself by removing pieces of the sentence until the grammar becomes visible.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-900 rounded-[32px] p-8 md:p-10 my-16 text-white shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-neutral-300" />
          </div>
          <div>
            <h3 className="text-xl font-medium">Continue with AI</h3>
            <p className="text-[14px] text-neutral-400">
              Paste this prompt into ChatGPT or Claude to practice.
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full text-[14px] font-semibold hover:bg-neutral-200 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? "Copied!" : "Copy Prompt"}
        </button>
      </div>

      <div className="bg-black/50 border border-white/10 rounded-2xl p-6 relative z-10">
        <p className="font-mono text-[13px] leading-relaxed text-neutral-300 whitespace-pre-wrap">
          {promptText}
        </p>
      </div>
    </div>
  );
}

// --- Main Layout ---
export default function InteractiveGrammarLesson() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-200/60 pt-24 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row gap-16 xl:gap-24">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-fit">
          <Link
            href="/lessons"
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors text-[14px] mb-12 font-medium"
          >
            <CornerUpLeft className="w-4 h-4" /> Back to Curriculum
          </Link>

          <nav className="flex flex-col gap-1 text-[14px]">
            <span className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase mb-3 ml-3">
              Standard English
            </span>
            <a
              href="#lesson-01"
              className="px-3 py-2 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors"
            >
              01. Meet the Sentence
            </a>
            <a
              href="#lesson-02"
              className="px-3 py-2 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors"
            >
              02. Complete or Not?
            </a>
            <a
              href="#lesson-03"
              className="px-3 py-2 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors"
            >
              03. The Semicolon
            </a>
            <a
              href="#lesson-04"
              className="px-3 py-2 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors"
            >
              04. Period vs. Semicolon
            </a>
            <a
              href="#lesson-05"
              className="px-3 py-2 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors"
            >
              05. Comma + FANBOYS
            </a>
          </nav>
        </aside>

        {/* Main Content Area */}
        <motion.main
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
          className="flex-1 max-w-[720px]"
        >
          {/* Header */}
          <motion.header variants={fadeUp} className="mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Grammar isn't something you memorize.{" "}
              <br className="hidden md:block" />
              <span className="text-neutral-400">
                It's something you can see.
              </span>
            </h1>
            <p className="text-[17px] leading-relaxed text-neutral-500 max-w-xl">
              The SAT's grammar questions become much easier when you stop
              asking "Which answer sounds right?" and start asking "What is
              happening inside this sentence?"
            </p>
          </motion.header>

          <motion.hr variants={fadeUp} className="border-neutral-100 mb-16" />

          {/* Lesson 01 */}
          <motion.section
            variants={fadeUp}
            id="lesson-01"
            className="mb-24 scroll-mt-32"
          >
            <div className="mb-6">
              <span className="text-[13px] font-bold text-neutral-400 tracking-widest uppercase">
                Lesson 01
              </span>
              <h2 className="text-2xl font-semibold mt-2">Meet the Sentence</h2>
            </div>
            <p className="text-[16px] leading-relaxed text-neutral-600 mb-8">
              A sentence is made of pieces. Tap each piece below to remove it.
              You'll notice that some pieces destroy the sentence when removed,
              while others just remove details.
            </p>
            <SentenceSurgery />
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
              <h4 className="text-[15px] font-semibold mb-2">The Big Idea</h4>
              <p className="text-[15px] text-neutral-600 leading-relaxed">
                The SAT tests whether you can recognize which pieces are{" "}
                <strong className="text-neutral-900 font-medium">
                  essential
                </strong>{" "}
                and which pieces are{" "}
                <strong className="text-neutral-900 font-medium">extra</strong>.
              </p>
            </div>
          </motion.section>

          {/* Lesson 02 */}
          <motion.section
            variants={fadeUp}
            id="lesson-02"
            className="mb-24 scroll-mt-32"
          >
            <div className="mb-6">
              <span className="text-[13px] font-bold text-neutral-400 tracking-widest uppercase">
                Lesson 02
              </span>
              <h2 className="text-2xl font-semibold mt-2">Complete or Not?</h2>
            </div>
            <p className="text-[16px] leading-relaxed text-neutral-600 mb-8">
              If a clause can stand alone, it's an Independent Clause. If it
              leaves you hanging, it's a Dependent Clause.
            </p>
            <StandAloneQuiz />
          </motion.section>

          {/* Lesson 03 */}
          <motion.section
            variants={fadeUp}
            id="lesson-03"
            className="mb-24 scroll-mt-32"
          >
            <div className="mb-6">
              <span className="text-[13px] font-bold text-neutral-400 tracking-widest uppercase">
                Lesson 03
              </span>
              <h2 className="text-2xl font-semibold mt-2">The Semicolon</h2>
            </div>
            <p className="text-[16px] leading-relaxed text-neutral-600 mb-8">
              Think of{" "}
              <code className="bg-neutral-100 px-2 py-1 rounded text-sm mx-1">
                ;
              </code>{" "}
              as a wall. It can only be placed between two entirely complete
              thoughts.
            </p>
            <SemicolonWall />
          </motion.section>

          {/* Lesson 04 */}
          <motion.section
            variants={fadeUp}
            id="lesson-04"
            className="mb-24 scroll-mt-32"
          >
            <div className="mb-6">
              <span className="text-[13px] font-bold text-neutral-400 tracking-widest uppercase">
                Lesson 04
              </span>
              <h2 className="text-2xl font-semibold mt-2">
                Period vs. Semicolon
              </h2>
            </div>
            <p className="text-[16px] leading-relaxed text-neutral-600 mb-8">
              They are structurally identical. If two multiple choice answers
              are exactly the same except one uses a period and one uses a
              semicolon, neither is the answer.
            </p>
            <PunctuationToggle />
          </motion.section>

          {/* Lesson 05 */}
          <motion.section
            variants={fadeUp}
            id="lesson-05"
            className="mb-12 scroll-mt-32"
          >
            <div className="mb-6">
              <span className="text-[13px] font-bold text-neutral-400 tracking-widest uppercase">
                Lesson 05
              </span>
              <h2 className="text-2xl font-semibold mt-2">Comma + FANBOYS</h2>
            </div>
            <p className="text-[16px] leading-relaxed text-neutral-600 mb-8">
              Two complete sentences want to become one. A comma alone is not
              strong enough—that creates a{" "}
              <strong className="text-neutral-900 font-medium">
                comma splice
              </strong>
              . You need a comma plus a FANBOYS word (For, And, Nor, But, Or,
              Yet, So).
            </p>
            <FanboysBuilder />
          </motion.section>

          {/* AI Prompt Extension */}
          <motion.section variants={fadeUp}>
            <AIPromptBox />
          </motion.section>
        </motion.main>
      </div>
    </div>
  );
}
