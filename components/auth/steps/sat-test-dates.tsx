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
    const newDates = selectedDates.includes(date)
      ? selectedDates.filter((d) => d !== date)
      : [...selectedDates, date];
    setSelectedDates(newDates);
    updateData({ satTestDates: newDates });
    // Don't auto-advance, let user click Next button
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCustomDate = e.target.value;
    setCustomDate(newCustomDate);
    // Only add custom date if it has a value
    if (newCustomDate) {
      const allDates = [...selectedDates, newCustomDate];
      updateData({ satTestDates: allDates });
    } else {
      updateData({ satTestDates: selectedDates });
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
            <span className="text-base font-medium text-neutral-900 group-hover:text-neutral-700 underline">
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
            onChange={handleCustomDateChange}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
          />
        </div>
      )}
    </motion.div>
  );
}
