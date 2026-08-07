"use client";

import { motion, Variants } from "framer-motion";
import NextImage from "next/image";
import Link from "next/link";
import { useState } from "react";
import BillowLandingSection from "./billow-landing-section";
import GlassFeaturesSection from "./glass-features-section";

const customEase = [0.16, 1, 0.3, 1] as const;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

function PricingSection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 md:p-12 font-sans antialiased text-gray-900 overflow-hidden">
      <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center py-12">
        {/* Left Content */}
        <div className="flex flex-col space-y-5 md:space-y-6 text-center lg:text-left items-center lg:items-start">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
            Completely Free
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-medium tracking-tight leading-[1.15] text-[#111]">
            Premium prep.
            <br />
            Zero cost. Forever.
          </h1>

          <p className="text-gray-500 text-[15px] sm:text-base max-w-sm leading-relaxed">
            Access our complete DSAT preparation platform with no hidden fees,
            no subscriptions, and no catch.
          </p>

          <div className="flex items-center gap-3 pt-4">
            <div className="h-[1px] w-8 bg-gray-200 hidden lg:block"></div>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.1em] uppercase text-teal-800 bg-[#e0f4f0] px-2 py-0.5 rounded-sm">
              Non-profit · Educational initiative
            </span>
          </div>
        </div>

        {/* Right Content - Pricing Card */}
        <div className="relative rounded-[2rem] p-6 sm:p-8 md:p-10 bg-gradient-to-br from-[#faf7f2] via-[#f7ebe4] to-[#f3b5b7] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/40 hover:shadow-[0_24px_48px_-15px_rgba(0,0,0,0.08)] transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <span className="font-medium text-[16px] sm:text-[17px] text-gray-800">
              Free Forever
            </span>
            <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase border border-gray-200/60 bg-white/40 px-3 py-1 rounded-full">
              Full Access
            </span>
          </div>

          <div className="flex items-baseline gap-1 mb-4 text-gray-400">
            <span className="text-2xl sm:text-3xl font-medium self-start mt-2">
              MNT
            </span>
            <span className="text-6xl sm:text-7xl font-medium tracking-tight text-gray-500">
              0
            </span>
            <span className="text-base sm:text-lg ml-2 font-medium">
              forever
            </span>
          </div>
          <p className="text-gray-600 text-[13px] mb-8 sm:mb-10 leading-relaxed">
            Your dream university shouldn't be locked behind a $2,000 prep
            course.
          </p>

          <ul className="space-y-4 mb-8 sm:mb-10">
            <li className="flex items-center gap-3 text-[14px] sm:text-[15px] text-gray-600">
              <svg
                className="w-[18px] h-[18px] shrink-0 text-gray-400 stroke-[1.5]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Native Mongolian platform.
            </li>
            <li className="flex items-center gap-3 text-[14px] sm:text-[15px] text-gray-600">
              <svg
                className="w-[18px] h-[18px] shrink-0 text-gray-400 stroke-[1.5]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              100% College Board alignment.
            </li>
          </ul>

          <Link
            href="/practice"
            className="w-full bg-black text-white text-[14px] sm:text-[15px] font-medium rounded-full py-3.5 sm:py-4 transition-transform hover:scale-[1.01] active:scale-[0.97] flex items-center justify-center duration-100"
          >
            Start practicing free
          </Link>
        </div>
      </div>
    </div>
  );
}

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
      {/* 1. IMPACT & SPECS SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: customEase }}
            className="text-center px-2"
          >
            <p className="font-gochi-hand text-lg md:text-xl text-neutral-400 mb-4 tracking-wide">
              our mission
            </p>
            <blockquote className="text-3xl sm:text-4xl md:text-[48px] font-medium tracking-tight text-neutral-600 leading-[1.2] max-w-5xl mx-auto text-balance">
              We built{" "}
              <NextImage
                src="/home/horse.png"
                alt="Horse"
                width={539}
                height={463}
                className="inline-block h-[1.2em] w-auto object-contain align-middle mx-1"
              />
              <span className="font-eb-garamond font-light text-[1.4em] tracking-tighter text-[#0061c9]">
                mori
              </span>{" "}
              <span className="tracking-tighter">Prep</span> because{" "}
              <br className="hidden md:block" />
              we are against the{" "}
              <span className="inline-block bg-neutral-100/40 backdrop-blur-md border border-neutral-200/60 shadow-sm rounded-xl px-4 md:px-5 py-1 md:py-1.5 whitespace-nowrap text-neutral-700 mx-1">
                <span className="text-neutral-400">nepo</span> privilege
              </span>
              .
            </blockquote>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 py-12 md:py-16 text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center"
            >
              <div className="text-[48px] sm:text-[56px] md:text-7xl font-medium tracking-tight text-neutral-900 mb-0.5 md:mb-1">
                0₮
              </div>
              <p className="text-neutral-500 text-base md:text-lg font-medium">
                Total cost, forever.
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center"
            >
              <div className="text-[48px] sm:text-[56px] md:text-7xl font-medium tracking-tight text-neutral-900 mb-0.5 md:mb-1">
                1st
              </div>
              <p className="text-neutral-500 text-base md:text-lg font-medium">
                Native Mongolian platform.
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center"
            >
              <div className="text-[48px] sm:text-[56px] md:text-7xl font-medium tracking-tight text-neutral-900 mb-0.5 md:mb-1">
                100%
              </div>
              <p className="text-neutral-500 text-base md:text-lg font-medium">
                College Board alignment.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Glass Features Section */}
      <GlassFeaturesSection />

      {/* Billow Landing Section */}
      <BillowLandingSection />

      {/* 2. PRICING SECTION */}
      <PricingSection />

      {/* 3. ECOSYSTEM / TOOLS */}
      <section className="py-20 md:py-32 px-4 sm:px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mb-12 md:mb-16 text-center max-w-2xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-[36px] font-medium tracking-tight mb-3 md:mb-4 text-balance"
            >
              Built for a perfect score.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-neutral-500 text-[15px] md:text-lg leading-relaxed"
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
              whileHover={{
                y: -4,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="bg-white rounded-[2rem] p-6 md:p-8 pb-8 md:pb-10 flex flex-col shadow-sm border border-neutral-200/50 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 w-full flex items-center justify-center mb-6 md:mb-8 pt-4">
                <img
                  src="/home/calendar.png"
                  alt="Study Planner"
                  className="w-[60%] sm:w-[70%] h-auto object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                Smart Planner
              </h3>
              <p className="text-neutral-500 mt-2 text-[14px] leading-relaxed">
                Structure your study sessions with personalized daily goals.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{
                y: -4,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="bg-white rounded-[2rem] p-6 md:p-8 pb-8 md:pb-10 flex flex-col shadow-sm border border-neutral-200/50 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 w-full flex items-center justify-center mb-6 md:mb-8 pt-4">
                <img
                  src="/home/files.png"
                  alt="Resource Library"
                  className="w-[60%] sm:w-[70%] h-auto object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                Concept Library
              </h3>
              <p className="text-neutral-500 mt-2 text-[14px] leading-relaxed">
                Access in-depth native Mongolian explanations for complex
                topics.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeInUp}
              whileHover={{
                y: -4,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="bg-white rounded-[2rem] p-6 md:p-8 pb-8 md:pb-10 flex flex-col shadow-sm border border-neutral-200/50 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 w-full flex items-center justify-center mb-6 md:mb-8 pt-4">
                <img
                  src="/home/browser.png"
                  alt="Test Environment"
                  className="w-[60%] sm:w-[70%] h-auto object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                Exam Simulator
              </h3>
              <p className="text-neutral-500 mt-2 text-[14px] leading-relaxed">
                Practice in an environment identical to the Bluebook app.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. PRIVACY SECTION */}
      <section className="py-24 md:py-32 px-4 sm:px-6 bg-neutral-900 overflow-hidden relative flex items-center justify-center">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="max-w-2xl mb-12 md:mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-[36px] font-medium tracking-tight text-white mb-4 md:mb-6 text-balance"
            >
              Focused on your growth. <br /> Not your data.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-[#a3a3a3] text-[15px] md:text-lg leading-relaxed px-4"
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
            className="w-full max-w-4xl px-2"
          >
            <img
              src="/home/private-ui.png"
              alt="Private Analytics UI"
              className="w-full h-auto object-contain rounded-2xl md:rounded-[2rem] border border-white/10"
            />
          </motion.div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-24 md:py-32 px-4 sm:px-6 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: customEase }}
              className="w-full lg:w-[40%] text-center lg:text-left"
            >
              <h2 className="text-3xl md:text-[36px] font-medium tracking-tight text-neutral-900 leading-tight">
                Frequently Asked <br className="hidden lg:block" />
                <span className="relative inline-block z-10 text-[32px] md:text-[43px]">
                  Questions
                  <img
                    src="/home/sketch.svg"
                    alt="Underline decoration"
                    className="absolute left-0 top-[65%] -scale-x-100 -scale-y-80 w-full h-auto pointer-events-none -z-10"
                  />
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
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
                    className="w-full py-5 md:py-6 flex justify-between items-center text-left hover:opacity-70 transition-opacity active:scale-[0.98] duration-100"
                  >
                    <span className="text-[15px] md:text-[18px] font-medium text-neutral-900 pr-6 md:pr-8">
                      {faq.question}
                    </span>
                    <span className="text-neutral-400 text-xl md:text-2xl font-light transform transition-transform duration-300">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1] ${
                      openFaq === index
                        ? "max-h-60 opacity-100 pb-5 md:pb-6"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-neutral-500 text-[14px] md:text-[16px] leading-relaxed pr-8 md:pr-12">
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
