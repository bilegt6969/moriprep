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

interface BestSatScoreSectionProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BestSatScoreSection({
  data,
  updateData,
  onNext,
  onBack,
}: BestSatScoreSectionProps) {
  const [rwScore, setRwScore] = useState(data.bestRwScore?.toString() || "");
  const [mathScore, setMathScore] = useState(
    data.bestMathScore?.toString() || "",
  );
  const [rwError, setRwError] = useState("");
  const [mathError, setMathError] = useState("");
  const rwInputRef = useRef<HTMLInputElement>(null);
  const mathInputRef = useRef<HTMLInputElement>(null);

  const validateScore = (value: string): { valid: boolean; error: string } => {
    if (!value) return { valid: true, error: "" };

    const num = parseInt(value);

    if (isNaN(num)) {
      return { valid: false, error: "Please enter a valid number" };
    }

    if (num < 200 || num > 800) {
      return { valid: false, error: "Score must be between 200 and 800" };
    }

    if (num % 10 !== 0) {
      return { valid: false, error: "Score must be in increments of 10" };
    }

    return { valid: true, error: "" };
  };

  const handleRwChange = (value: string) => {
    setRwScore(value);
    const validation = validateScore(value);
    setRwError(validation.error);
  };

  const handleMathChange = (value: string) => {
    setMathScore(value);
    const validation = validateScore(value);
    setMathError(validation.error);
  };

  const handleNext = () => {
    const rwValidation = validateScore(rwScore);
    const mathValidation = validateScore(mathScore);

    setRwError(rwValidation.error);
    setMathError(mathValidation.error);

    if (!rwValidation.valid || !mathValidation.valid) {
      return;
    }

    updateData({
      bestRwScore: rwScore ? parseInt(rwScore) : undefined,
      bestMathScore: mathScore ? parseInt(mathScore) : undefined,
    });
    onNext();
  };

  const handleSkip = () => {
    updateData({ bestRwScore: undefined, bestMathScore: undefined });
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
        Enter your best SAT score to date
      </h1>
      <p className="text-neutral-500 mb-8 max-w-lg mx-auto">
        Official scores and full practice tests both count. Skip if you have not
        tested yet. We still tailor your plan.
      </p>

      <div className="max-w-md mx-auto space-y-6 mb-8">
        <div className="text-left">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Reading & Writing
          </label>
          <div className="flex items-center gap-2">
            <input
              ref={rwInputRef}
              autoFocus
              type="number"
              min="200"
              max="800"
              step="10"
              value={rwScore}
              onChange={(e) => handleRwChange(e.target.value)}
              placeholder="200 – 800"
              className={`flex-1 px-4 py-3 rounded-xl border transition-colors focus:outline-none ${
                rwError
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : "border-neutral-200 focus:border-neutral-400"
              }`}
            />
          </div>
          {rwError && <p className="text-xs text-red-600 mt-1">{rwError}</p>}
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Math
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="200"
              max="800"
              step="10"
              value={mathScore}
              onChange={(e) => handleMathChange(e.target.value)}
              placeholder="200 – 800"
              className={`flex-1 px-4 py-3 rounded-xl border transition-colors focus:outline-none ${
                mathError
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : "border-neutral-200 focus:border-neutral-400"
              }`}
            />
          </div>
          {mathError && (
            <p className="text-xs text-red-600 mt-1">{mathError}</p>
          )}
        </div>

        <p className="text-xs text-neutral-400">
          Each section: 200–800, in multiples of 10
        </p>
      </div>

      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={handleSkip}
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          I don't know my section scores
        </button>
        <button
          onClick={handleSkip}
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          I don't have a score yet
        </button>
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <button
          onClick={onBack}
          className="px-8 py-3.5 rounded-full border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 active:scale-[0.98]"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3.5 rounded-full bg-neutral-900 text-white font-medium hover:bg-black transition-all duration-200 active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
