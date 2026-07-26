"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: customEase },
  },
};

export function DsatSection() {
  return (
    <section className="py-24 px-4 sm:px-6 md:px-12 bg-white overflow-hidden text-neutral-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[1280px] mx-auto"
      >
        {/* Top Header Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-12">
          {/* Left: Heading & Button */}
          <div>
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-neutral-900 mb-6"
            >
              Never stay stuck <br className="hidden sm:inline" />
              on a question
            </motion.h2>
            <motion.div variants={itemVariants}>
              <Link
                href="/dsat"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-neutral-900 text-white font-medium text-base hover:bg-neutral-800 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                Open App
              </Link>
            </motion.div>
          </div>

          {/* Right: Description Text */}
          <motion.div variants={itemVariants} className="lg:pt-2">
            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-lg">
              4,000+ human-written Digital SAT questions, each with a
              step-by-step walkthrough and instant follow-up help when something
              doesn't click.
            </p>
          </motion.div>
        </div>

        {/* Outer App UI Frame */}
        <motion.div variants={itemVariants} className="w-full">
          {/* App Switcher Tabs */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-neutral-100/90 text-neutral-900 text-sm font-semibold border border-neutral-200/80 shadow-xs">
              <svg
                className="w-4 h-4 text-neutral-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Reading & Writing</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-neutral-500 text-sm font-medium hover:text-neutral-900 transition-colors cursor-pointer">
              <span className="font-serif italic font-semibold text-base">
                f(x)
              </span>
              <span>Maths</span>
            </div>
          </div>

          {/* Main Mock DSAT Container */}
          <div className="relative bg-[#f6f6f8] rounded-3xl border border-neutral-200/90 p-4 sm:p-6 shadow-sm overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-6 relative">
              {/* Left Column: Digital SAT Interface */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between overflow-hidden">
                {/* DSAT Bar Header */}
                <div className="border-b border-neutral-200/70 px-6 py-3 flex items-center justify-between text-xs sm:text-sm text-neutral-600 bg-neutral-50/50">
                  <div className="flex items-center gap-1.5 font-medium cursor-pointer hover:text-neutral-900">
                    <span>Directions</span>
                    <svg
                      className="w-3.5 h-3.5 opacity-60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Timer */}
                  <div className="flex items-center gap-2 font-semibold text-neutral-900">
                    <span>05:15</span>
                    <button className="flex items-center gap-1 text-[11px] font-normal px-2 py-0.5 rounded-md border border-neutral-300 bg-white hover:bg-neutral-50">
                      <span className="text-[9px]">❚❚</span> Hide
                    </button>
                  </div>

                  {/* Tools */}
                  <div className="flex items-center gap-1 font-medium cursor-pointer hover:text-neutral-900">
                    <svg
                      className="w-3.5 h-3.5 text-neutral-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Highlight</span>
                  </div>
                </div>

                {/* Split Question Content (Passage | Question) */}
                <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200/80 p-6 gap-6 min-h-[460px]">
                  {/* Passage Side (Serif text for authentic Bluebook feel) */}
                  <div className="space-y-4 text-xs sm:text-sm font-serif text-neutral-800 leading-relaxed pr-1">
                    <div>
                      <h4 className="font-sans font-bold text-neutral-900 text-xs mb-1">
                        Text 1
                      </h4>
                      <p>
                        The film <em>Saturday Night Fever</em> draws much of its
                        inspiration from the music of a single band—the Bee
                        Gees. Songs by this 1970s disco group animate key
                        moments in the film. For example, in the iconic opening
                        scene, actor John Travolta walks down a city street as
                        the Bee Gees classic "Stayin' Alive" pulses in the
                        background. Music by the Bee Gees is so integral to{" "}
                        <em>Saturday Night Fever</em> that some viewers{" "}
                        <mark className="bg-yellow-200/90 text-neutral-900 px-0.5 rounded-xs">
                          assume (incorrectly) that characters in this drama
                          sing along to Bee Gees songs.
                        </mark>
                      </p>
                    </div>

                    <div>
                      <h4 className="font-sans font-bold text-neutral-900 text-xs mb-1">
                        Text 2
                      </h4>
                      <p>
                        <em>Saturday Night Fever</em> is{" "}
                        <mark className="bg-sky-200/90 text-neutral-900 px-0.5 rounded-xs">
                          not in any way a musical, even though the songs of a
                          single band, the Bee Gees, can be heard prominently
                          throughout the film.
                        </mark>{" "}
                        To be classified as a musical, the film would require
                        characters who sing along to the songs themselves.
                        Instead, the music of the Bee Gees provides more of a
                        "soundtrack" to adventures of characters who never
                        actually sing.
                      </p>
                    </div>
                  </div>

                  {/* Question & Options Side */}
                  <div className="space-y-5 pl-1 sm:pl-4 font-sans">
                    {/* Header: Question Number & Mark for Review */}
                    <div className="flex items-center justify-between text-xs font-medium">
                      <div className="w-6 h-6 rounded bg-neutral-900 text-white flex items-center justify-center font-semibold text-xs">
                        1
                      </div>
                      <button className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span>Mark for Review</span>
                      </button>
                    </div>

                    {/* Question Prompt */}
                    <p className="text-xs sm:text-sm font-semibold text-neutral-900 leading-snug">
                      Based on the texts, how would the author of Text 2 respond
                      to the underlined portion of Text 1?
                    </p>

                    {/* Choices */}
                    <div className="space-y-2.5 text-xs sm:text-[13px]">
                      {/* Choice A - Wrong Selected State */}
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-red-300 bg-red-50/70 text-red-900 font-medium">
                        <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          ✕
                        </span>
                        <span className="leading-snug">
                          By explaining that both singing and movement are
                          important to Saturday Night Fever
                        </span>
                      </div>

                      {/* Choice B */}
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 transition-colors cursor-pointer">
                        <span className="w-5 h-5 rounded-full border border-neutral-400 text-neutral-700 flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5">
                          B
                        </span>
                        <span className="leading-snug">
                          By noting that bands other than the Bee Gees
                          contributed songs to Saturday Night Fever
                        </span>
                      </div>

                      {/* Choice C */}
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 transition-colors cursor-pointer">
                        <span className="w-5 h-5 rounded-full border border-neutral-400 text-neutral-700 flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5">
                          C
                        </span>
                        <span className="leading-snug">
                          By questioning the status of Saturday Night Fever as a
                          classic film
                        </span>
                      </div>

                      {/* Choice D - Correct State */}
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-emerald-400 bg-emerald-50/70 text-emerald-950 font-medium">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="leading-snug">
                          By asserting that characters in Saturday Night Fever
                          definitely do not sing along to songs by the Bee Gees
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom App Footer Bar */}
                <div className="border-t border-neutral-200/70 px-6 py-2.5 flex items-center justify-between text-xs text-neutral-600 bg-neutral-50/50">
                  <div className="flex items-center gap-1 cursor-pointer font-medium hover:text-neutral-900">
                    <span>1 of 57</span>
                    <svg
                      className="w-3.5 h-3.5 opacity-60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-semibold text-[11px] border border-sky-200 hover:bg-sky-200 transition-colors">
                    <svg
                      className="w-3 h-3 text-sky-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    Ask Preppy
                  </button>
                </div>
              </div>

              {/* Right Column: Ask Preppy Floating AI Window Overlay */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-neutral-200 shadow-xl p-4 flex flex-col justify-between font-sans text-xs text-neutral-700 relative z-10 my-auto">
                {/* Preppy Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-sm">
                    <svg
                      className="w-4 h-4 text-neutral-800"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <span>Ask Preppy</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium cursor-pointer">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span>Explanation</span>
                  </div>
                </div>

                {/* Conversation Content */}
                <div className="space-y-3 leading-relaxed max-h-[380px] overflow-y-auto pr-1">
                  {/* User Question Bubble */}
                  <div className="bg-sky-100/80 text-sky-950 p-2.5 rounded-2xl rounded-tr-xs text-xs font-medium">
                    Can you walk me through this and guide me to the solution?
                  </div>

                  {/* AI Response Walkthrough */}
                  <p className="text-neutral-600">
                    Let's use the prompt and answer choices to rule out options
                    that do not match what the question is asking.
                  </p>

                  <div className="inline-block bg-yellow-200/90 text-neutral-900 font-semibold px-1.5 py-0.5 rounded text-[11px]">
                    "the key detail in the prompt"
                  </div>
                  <p className="text-neutral-600">
                    This is the part of the prompt that controls what the answer
                    must address.
                  </p>

                  <div className="inline-block bg-sky-200/90 text-neutral-900 font-semibold px-1.5 py-0.5 rounded text-[11px]">
                    "the matching evidence in the question"
                  </div>
                  <p className="text-neutral-600">
                    Compare that detail against each answer choice before
                    selecting.
                  </p>

                  {/* Choice B Analysis Box */}
                  <div className="bg-red-50/80 border border-red-200 rounded-xl p-2 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                      B
                    </span>
                    <span className="text-[11px] text-red-900 font-medium leading-tight">
                      By noting that bands other than the Bee Gees contributed
                      songs to Saturday Night Fever
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    This choice does not match the key claim in the prompt.
                  </p>

                  {/* Choice C Analysis Box */}
                  <div className="bg-red-50/80 border border-red-200 rounded-xl p-2 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                      C
                    </span>
                    <span className="text-[11px] text-red-900 font-medium leading-tight">
                      By questioning the status of Saturday Night Fever as a
                      classic film
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px]">
                    This option misses the specific relationship the question
                    asks about.
                  </p>

                  <p className="text-neutral-700 font-medium">
                    That leaves D - the choice that best matches the question.
                  </p>
                </div>

                {/* Ask Input Bar */}
                <div className="mt-4 pt-2">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Ask a question..."
                      className="w-full bg-neutral-100 text-neutral-800 placeholder-neutral-400 text-xs rounded-full py-2.5 pl-3.5 pr-9 focus:outline-none focus:ring-1 focus:ring-neutral-300"
                      readOnly
                    />
                    <button className="absolute right-1.5 w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
