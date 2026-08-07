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

interface GoalScoreProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const MIN_SCORE = 400;
const MAX_SCORE = 1600;
const DEFAULT_SCORE = 1200;

export function GoalScore({
  data,
  updateData,
  onNext,
  onBack,
}: GoalScoreProps) {
  const [goalScore, setGoalScore] = useState(
    data.goalScore?.toString() || DEFAULT_SCORE.toString(),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    updateData({ goalScore: parseInt(goalScore) });
    onNext();
  };

  const handleBarClick = (score: number) => {
    setGoalScore(score.toString());
    updateData({ goalScore: score });
    // Don't auto-advance, let user click Next button
  };

  // Handle Enter key to advance
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && goalScore) {
      handleNext();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setGoalScore("");
      return;
    }
    const num = parseInt(value);
    if (num >= MIN_SCORE && num <= MAX_SCORE && num % 10 === 0) {
      setGoalScore(value);
      updateData({ goalScore: num });
    }
  };

  const getBarWidth = (score: number) => {
    // Calculate position for 25 bars evenly distributed
    // 400 is at 0%, 1600 is at 96% (with 4% width each)
    const segmentIndex = (score - MIN_SCORE) / 50;
    return (segmentIndex / 25) * 100;
  };

  const isSelected = (score: number) => {
    return parseInt(goalScore) === score;
  };

  // Generate 50-point increments from 400 to 1600
  const scoreIncrements = Array.from(
    { length: 25 },
    (_, i) => MIN_SCORE + i * 50,
  );

  const numBars = scoreIncrements.length; // 25 bars (400, 450, ..., 1600)

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
        What's your target SAT score?
      </h1>
      <p className="text-neutral-500 mb-12 max-w-lg mx-auto">
        An estimate works great if you're not sure yet. Click a bar to select
        your goal, or type it in below.{" "}
        <span className="text-neutral-400">(400–1600)</span>
      </p>

      {/* Bar Chart */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative h-16 bg-neutral-100 rounded-lg overflow-hidden">
          {/* Score bars - 50-point increments */}
          {scoreIncrements.map((score) => (
            <motion.button
              key={score}
              onClick={() => handleBarClick(score)}
              className={`absolute top-0 bottom-0 transition-colors duration-200 ${
                isSelected(score)
                  ? "bg-neutral-900"
                  : "bg-neutral-200 hover:bg-neutral-300"
              }`}
              style={{
                left: `${getBarWidth(score)}%`,
                width: `${100 / 25}%`,
              }}
            />
          ))}
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between mt-2 text-xs text-neutral-400">
          <span>Min</span>
          <span>400</span>
          <span>Max</span>
          <span>1600</span>
        </div>
      </div>

      {/* Goal Input */}
      <div className="max-w-xs mx-auto mb-12">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Your goal
        </label>
        <input
          ref={inputRef}
          autoFocus
          type="number"
          min={MIN_SCORE}
          max={MAX_SCORE}
          value={goalScore}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors text-center text-2xl font-medium"
        />
      </div>
    </motion.div>
  );
}
