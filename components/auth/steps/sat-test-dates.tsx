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

interface SatTestDatesProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const testDates = [
  "August 22, 2026",
  "September 12, 2026",
  "October 3, 2026",
  "November 7, 2026",
  "December 5, 2026",
  "March 6, 2027",
  "May 1, 2027",
  "June 5, 2027",
];

export function SatTestDates({
  data,
  updateData,
  onNext,
  onBack,
}: SatTestDatesProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>(
    data.satTestDates || [],
  );
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const customDateRef = useRef<HTMLInputElement>(null);

  const toggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date],
    );
  };

  const handleNext = () => {
    const allDates = [...selectedDates];
    if (customDate) {
      allDates.push(customDate);
    }
    updateData({ satTestDates: allDates });
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
        When are you taking the SAT?
      </h1>
      <p className="text-neutral-500 mb-8">
        Select all dates you're considering
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-6">
        {testDates.map((date) => (
          <button
            key={date}
            onClick={() => toggleDate(date)}
            className={`p-4 rounded-xl border transition-all duration-200 text-left group ${
              selectedDates.includes(date)
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <span className="text-base font-medium text-neutral-900 group-hover:text-neutral-700">
              {date}
            </span>
          </button>
        ))}
      </div>

      {!showCustomDate ? (
        <button
          onClick={() => setShowCustomDate(true)}
          className="text-neutral-600 hover:text-neutral-900 mb-8 text-sm"
        >
          Or choose a custom date
        </button>
      ) : (
        <div className="max-w-md mx-auto mb-8">
          <input
            ref={customDateRef}
            autoFocus
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
          />
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          className="px-8 py-3.5 rounded-full border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 active:scale-[0.98]"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={selectedDates.length === 0 && !customDate}
          className="px-8 py-3.5 rounded-full bg-neutral-900 text-white font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
