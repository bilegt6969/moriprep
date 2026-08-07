"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

const testMonths = [
  { value: "march", label: "March (Spring)" },
  { value: "may", label: "May (Spring)" },
  { value: "june", label: "June (Early Summer)" },
  { value: "august", label: "August (Late Summer)" },
  { value: "october", label: "October (Fall)" },
  { value: "november", label: "November (Fall)" },
  { value: "december", label: "December (Winter)" },
];

const years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

export function BestSatScoreSection({
  data,
  updateData,
  onNext,
  onBack,
}: BestSatScoreSectionProps) {
  const [rwScore, setRwScore] = useState(data.bestRwScore?.toString() || "");
  const [rwMonth, setRwMonth] = useState("");
  const [rwYear, setRwYear] = useState("");
  const [mathScore, setMathScore] = useState(
    data.bestMathScore?.toString() || "",
  );
  const [mathMonth, setMathMonth] = useState("");
  const [mathYear, setMathYear] = useState("");
  const [rwError, setRwError] = useState("");
  const [mathError, setMathError] = useState("");
  const rwInputRef = useRef<HTMLInputElement>(null);
  const mathInputRef = useRef<HTMLInputElement>(null);

  // Parse existing dates if they exist (only on initial load)
  useEffect(() => {
    if (data.bestRwDate && !rwMonth && !rwYear) {
      const parts = data.bestRwDate.split(" ");
      if (parts.length >= 2) {
        setRwMonth(parts[0] || "");
        setRwYear(parts[1] || "");
      }
    }
    if (data.bestMathDate && !mathMonth && !mathYear) {
      const parts = data.bestMathDate.split(" ");
      if (parts.length >= 2) {
        setMathMonth(parts[0] || "");
        setMathYear(parts[1] || "");
      }
    }
  }, []);

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
    // Update data on change for global Next button validation
    if (validation.valid) {
      const rwDateStr = rwMonth && rwYear ? `${rwMonth} ${rwYear}` : "";
      const mathDateStr =
        mathMonth && mathYear ? `${mathMonth} ${mathYear}` : "";
      updateData({
        bestRwScore: value ? parseInt(value) : undefined,
        bestRwDate: rwDateStr,
        bestMathScore: mathScore ? parseInt(mathScore) : undefined,
        bestMathDate: mathDateStr,
      });
    }
  };

  const handleRwMonthChange = (value: string) => {
    setRwMonth(value);
    const rwDateStr = value && rwYear ? `${value} ${rwYear}` : "";
    const mathDateStr = mathMonth && mathYear ? `${mathMonth} ${mathYear}` : "";
    updateData({
      bestRwScore: rwScore ? parseInt(rwScore) : undefined,
      bestRwDate: rwDateStr,
      bestMathScore: mathScore ? parseInt(mathScore) : undefined,
      bestMathDate: mathDateStr,
    });
  };

  const handleRwYearChange = (value: string) => {
    setRwYear(value);
    const rwDateStr = rwMonth && value ? `${rwMonth} ${value}` : "";
    const mathDateStr = mathMonth && mathYear ? `${mathMonth} ${mathYear}` : "";
    updateData({
      bestRwScore: rwScore ? parseInt(rwScore) : undefined,
      bestRwDate: rwDateStr,
      bestMathScore: mathScore ? parseInt(mathScore) : undefined,
      bestMathDate: mathDateStr,
    });
  };

  const handleMathChange = (value: string) => {
    setMathScore(value);
    const validation = validateScore(value);
    setMathError(validation.error);
    // Update data on change for global Next button validation
    if (validation.valid) {
      const rwDateStr = rwMonth && rwYear ? `${rwMonth} ${rwYear}` : "";
      const mathDateStr =
        mathMonth && mathYear ? `${mathMonth} ${mathYear}` : "";
      updateData({
        bestRwScore: rwScore ? parseInt(rwScore) : undefined,
        bestRwDate: rwDateStr,
        bestMathScore: value ? parseInt(value) : undefined,
        bestMathDate: mathDateStr,
      });
    }
  };

  const handleMathMonthChange = (value: string) => {
    setMathMonth(value);
    const rwDateStr = rwMonth && rwYear ? `${rwMonth} ${rwYear}` : "";
    const mathDateStr = value && mathYear ? `${value} ${mathYear}` : "";
    updateData({
      bestRwScore: rwScore ? parseInt(rwScore) : undefined,
      bestRwDate: rwDateStr,
      bestMathScore: mathScore ? parseInt(mathScore) : undefined,
      bestMathDate: mathDateStr,
    });
  };

  const handleMathYearChange = (value: string) => {
    setMathYear(value);
    const rwDateStr = rwMonth && rwYear ? `${rwMonth} ${rwYear}` : "";
    const mathDateStr = mathMonth && value ? `${mathMonth} ${value}` : "";
    updateData({
      bestRwScore: rwScore ? parseInt(rwScore) : undefined,
      bestRwDate: rwDateStr,
      bestMathScore: mathScore ? parseInt(mathScore) : undefined,
      bestMathDate: mathDateStr,
    });
  };

  const handleNext = () => {
    const rwValidation = validateScore(rwScore);
    const mathValidation = validateScore(mathScore);

    setRwError(rwValidation.error);
    setMathError(mathValidation.error);

    if (!rwValidation.valid || !mathValidation.valid) {
      return;
    }

    const rwDateStr = rwMonth && rwYear ? `${rwMonth} ${rwYear}` : "";
    const mathDateStr = mathMonth && mathYear ? `${mathMonth} ${mathYear}` : "";
    updateData({
      bestRwScore: rwScore ? parseInt(rwScore) : undefined,
      bestRwDate: rwDateStr,
      bestMathScore: mathScore ? parseInt(mathScore) : undefined,
      bestMathDate: mathDateStr,
    });
    onNext();
  };

  const handleSkip = () => {
    updateData({ bestRwScore: undefined, bestMathScore: undefined });
    onNext();
  };

  // Handle Enter key to advance
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
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
        Enter your best DSAT super score
      </h1>
      <p className="text-neutral-500 mb-8 max-w-lg mx-auto">
        Enter your best Reading & Writing score and the date you achieved it,
        then your best Math score and its date. These can be from different test
        dates.
      </p>

      <div className="max-w-md mx-auto space-y-6 mb-8">
        <div className="text-left">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Reading & Writing Score
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
              onKeyDown={handleKeyDown}
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
            Reading & Writing Test Date
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select
                value={rwMonth}
                onChange={(e) => handleRwMonthChange(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="">Month</option>
                {testMonths.map((month) => (
                  <option key={month.value} value={month.label}>
                    {month.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select
                value={rwYear}
                onChange={(e) => handleRwYearChange(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="">Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Math Score
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="200"
              max="800"
              step="10"
              value={mathScore}
              onChange={(e) => handleMathChange(e.target.value)}
              onKeyDown={handleKeyDown}
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

        <div className="text-left">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Math Test Date
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select
                value={mathMonth}
                onChange={(e) => handleMathMonthChange(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="">Month</option>
                {testMonths.map((month) => (
                  <option key={month.value} value={month.label}>
                    {month.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select
                value={mathYear}
                onChange={(e) => handleMathYearChange(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="">Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-400">
          Each section: 200–800, in multiples of 10
        </p>
      </div>

      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={handleSkip}
          className="text-sm text-neutral-500 hover:text-neutral-700 underline"
        >
          I don't know my section scores
        </button>
        <button
          onClick={handleSkip}
          className="text-sm text-neutral-500 hover:text-neutral-700 underline"
        >
          I don't have a score yet
        </button>
      </div>
    </motion.div>
  );
}
