"use client";

import { motion } from "framer-motion";
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

interface SchoolSatStudentsProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const options = [
  "1–10 students",
  "11–25 students",
  "26–50 students",
  "51–100 students",
  "101–250 students",
  "250+ students",
  "I don't know",
];

export function SchoolSatStudents({
  data,
  updateData,
  onNext,
  onBack,
}: SchoolSatStudentsProps) {
  const handleSelect = (option: string) => {
    updateData({ schoolSatStudents: option });
    // Don't auto-advance, let user click Next button
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-12">
        How many students are taking the SAT at your school?
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`p-4 rounded-xl border transition-all duration-200 text-left group ${
              data.schoolSatStudents === option
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <span
              className={`text-base font-medium underline ${
                data.schoolSatStudents === option
                  ? "text-neutral-900"
                  : "text-neutral-900 group-hover:text-neutral-700"
              }`}
            >
              {option}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
