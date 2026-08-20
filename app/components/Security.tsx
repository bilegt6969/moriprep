"use client";

import { FC, ReactNode } from "react";

// --- Types ---
export interface FeatureSectionProps {
  badge?: string;
  title?: ReactNode;
  description?: string;
  features?: string[];
  imageSrc?: string;
  className?: string;
}

// --- Sub-Components ---
const FeatureListItem: FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start gap-3.5">
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-1.5 min-w-[18px] shrink-0 text-[#0080FF]"
      aria-hidden="true"
    >
      <path
        d="M1 6.76191L6.33333 12L17 1"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-[17px] font-medium leading-[26px] tracking-[-0.22px] text-[#0080FF]">
      {text}
    </span>
  </li>
);

// --- Default Data ---
const DEFAULT_FEATURES = [
  "100% Free Forever",
  "No Ads or Paywalls",
  "Official Question Bank",
  "Bytecode Initiative",
  "Structured Lessons",
  "No Hidden Fees",
];

// --- Main Component ---
export const SecurityFeatureSection: FC<FeatureSectionProps> = ({
  badge = "Open Education",
  title = (
    <>
      Zero paywalls.
      <br />
      Total focus.
    </>
  ),
  description = "Mori Prep is 100% free forever under Bytecode. No hidden subscriptions, no locked modules, and no ads—just open access to world-class DSAT preparation.",
  features = DEFAULT_FEATURES,
  className = "",
}) => {
  return (
    <section
      className={`mx-auto max-w-6xl px-4 md:px-6 lg:px-10 pt-16 md:pt-24 pb-16 md:pb-24 border-t-2 border-[#f2f0ed] ${className}`}
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Column: Image Illustration */}
        <div className="order-2 flex justify-center lg:order-1">
          <img
            src="/character/yoga-horse.png"
            alt="Yoga horse illustration"
            className="w-full max-w-md h-auto"
          />
        </div>

        {/* Right Column: Content & Feature List */}
        <div className="order-1 flex flex-col items-start lg:order-2">
          <span className="mb-3 text-sm font-medium text-[#0080FF]">
            {badge}
          </span>

          <h2 className="mb-4 text-4xl font-medium tracking-[-1.35px] text-[#121212] sm:text-5xl lg:text-[44px] lg:leading-[48px]">
            {title}
          </h2>

          <p className="mb-8 max-w-lg text-[19px] leading-[27px] tracking-[-0.3px] text-[#4A4A4A]">
            {description}
          </p>

          <ul
            className="grid w-full max-w-md grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2"
            aria-label="Open Education Features"
          >
            {features.map((feature, idx) => (
              <FeatureListItem key={idx} text={feature} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SecurityFeatureSection;
