"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Apple-like buttery smooth easing curve
const customEase = [0.16, 1, 0.3, 1] as const;

// Reusable animation variants for consistent, staggered storytelling
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: customEase },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: customEase },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export function MoriPrepSections() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is Mori Prep actually free?",
      answer:
        "Completely. We are a non-profit educational initiative. No hidden fees, no trial periods. Just free.",
    },
    {
      question: "Why learn in Mongolian for an English test?",
      answer:
        "The test is in English, but understanding the core logic shouldn't be a translation exercise. We teach the strategy in your native language so it clicks instantly.",
    },
    {
      question: "Is the platform up to date?",
      answer:
        "Yes. Our question bank is strictly aligned with the current Digital SAT format for both Math and Reading & Writing.",
    },
    {
      question: "Do I need to download any software?",
      answer:
        "No. Mori Prep runs completely in your browser, optimized for both desktop and mobile devices so you can practice anywhere.",
    },
  ];

  return (
    <div className="bg-white font-sans text-neutral-900 selection:bg-neutral-200">
      {/* 1. SCHOOLS SECTION */}
      <section className="py-12 px-6 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: customEase }}
            className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-16"
          >
            {[
              { logo: "harvard.png" },
              { logo: "mit.avif" },
              { logo: "stanford.png" },
              { logo: "yale.avif" },
              { logo: "princeton.png" },
            ].map((school, index) => (
              <img
                key={index}
                src={`/${school.logo}`}
                alt="University Logo"
                className="h-8 md:h-10 w-auto object-contain grayscale opacity-50 hover:opacity-70 transition-opacity duration-300"
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. IMPACT & SPECS SECTION (Moved up to establish immediate value) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12   py-16 text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center"
            >
              <div className="text-[56px] md:text-7xl font-medium tracking-tight text-neutral-900 mb-2">
                0₮
              </div>
              <p className="text-neutral-500 text-lg font-medium">
                Total cost, forever.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center"
            >
              <div className="text-[56px] md:text-7xl font-medium tracking-tight text-neutral-900 mb-2">
                1st
              </div>
              <p className="text-neutral-500 text-lg font-medium">
                Native Mongolian platform.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center"
            >
              <div className="text-[56px] md:text-7xl font-medium tracking-tight text-neutral-900 mb-2">
                100%
              </div>
              <p className="text-neutral-500 text-lg font-medium">
                College Board alignment.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: customEase, delay: 0.3 }}
            className="mt-20 text-center px-4"
          >
            <blockquote className="text-3xl md:text-[40px] font-medium tracking-tight text-neutral-300 leading-[1.2] max-w-4xl mx-auto text-balance">
              "Your dream university shouldn't be locked behind a{" "}
              <span className="text-neutral-900">$2,000</span> prep course."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* 3. CORE FEATURES (Deep Dives) */}

      {/* Feature 01: Question Bank */}
      <section className="py-32 px-6 bg-[#fafafa] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              className="relative rounded-[2rem] bg-[#f5f5f7] p-6 md:p-8"
            >
              <img
                src="/home/image.png"
                alt="Question Bank Interface"
                className="w-full h-auto rounded-xl shadow-sm border border-black/5"
              />
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-md"
            >
              <motion.span
                variants={fadeInUp}
                className="text-2xl font-medium text-neutral-400 mb-4 block"
              >
                01.
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-balance"
              >
                The ultimate question bank.
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-neutral-500 leading-relaxed"
              >
                Practice with 4,000+ highly calibrated Digital SAT questions.
                Cover every Math and Reading & Writing topic, structured exactly
                like the real exam.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 02: Analytics */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-md lg:order-1 order-2"
            >
              <motion.span
                variants={fadeInUp}
                className="text-2xl font-medium text-neutral-400 mb-4 block"
              >
                02.
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-balance"
              >
                Know where you stand.
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-neutral-500 leading-relaxed mb-8"
              >
                Eliminate the guesswork. Track your progress dynamically and
                focus purely on what needs improvement.
              </motion.p>

              <motion.ul variants={staggerContainer} className="space-y-4">
                {[
                  "Track weekly activity trends",
                  "Analyze accuracy by specific topic",
                  "Monitor time spent by difficulty level",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    variants={fadeInUp}
                    className="flex items-center gap-4 text-lg text-neutral-600 font-medium"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              className="relative rounded-[2rem] bg-white p-6 md:p-8 shadow-sm border border-neutral-200/60 lg:order-2 order-1"
            >
              <img
                src="/home/analytics.png"
                alt="Analytics Interface"
                className="w-full h-auto rounded-xl shadow-sm"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 03: Predicted Tests */}
      <section className="py-32 px-6 bg-[#fafafa] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              className="relative rounded-[2rem] bg-[#f5f5f7] p-6 md:p-8"
            >
              <img
                src="/home/predicted-tests.png"
                alt="Predicted Tests Interface"
                className="w-full h-auto rounded-xl shadow-sm border border-black/5"
              />
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-md"
            >
              <motion.span
                variants={fadeInUp}
                className="text-2xl font-medium text-neutral-400 mb-4 block"
              >
                03.
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-balance"
              >
                Test day, everyday.
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-neutral-500 leading-relaxed"
              >
                Take full-length practice tests mathematically calibrated to
                match recent Digital SAT difficulty curves. Build stamina and
                confidence.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. ECOSYSTEM / TOOLS (The 3 Cards) */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center max-w-2xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-[36px] md:text-5xl font-medium tracking-tight mb-4 text-balance"
            >
              Built for a perfect score.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-neutral-500 text-lg md:text-xl leading-relaxed"
            >
              Everything you need to master the exam, unified in one beautiful
              interface.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Card 1 */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-[2rem] p-8 pb-10 flex flex-col shadow-sm border border-neutral-200/50"
            >
              <div className="flex-1 w-full flex items-center justify-center mb-8 pt-4">
                <img
                  src="/home/calendar.png"
                  alt="Study Planner"
                  className="w-[70%] h-auto object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-medium text-neutral-900">
                Smart Planner
              </h3>
              <p className="text-neutral-500 mt-2 text-sm leading-relaxed">
                Structure your study sessions with personalized daily goals.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-[2rem] p-8 pb-10 flex flex-col shadow-sm border border-neutral-200/50"
            >
              <div className="flex-1 w-full flex items-center justify-center mb-8 pt-4">
                <img
                  src="/home/files.png"
                  alt="Resource Library"
                  className="w-[70%] h-auto object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-medium text-neutral-900">
                Concept Library
              </h3>
              <p className="text-neutral-500 mt-2 text-sm leading-relaxed">
                Access in-depth native Mongolian explanations for complex
                topics.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-[2rem] p-8 pb-10 flex flex-col shadow-sm border border-neutral-200/50"
            >
              <div className="flex-1 w-full flex items-center justify-center mb-8 pt-4">
                <img
                  src="/home/browser.png"
                  alt="Test Environment"
                  className="w-[70%] h-auto object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-medium text-neutral-900">
                Exam Simulator
              </h3>
              <p className="text-neutral-500 mt-2 text-sm leading-relaxed">
                Practice in an environment identical to the Bluebook app.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. PRIVACY SECTION */}
      <section className="py-32 px-6 bg-neutral-900 overflow-hidden relative flex items-center justify-center">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-2xl mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-[36px] md:text-5xl font-medium tracking-tight text-white mb-6 text-balance"
            >
              Focused on your growth. <br /> Not your data.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-[#a3a3a3] text-lg md:text-xl leading-relaxed"
            >
              Your learning data is private and secure. We don't sell your
              information. We only use it to power your analytics and help you
              improve your score.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="w-full max-w-4xl"
          >
            <img
              src="/home/private-ui.png"
              alt="Private Analytics UI"
              className="w-full h-auto object-contain rounded-[2rem] border border-white/10"
            />
          </motion.div>
        </div>
      </section>

      {/* 6. FAQ SECTION (Matching the requested design) */}
      <section className="py-32 px-6 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: customEase }}
              className="w-full lg:w-[40%]"
            >
              <h2 className="text-[32px] md:text-[40px] font-medium tracking-tight text-neutral-900 leading-tight">
                Frequently Asked <br className="hidden lg:block" /> Questions
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.1 }}
              className="w-full lg:w-[60%] flex flex-col"
            >
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-neutral-200/80 last:border-0"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full py-6 flex justify-between items-center text-left hover:opacity-70 transition-opacity"
                  >
                    <span className="text-[16px] md:text-[18px] font-medium text-neutral-900 pr-8">
                      {faq.question}
                    </span>
                    <span className="text-neutral-400 text-2xl font-light transform transition-transform duration-300">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-400 ease-[0.16,1,0.3,1] ${
                      openFaq === index
                        ? "max-h-40 opacity-100 pb-6"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-neutral-500 text-[16px] leading-relaxed pr-12">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
