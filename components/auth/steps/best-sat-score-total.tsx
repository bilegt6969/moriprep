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

interface BestSatScoreTotalProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BestSatScoreTotal({
  data,
  updateData,
  onNext,
  onBack,
}: BestSatScoreTotalProps) {
  const [totalScore, setTotalScore] = useState(
    data.bestTotalScore?.toString() || "",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    updateData({
      bestTotalScore: totalScore ? parseInt(totalScore) : undefined,
    });
    onNext();
  };

  const handleSkip = () => {
    updateData({ bestTotalScore: undefined });
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

      <div className="max-w-md mx-auto mb-8">
        <div className="text-left">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Total score
          </label>
          <input
            ref={inputRef}
            autoFocus
            type="number"
            min="400"
            max="1600"
            step="10"
            value={totalScore}
            onChange={(e) => setTotalScore(e.target.value)}
            placeholder="Enter recent score"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
          />
          <p className="text-xs text-neutral-400 mt-2">Between 400 and 1600</p>
        </div>
      </div>

      <button
        onClick={handleSkip}
        className="text-sm text-neutral-500 hover:text-neutral-700 mb-8"
      >
        I don't have a score yet
      </button>

      <div className="flex gap-4 justify-center">
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
