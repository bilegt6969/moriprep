"use client";

import { useState } from "react";

export function Faq() {
  const faqs = [
    {
      question: "Is Mori Prep really 100% free?",
      answer:
        "Yes, absolutely. Mori Prep is a non-profit open education initiative under Bytecode. There are zero subscriptions, paywalls, or hidden fees. We believe quality Digital SAT prep should be accessible to every student in Mongolia regardless of financial background.",
    },
    {
      question: "Are practice questions aligned with the official Digital SAT?",
      answer:
        "Yes. Mori Prep is the pioneer platform in Mongolia to integrate the complete College Board DSAT Question Bank. All questions mirror official exam timing, domain classifications, and multi-stage adaptive module structures.",
    },
    {
      question: "What study materials are included on the platform?",
      answer:
        "You get complete access to thousands of official College Board questions, step-by-step Reading, Writing, and Math strategy lessons, downloadable formula cheat sheets, and curated prep books directly from your dashboard.",
    },
    {
      question: "Do I need to pay anything, ever?",
      answer:
        "No. Mori Prep is 100% free, permanently — no subscriptions, no paywalls, no hidden fees.",
    },
  ];

  return (
    <section className="px-4 py-16 md:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-12 pt-[6.5rem] pb-[5.75rem]">
          {/* Header Section */}
          <div>
            <h1 className="font-sans text-[44px] font-medium leading-[48px] tracking-[-1.35px] text-[#121212]">
              Frequently
              <br />
              Asked Questions
            </h1>
          </div>

          {/* Accordion Section */}
          <div className="flex flex-col items-start pt-4">
            <div className="w-full">
              {faqs.map((faq, index) => (
                <FaqItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>

            {/* See More Link */}
            <a
              href="/faqs"
              className="group -mx-3 mt-2 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[17px] font-medium tracking-[-0.44px] text-[#FF5310] transition-colors duration-200 hover:bg-[#FF5310]/10"
            >
              See More FAQs
              <svg
                width="18"
                height="15"
                viewBox="0 0 18 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.94417 0.373474L17.2534 7.49997L9.94417 14.6265L8.7225 13.3735L13.8492 8.37497H0L0 6.62497L13.8492 6.62497L8.7225 1.62647L9.94417 0.373474Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-7 flex w-full items-start justify-start gap-6 border-b border-[#f2f0ed] pb-7">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative mt-1.5 h-[14px] w-[14px] flex-shrink-0 text-[#121212] transition-colors hover:text-[#747484]"
        aria-expanded={isOpen}
      >
        {/* Horizontal Line (Minus) */}
        <div className="absolute left-0 top-[6px] h-[2px] w-[14px] rounded-sm bg-current" />
        {/* Vertical Line (Plus) - Rotates and scales out when open */}
        <div
          className={`absolute left-[6px] top-0 h-[14px] w-[2px] rounded-sm bg-current transition-transform duration-300 ease-out ${
            isOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"
          }`}
        />
      </button>

      <div className="flex-1">
        <h4 className="font-sans text-lg font-medium text-[#121212]">
          {question}
        </h4>
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p
              className="mt-3 text-[16px] leading-[1.6] text-[#494440]"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
