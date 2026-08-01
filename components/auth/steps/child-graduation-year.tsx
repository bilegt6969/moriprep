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

interface ChildGraduationYearProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const years = [
  "Class of 2026",
  "Class of 2027",
  "Class of 2028",
  "Class of 2029",
  "Class of 2030",
  "Class of 2031",
  "Other",
];

export function ChildGraduationYear({
  data,
  updateData,
  onNext,
  onBack,
}: ChildGraduationYearProps) {
  const handleSelect = (year: string) => {
    updateData({ childGraduationYear: year });
    onNext();
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-12">
        What's your child's graduation year?
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleSelect(year)}
            className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-200 text-left group"
          >
            <span className="text-base font-medium text-neutral-900 group-hover:text-neutral-700">
              {year}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={onBack}
          className="px-8 py-3.5 rounded-full border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 active:scale-[0.98]"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
}
