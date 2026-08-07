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

  // Call handleNext when Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm) {
      handleNext();
    }
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

      <div className="max-w-md mx-auto">
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your school name..."
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
        />
      </div>
    </motion.div>
  );
}
