"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";

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

export function MoriPrepSections() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  interface FAQ {
    question: string;
    answer: string;
  }

  const faqs: FAQ[] = [
    {
      question: "Is Mori Prep completely free?",
      answer:
        "Yes, 100% free forever. We're a non-profit educational initiative with no hidden fees, no subscriptions, and no catch.",
    },
    {
      question: "How does the native Mongolian platform help?",
      answer:
        "We teach DSAT strategy in your native language so complex concepts click instantly. The test is in English, but understanding the logic shouldn't be a translation exercise.",
    },
    {
      question: "Is the content aligned with the real Digital SAT?",
      answer:
        "Absolutely. Our question bank is strictly aligned with the current Digital SAT format for both Math and Reading & Writing sections.",
    },
    {
      question: "Can I practice on any device?",
      answer:
        "Yes. Mori Prep runs completely in your browser, optimized for both desktop and mobile devices so you can practice anywhere, anytime.",
    },
  ];

  return (
    <div className="bg-white font-sans text-neutral-900 selection:bg-neutral-200">
      {/* 4. ADDITIONAL FEATURES SECTION */}
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
              You're in control
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-neutral-500 text-[15px] md:text-lg leading-relaxed"
            >
              Design your learning experience. Customize your learning paths and
              practice sessions to match your goals, and share tailored links
              for every subject.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "Global learning",
                desc: "Learn in 136 countries with full global educational support built in.",
              },
              {
                title: "Multi-currency",
                desc: "Access content in 85+ languages with automatic translation.",
              },
              {
                title: "Progress tracking",
                desc: "Get exclusive features and perks as your learning progresses.",
              },
              {
                title: "Quality assurance",
                desc: "Advanced accuracy monitoring and quality control, built right in.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  y: -4,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                className="bg-white rounded-[2rem] p-6 md:p-8 flex flex-col shadow-sm border border-neutral-200/50 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-[14px] leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. PRIVACY SECTION */}
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
              Made with Mori Prep
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-[#a3a3a3] text-[15px] md:text-lg leading-relaxed px-4"
            >
              Built to look good. Built to learn.
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

      {/* 6. FAQ SECTION */}
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
