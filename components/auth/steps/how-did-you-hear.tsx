"use client";

import { motion } from "framer-motion";
import { OnboardingData } from "../onboarding-flow";

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition,
  },
};

interface HowDidYouHearProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const sources = [
  {
    name: "Teacher",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    name: "Tutor",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    name: "Friend / Family",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    name: "Google Search",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12h.01M15 12h.01" />
        <path d="M7.5 4.27A19.8 19.8 0 0 1 12 4c1.55 0 3.06.2 4.5.57A19.7 19.7 0 0 1 20.27 8c.64 3.75.25 7.62-1.12 11.23-.97 1.15-2.4 1.77-3.9 1.77H8.75c-1.5 0-2.93-.62-3.9-1.77C3.48 15.62 3.09 11.75 3.73 8 5.16 5.86 6.2 4.93 7.5 4.27Z" />
      </svg>
    ),
  },
];

export function HowDidYouHear({
  data,
  updateData,
  onNext,
  onBack,
}: HowDidYouHearProps) {
  const handleSelect = (sourceName: string) => {
    updateData({ howDidYouHear: sourceName });
    // Don't auto-advance, let user click Next button
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-center w-full max-w-2xl mx-auto px-4"
    >
      <h1 className="text-4xl md:text-[44px] font-light tracking-tight text-neutral-900 mb-3 font-eb-garamond leading-tight">
        How did you hear about us?
      </h1>
      <p className="text-neutral-500 font-light text-[17px] mb-12">
        We'd love to know where you first discovered Mori Prep.
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto"
      >
        {sources.map((source) => {
          const isSelected = data.howDidYouHear === source.name;

          return (
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              key={source.name}
              type="button"
              onClick={() => handleSelect(source.name)}
              className={`relative p-5 rounded-[20px] border transition-all duration-300 text-left group flex items-center justify-between outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 overflow-hidden ${
                isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-[0_8px_20px_rgb(0,0,0,0.12)]"
                  : "border-neutral-200/70 bg-white text-neutral-900 hover:border-neutral-300 hover:bg-[#FAFAFA] hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                    isSelected
                      ? "bg-white/10 text-white"
                      : "bg-neutral-50 text-neutral-500 group-hover:bg-neutral-100 group-hover:text-neutral-900"
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {source.icon}
                  </div>
                </div>
                <span className="text-[16px] font-medium tracking-tight underline">
                  {source.name}
                </span>
              </div>

              {/* Minimal Animated Checkmark Indicator */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                  isSelected
                    ? "bg-white text-neutral-900 scale-100 opacity-100"
                    : "bg-transparent border border-neutral-200 scale-95 opacity-50 group-hover:border-neutral-300 group-hover:scale-100 group-hover:opacity-100"
                }`}
              >
                {isSelected && (
                  <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={springTransition}
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-3.5 h-3.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
