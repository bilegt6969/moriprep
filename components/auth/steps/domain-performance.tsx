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

interface DomainPerformanceProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const rwDomains = [
  {
    key: "craftStructure",
    name: "Craft & Structure",
  },
  {
    key: "informationIdeas",
    name: "Information & Ideas",
  },
  {
    key: "standardEnglish",
    name: "Standard English Conventions",
  },
  {
    key: "expressionOfIdeas",
    name: "Expression of Ideas",
  },
];

const mathDomains = [
  { key: "algebra", name: "Algebra" },
  {
    key: "advancedMath",
    name: "Advanced Math",
  },
  {
    key: "problemSolving",
    name: "Problem-Solving & Data Analysis",
  },
  {
    key: "geometryTrig",
    name: "Geometry & Trigonometry",
  },
];

const barOptions = [
  { value: 1, label: "1-2 bars", range: "200-410", level: "Emerging" },
  { value: 3, label: "3 bars", range: "420-460", level: "Below Benchmark" },
  { value: 4, label: "4 bars", range: "470-540", level: "Basic" },
  { value: 5, label: "5 bars", range: "550-600", level: "Developing" },
  { value: 6, label: "6 bars", range: "610-670", level: "Proficient" },
  { value: 7, label: "7 bars", range: "680-800", level: "Advanced" },
];

export function DomainPerformance({
  data,
  updateData,
  onNext,
  onBack,
}: DomainPerformanceProps) {
  const [domainPerformance, setDomainPerformance] = useState<
    Record<string, number>
  >(data.domainPerformance || {});

  const handleDomainChange = (domainKey: string, value: number) => {
    const updated = { ...domainPerformance, [domainKey]: value };
    setDomainPerformance(updated);
    updateData({ domainPerformance: updated as any });
  };

  const handleSkip = () => {
    updateData({ domainPerformance: undefined });
    onNext();
  };

  const renderDomainSection = (title: string, domains: typeof rwDomains) => (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">{title}</h3>
      {domains.map((domain) => (
        <div key={domain.key} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium text-neutral-900">{domain.name}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {barOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDomainChange(domain.key, option.value)}
                className={`p-3 rounded-lg border transition-all duration-200 text-center group ${
                  domainPerformance[
                    domain.key as keyof typeof domainPerformance
                  ] === option.value
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <div className="text-xs mb-1 leading-none tracking-tight">
                  {"●".repeat(option.value)}
                  {"○".repeat(7 - option.value)}
                </div>
                <div className="text-xs font-medium text-neutral-900 group-hover:text-neutral-700 underline">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
        Your DSAT domain performance
      </h1>
      <p className="text-neutral-500 mb-8 max-w-lg mx-auto">
        If you have a Digital SAT score report, enter your domain performance
        bars for each section. This helps us identify your strengths and
        weaknesses.
      </p>

      <div className="max-w-3xl mx-auto text-left">
        {renderDomainSection("Reading & Writing Domains", rwDomains)}
        {renderDomainSection("Math Domains", mathDomains)}
      </div>

      <div className="flex flex-col gap-3 items-center mt-8">
        <button
          onClick={handleSkip}
          className="text-sm text-neutral-500 hover:text-neutral-700 underline"
        >
          I don't have my score report
        </button>
        <button
          onClick={handleSkip}
          className="text-sm text-neutral-500 hover:text-neutral-700 underline"
        >
          I prefer not to enter this now
        </button>
      </div>
    </motion.div>
  );
}
