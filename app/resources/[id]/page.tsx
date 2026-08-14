"use client";

import clsx from "clsx";
import LessonNavbar from "components/Heading/lesson-navbar";
import { BounceSidebar } from "components/ui/bounce-sidebar";
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
import { useEffect, useState } from "react";
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

// --- Lesson Data ---
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

// --- Interactive Components ---

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
    <div className="bg-neutral-50 border border-neutral-200/60 rounded-[32px] overflow-hidden shadow-sm my-10 not-prose">
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
                "text-[16px] font-semibold transition-colors m-0",
                isComplete ? "text-[#1B5E20]" : "text-[#B71C1C]",
              )}
            >
              {isComplete ? "Complete Sentence" : "Broken"}
            </h3>
            <p
              className={cn(
                "text-[14px] transition-colors m-0 mt-1",
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

function StandAloneQuiz() {
  const [answered, setAnswered] = useState(false);

  return (
    <div className="bg-white border border-neutral-200 rounded-[32px] p-8 md:p-10 my-10 shadow-sm relative overflow-hidden not-prose">
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
          <p className="text-[15px] text-[#C62828]/80 max-w-md mx-auto m-0">
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

function SemicolonWall() {
  const [hasSemicolon, setHasSemicolon] = useState(false);

  return (
    <div className="bg-neutral-50 border border-neutral-200/60 rounded-[32px] p-8 md:p-10 my-10 shadow-sm relative text-center not-prose">
      <p className="text-[14px] font-medium text-neutral-500 uppercase tracking-wider mb-8 text-left flex items-center gap-2">
        <MousePointer2 className="w-4 h-4" /> Tap the gap to build the wall
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xl md:text-2xl font-medium tracking-tight">
        <div className="bg-white px-6 py-4 rounded-2xl border border-neutral-200 shadow-sm relative w-full md:w-auto">
          The experiment was successful
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-[#34C759] font-bold tracking-widest uppercase">
            Complete
          </span>
        </div>

        <button
          onClick={() => setHasSemicolon(!hasSemicolon)}
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center text-4xl pb-2 transition-all duration-300 shrink-0 my-4 md:my-0",
            hasSemicolon
              ? "bg-neutral-900 text-white shadow-md scale-100"
              : "bg-neutral-200/50 text-transparent hover:bg-neutral-200 border-2 border-dashed border-neutral-300 scale-95",
          )}
        >
          {hasSemicolon ? ";" : "+"}
        </button>

        <div className="bg-white px-6 py-4 rounded-2xl border border-neutral-200 shadow-sm relative w-full md:w-auto">
          the researchers published the results
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-[#34C759] font-bold tracking-widest uppercase">
            Complete
          </span>
        </div>
      </div>

      <div className="mt-14 h-12">
        <AnimatePresence>
          {hasSemicolon && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="inline-block bg-[#F2FBF5] border border-[#D6F0E0] text-[#1B5E20] px-6 py-3 rounded-full text-[14px] font-medium"
            >
              Correct! Complete ; Complete
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PunctuationToggle() {
  const [isSemicolon, setIsSemicolon] = useState(false);

  return (
    <div className="bg-white border border-neutral-200 rounded-[32px] p-8 md:p-10 my-10 shadow-sm relative text-center not-prose">
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

function FanboysBuilder() {
  const [fixed, setFixed] = useState(false);

  return (
    <div className="bg-neutral-50 border border-neutral-200/60 rounded-[32px] overflow-hidden shadow-sm my-10 not-prose">
      <div className="p-8 md:p-10 relative text-center md:text-left">
        <p className="text-[14px] font-medium text-neutral-500 uppercase tracking-wider mb-8 flex items-center justify-center md:justify-start gap-2">
          <MousePointer2 className="w-4 h-4" /> Fix the Comma Splice
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xl md:text-2xl font-medium tracking-tight">
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
          "px-8 py-6 flex flex-col md:flex-row items-center justify-between border-t transition-colors duration-500",
          fixed
            ? "bg-[#F2FBF5] border-[#D6F0E0]"
            : "bg-[#FFF4F4] border-[#FCE4E4]",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors shrink-0",
              fixed ? "bg-[#34C759] text-white" : "bg-[#FF3B30] text-white",
            )}
          >
            {fixed ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </div>
          <div className="text-center md:text-left">
            <h3
              className={cn(
                "text-[16px] font-semibold transition-colors m-0",
                fixed ? "text-[#1B5E20]" : "text-[#B71C1C]",
              )}
            >
              {fixed ? "Correct Structure" : "Comma Splice (Trap)"}
            </h3>
            <p
              className={cn(
                "text-[14px] transition-colors m-0 mt-1",
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
    <div className="bg-neutral-900 rounded-[32px] p-8 md:p-10 my-16 text-white shadow-xl relative overflow-hidden not-prose">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-neutral-300" />
          </div>
          <div>
            <h3 className="text-xl font-medium m-0">Continue with AI</h3>
            <p className="text-[14px] text-neutral-400 m-0 mt-1">
              Paste this prompt into ChatGPT to practice.
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
        <p className="font-mono text-[13px] leading-relaxed text-neutral-300 whitespace-pre-wrap m-0">
          {promptText}
        </p>
      </div>
    </div>
  );
}

// --- Main Blog Layout ---

export default function LaunchBlogLayout() {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { label: "Meet the Sentence", id: "lesson-01" },
    { label: "Complete vs. Incomplete", id: "lesson-02" },
    { label: "The Semicolon Wall", id: "lesson-03" },
    { label: "Period vs. Semicolon", id: "lesson-04" },
    { label: "Fixing Comma Splices", id: "lesson-05" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <LessonNavbar />
      <div className="min-h-screen bg-white text-[#0D0D0D] font-sans selection:bg-neutral-200/60 pb-32">
        {/* Header Section */}
        <header className="max-w-[1000px] mx-auto px-6 pt-24 text-center">
          <p className="text-[14px] font-medium text-neutral-500 mb-6 flex items-center justify-center gap-4">
            <span>August 8, 2026</span>{" "}
            <span className="text-neutral-300">|</span> <span>Product</span>
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-medium tracking-tight mb-6 leading-[1.1] max-w-4xl mx-auto">
            Interactive Grammar:
            <br className="hidden md:block" /> It's Something You Can See
          </h1>
          <p className="text-[17px] text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Rolling out to U.S. students, you can visually break down sentences
            to master grammar rules, understand clauses, and improve your
            writing.
          </p>
        </header>

        {/* Hero Image Block */}
        <div className="max-w-[1200px] mx-auto px-6 mt-16 mb-20">
          <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-neutral-100 rounded-[24px] overflow-hidden relative shadow-sm border border-neutral-200/60">
            <img
              src="/api/placeholder/1200/500"
              alt="Interactive Grammar App Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Main Content & Sidebar */}
        <main className="max-w-[1000px] mx-auto px-6 flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
          {/* Sticky Sidebar Nav */}
          <aside className="hidden lg:block w-[220px] shrink-0">
            <div className="sticky top-24">
              <Link
                href="/resources"
                className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors text-[13px] mb-10 font-medium"
              >
                <CornerUpLeft className="w-4 h-4" /> Back to Curriculum
              </Link>

              <BounceSidebar
                value={activeSection}
                items={[
                  { label: "Meet the Sentence", href: "#lesson-01" },
                  { label: "Complete vs. Incomplete", href: "#lesson-02" },
                  { label: "The Semicolon Wall", href: "#lesson-03" },
                  { label: "Period vs. Semicolon", href: "#lesson-04" },
                  { label: "Fixing Comma Splices", href: "#lesson-05" },
                ]}
                dotColor="#0084FF"
              />
            </div>
          </aside>

          {/* Article Body with Embedded Components */}
          <div className="flex-1 max-w-[640px]">
            {/* Audio Player Bar */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-10">
              <button className="flex items-center gap-4 text-[15px] font-medium text-neutral-900 hover:opacity-70 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                Listen to article
                <span className="text-neutral-500 font-normal ml-2">9:43</span>
              </button>
              <button className="flex items-center gap-2 text-[14px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Share
              </button>
            </div>

            <article className="prose prose-neutral prose-lg max-w-none prose-p:leading-[1.7] prose-p:text-[#333] prose-headings:font-medium prose-headings:tracking-tight">
              <p>
                Interactive Grammar in ChatGPT is launching to U.S. students.
                You can choose to visually dismantle sentences so ChatGPT can
                help you understand your grammatical gaps in context, keep track
                of tricky SAT rules, and have more informed, personalized study
                sessions.
              </p>

              <p>
                Every week, millions of students turn to ChatGPT with grammar
                and writing questions—from understanding dependent clauses and
                preparing for the SAT to making sense of comma splices. But the
                context behind those rules is often lost in text blocks. Grammar
                isn't something you memorize. It's something you can see.
              </p>

              <section id="lesson-01" className="scroll-mt-32 pt-10">
                <h3 className="text-2xl mb-4">Meet the Sentence</h3>
                <p>
                  A sentence is made of pieces. Tap each piece below to remove
                  it. You'll notice that some pieces destroy the sentence when
                  removed, while others just remove details. The SAT tests
                  whether you can recognize which pieces are essential and which
                  are extra.
                </p>
                <SentenceSurgery />
              </section>

              <section id="lesson-02" className="scroll-mt-32 pt-10">
                <h3 className="text-2xl mb-4">Complete or Not?</h3>
                <p>
                  If a clause can stand alone, it's an Independent Clause. If it
                  leaves you hanging, it's a Dependent Clause.
                </p>
                <StandAloneQuiz />
              </section>

              <section id="lesson-03" className="scroll-mt-32 pt-10">
                <h3 className="text-2xl mb-4">The Semicolon</h3>
                <p>
                  Punctuation acts as the architecture of your sentence. Think
                  of a semicolon as a structural wall. It can only be placed
                  between two entirely complete thoughts. Try building the wall
                  below.
                </p>
                <SemicolonWall />
              </section>

              <section id="lesson-04" className="scroll-mt-32 pt-10">
                <h3 className="text-2xl mb-4">Period vs. Semicolon</h3>
                <p>
                  They are structurally identical. If two multiple-choice
                  answers on the SAT are exactly the same except one uses a
                  period and one uses a semicolon, neither is the answer. They
                  create the exact same boundaries.
                </p>
                <PunctuationToggle />
              </section>

              <section id="lesson-05" className="scroll-mt-32 pt-10">
                <h3 className="text-2xl mb-4">Comma + FANBOYS</h3>
                <p>
                  Two complete sentences want to become one. A comma alone is
                  not strong enough—that creates a comma splice. You need a
                  comma plus a FANBOYS word (For, And, Nor, But, Or, Yet, So).
                </p>
                <FanboysBuilder />
              </section>

              <div className="mt-16 mb-6">
                <h3 className="text-2xl mb-6">What early users are saying</h3>

                <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 not-prose">
                  {[
                    "SAT Student",
                    "High School Junior",
                    "Grammar Geek",
                    "College Freshman",
                    "Parent",
                  ].map((tag, i) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-4 py-2 rounded-full text-[14px] transition-colors cursor-pointer whitespace-nowrap",
                        i === 0
                          ? "bg-neutral-100 text-neutral-900 font-medium"
                          : "text-neutral-500 hover:text-neutral-900 font-medium border border-transparent hover:border-neutral-200",
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="bg-neutral-50 rounded-[24px] p-8 md:p-10 mb-12 border border-neutral-100 not-prose">
                  <p className="text-[17px] leading-[1.6] text-neutral-800 m-0">
                    "The visual breakdown of the sentence structure, like
                    Sentence Surgery, helped me see exactly where my grammar
                    gaps were. I finally understand dependent clauses and stop
                    relying on what 'sounds right' on the SAT."
                  </p>
                </div>
              </div>

              <AIPromptBox />
            </article>

            {/* Footer Tags Box */}
            <div className="mt-16 bg-neutral-50 rounded-[24px] p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-neutral-100">
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-neutral-200/60 hover:bg-neutral-200 rounded-full text-[13px] font-medium text-neutral-700 cursor-pointer transition-colors">
                  ChatGPT
                </span>
                <span className="px-4 py-2 bg-neutral-200/60 hover:bg-neutral-200 rounded-full text-[13px] font-medium text-neutral-700 cursor-pointer transition-colors">
                  2026
                </span>
                <span className="px-4 py-2 bg-neutral-200/60 hover:bg-neutral-200 rounded-full text-[13px] font-medium text-neutral-700 cursor-pointer transition-colors">
                  Grammar Lesson
                </span>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[13px] text-neutral-500 mb-1">Author</p>
                <p className="text-[14px] font-medium text-neutral-900">
                  OpenAI
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
