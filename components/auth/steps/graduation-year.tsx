"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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

interface GraduationYearProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const years = ["2026", "2027", "2028", "2029", "2030", "2031"];

export function GraduationYear({
  data,
  updateData,
  onNext,
  onBack,
}: GraduationYearProps) {
  const [showYearInput, setShowYearInput] = useState(false);
  const [gradYear, setGradYear] = useState("");

  const handleSelect = (year: string) => {
    updateData({ graduationYear: year });
    setShowYearInput(false);
    setGradYear("");
  };

  const handleGraduatedSelect = () => {
    setShowYearInput(true);
    updateData({ graduationYear: "I've graduated" });
  };

  const handleYearChange = (year: string) => {
    setGradYear(year);
    updateData({ graduationYear: `I've graduated - ${year}` });
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-12">
        What year are you graduating? <span className="text-red-500">*</span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-6">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleSelect(year)}
            className={`p-4 rounded-xl border transition-all duration-200 text-left group ${
              data.graduationYear === year
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <span
              className={`text-base font-medium underline ${
                data.graduationYear === year
                  ? "text-neutral-900"
                  : "text-neutral-900 group-hover:text-neutral-700"
              }`}
            >
              {year}
            </span>
          </button>
        ))}
        <button
          onClick={handleGraduatedSelect}
          className={`p-4 rounded-xl border transition-all duration-200 text-left group ${
            data.graduationYear?.startsWith("I've graduated")
              ? "border-neutral-900 bg-neutral-50"
              : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
          }`}
        >
          <span
            className={`text-base font-medium underline ${
              data.graduationYear?.startsWith("I've graduated")
                ? "text-neutral-900"
                : "text-neutral-900 group-hover:text-neutral-700"
            }`}
          >
            I've graduated
          </span>
        </button>
      </div>

      {showYearInput && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xs mx-auto"
        >
          <label className="block text-sm font-medium text-neutral-700 mb-2 text-left">
            What year did you graduate?
          </label>
          <input
            type="number"
            min="2000"
            max="2030"
            value={gradYear}
            onChange={(e) => handleYearChange(e.target.value)}
            placeholder="e.g., 2024"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
