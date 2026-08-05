"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import GlassFeaturesSection from "./glass-features-section";

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

function PricingSection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 md:p-12 font-sans antialiased text-gray-900">
      <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        {/* Left Content */}
        <div className="flex flex-col space-y-6">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
            Completely Free
          </span>

          <h1 className="text-4xl md:text-[3.25rem] font-medium tracking-tight leading-[1.1] text-[#111]">
            Premium prep.
            <br />
            Zero cost. Forever.
          </h1>

          <p className="text-gray-500 text-[15px] max-w-sm leading-relaxed">
            Access our complete DSAT preparation platform with no hidden fees,
            no subscriptions, and no catch.
          </p>

          <div className="flex items-center gap-3 pt-4">
            <div className="h-[1px] w-8 bg-gray-200"></div>
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-teal-800 bg-[#e0f4f0] px-2 py-0.5">
              Non-profit · Educational initiative
            </span>
          </div>
        </div>

        {/* Right Content - Pricing Card */}
        <div className="relative rounded-[32px] p-8 md:p-10 bg-gradient-to-br from-[#faf7f2] via-[#f7ebe4] to-[#f3b5b7] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/40">
          {/* Card Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-medium text-[17px] text-gray-800">
              Free Forever
            </span>
            <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase border border-gray-200/60 bg-white/40 px-3 py-1 rounded-full">
              Full Access
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-4 text-gray-400">
            <span className="text-3xl font-medium self-start mt-2">MNT</span>
            <span className="text-7xl font-medium tracking-tight text-gray-500">
              0
            </span>
            <span className="text-lg ml-2 font-medium">forever</span>
          </div>
          <p className="text-gray-600 text-[13px] mb-10 leading-relaxed">
            Your dream university shouldn't be locked behind a $2,000 prep
            course.
          </p>

          {/* Features List */}
          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3 text-[15px] text-gray-600">
              <svg
                className="w-[18px] h-[18px] text-gray-400 stroke-[1.5]"
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

            <li className="flex items-center gap-3 text-[15px] text-gray-600">
              <svg
                className="w-[18px] h-[18px] text-gray-400 stroke-[1.5]"
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

          {/* Action Button */}
          <button className="w-full bg-black text-white text-[15px] font-medium rounded-full py-4 transition-transform hover:scale-[1.01] active:scale-100 flex items-center justify-center">
            Start practicing free
          </button>
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll 30s linear infinite;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `,
        }}
      />
      {/* 1. SCHOOLS SECTION */}
      <section className="py-16 px-6 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          {/* Subheading added here */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: customEase }}
            className="text-[11px] font-gochi-hand md:text-xs font-medium tracking-tight text-neutral-400  text-center mb-10"
          >
            We've helped our students get into
          </motion.p>

          {/* Logo Slider Container */}
          <div className="w-full relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: customEase, delay: 0.1 }}
              className="relative"
            >
              {/* Left frosted glass fade */}
              <div
                className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-r from-white via-white/80 to-transparent backdrop-blur-[6px]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, black, transparent)",
                  maskImage: "linear-gradient(to right, black, transparent)",
                }}
              />
              {/* Right frosted glass fade */}
              <div
                className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white via-white/80 to-transparent backdrop-blur-[6px]"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to left, black, transparent)",
                  maskImage: "linear-gradient(to left, black, transparent)",
                }}
              />

              {/* Scrolling container */}
              <div className="flex items-center gap-x-12 md:gap-x-16 animate-scroll">
                {[
                  { logo: "harvard.png", url: "https://www.harvard.edu" },
                  { logo: "mit.avif", url: "https://www.mit.edu" },
                  { logo: "stanford.png", url: "https://www.stanford.edu" },
                  { logo: "yale.avif", url: "https://www.yale.edu" },
                  { logo: "princeton.png", url: "https://www.princeton.edu" },
                  { logo: "1.png", url: "https://www.columbia.edu" },
                  { logo: "2.png", url: "https://www.uchicago.edu" },
                  { logo: "3.png", url: "https://www.duke.edu" },
                  { logo: "4.png", url: "https://www.upenn.edu" },
                  { logo: "5.png", url: "https://www.caltech.edu" },
                  { logo: "6.png", url: "https://www.jhu.edu" },
                  { logo: "7.png", url: "https://www.northwestern.edu" },
                  { logo: "8.png", url: "https://www.brown.edu" },
                  { logo: "9.png", url: "https://www.cornell.edu" },
                ].map((school, index) => (
                  <a
                    key={index}
                    href={school.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <img
                      src={`/schools/${school.logo}`}
                      alt="University Logo"
                      className="h-8 md:h-10 w-auto object-contain grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer"
                    />
                  </a>
                ))}
                {/* Duplicate for seamless loop */}
                {[
                  { logo: "harvard.png", url: "https://www.harvard.edu" },
                  { logo: "mit.avif", url: "https://www.mit.edu" },
                  { logo: "stanford.png", url: "https://www.stanford.edu" },
                  { logo: "yale.avif", url: "https://www.yale.edu" },
                  { logo: "princeton.png", url: "https://www.princeton.edu" },
                  { logo: "1.png", url: "https://www.columbia.edu" },
                  { logo: "2.png", url: "https://www.uchicago.edu" },
                  { logo: "3.png", url: "https://www.duke.edu" },
                  { logo: "4.png", url: "https://www.upenn.edu" },
                  { logo: "5.png", url: "https://www.caltech.edu" },
                  { logo: "6.png", url: "https://www.jhu.edu" },
                  { logo: "7.png", url: "https://www.northwestern.edu" },
                  { logo: "8.png", url: "https://www.brown.edu" },
                  { logo: "9.png", url: "https://www.cornell.edu" },
                ].map((school, index) => (
                  <a
                    key={`duplicate-${index}`}
                    href={school.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <img
                      src={`/schools/${school.logo}`}
                      alt="University Logo"
                      className="h-8 md:h-10 w-auto object-contain grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer"
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT & SPECS SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: customEase, delay: 0.1 }}
            className="text-center px-4"
          >
            <blockquote className="text-3xl md:text-[40px] font-medium tracking-tight text-neutral-300 leading-[1.2] max-w-4xl mx-auto text-balance">
              "Your dream university shouldn't be locked behind a{" "}
              <span className="text-neutral-900">$2,000</span> prep course."
            </blockquote>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delayChildren: 0.3 }}
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
        </div>
      </section>

      {/* Glass Features Section */}
      <GlassFeaturesSection />

      {/* 4. PRICING SECTION */}
      <PricingSection />

      {/* 5. ECOSYSTEM / TOOLS */}
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
              className="text-[28px] md:text-[36px] font-medium tracking-tight mb-4 text-balance"
            >
              Built for a perfect score.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-neutral-500 text-base md:text-lg leading-relaxed"
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
              <h3 className="text-lg font-medium text-neutral-900">
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
              <h3 className="text-lg font-medium text-neutral-900">
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
              <h3 className="text-lg font-medium text-neutral-900">
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
              className="text-[28px] md:text-[36px] font-medium tracking-tight text-white mb-6 text-balance"
            >
              Focused on your growth. <br /> Not your data.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-[#a3a3a3] text-base md:text-lg leading-relaxed"
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

      {/* 6. FAQ SECTION */}
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
              <h2 className="text-[28px] md:text-[36px] font-medium tracking-tight text-neutral-900 leading-tight">
                Frequently Asked <br className="hidden lg:block" />
                <span className="relative inline-block z-10 text-[34px] md:text-[43px]">
                  Questionss
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
