"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { OnboardingData } from "../onboarding-flow";

const customEase = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

interface SchoolSearchProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SchoolSearch({
  data,
  updateData,
  onNext,
  onBack,
}: SchoolSearchProps) {
  const [searchTerm, setSearchTerm] = useState(data.school || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    updateData({ school: searchTerm });
    onNext();
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
        Search for your school
      </h1>
      <p className="text-neutral-500 mb-8">
        This helps us personalize your experience based on your school.
      </p>

      <div className="max-w-md mx-auto mb-8">
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type your school name..."
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
        />
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          className="px-8 py-3.5 rounded-full border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 active:scale-[0.98]"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!searchTerm}
          className="px-8 py-3.5 rounded-full bg-neutral-900 text-white font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
