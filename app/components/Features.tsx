"use client";

import { FC, ReactNode } from "react";

// --- Types ---
export interface FeatureItem {
  title: string;
  description: string;
  icon?: ReactNode; // Added support for SVG icons
}

// --- Data ---
const FEATURES: FeatureItem[] = [
  {
    title: "Official Question Bank",
    description:
      "Practice directly with integrated College Board DSAT questions covering all Reading, Writing, and Math domains. Master official test logic in a clean interface built for real exam readiness.",
  },
  {
    title: "Comprehensive Analytics",
    description:
      "Track your progress with detailed performance insights. Monitor domain accuracy rates, spot weak areas, view daily streaks, and focus your study time where it matters most.",
  },
  {
    title: "Open Lessons & Strategy",
    description:
      "Access step-by-step strategy lessons created specifically for Mongolian students. Learn test-taking logic, pacing tricks, and grammar rules without needing expensive private tutors.",
  },
  {
    title: "College Board Aligned",
    description:
      "All practice modules align directly with the official Digital SAT format, multi-stage adaptive structure, and College Board domain blueprints for complete test-day readiness.",
  },
  {
    title: "100% Free Forever",
    description:
      "A non-profit open education initiative powered by Bytecode. Zero subscriptions, zero paywalls, and zero hidden fees. Higher education prep accessible to every student.",
  },
  {
    title: "Curated Resource Library",
    description:
      "Instant access to handpicked prep books, math formula sheets, and downloadable strategy guides. Optimized for both desktop and mobile so you can practice anywhere, anytime.",
  },
];

// --- Sub-Components ---
const FeatureCard: FC<{ feature: FeatureItem }> = ({ feature }) => (
  <li className="flex flex-col gap-[0.625rem]">
    {/* Optional Icon Slot */}
    {feature.icon && (
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0080FF]/10 text-[#0080FF]">
        {feature.icon}
      </div>
    )}
    <h3 className="text-[14px] font-semibold leading-[20px] tracking-[-0.09px] text-[#0080FF]">
      {feature.title}
    </h3>
    <p className="text-[15px] leading-[22px] tracking-[-0.15px] text-[#121212]/80">
      {feature.description}
    </p>
  </li>
);

// --- Main Component ---
interface FeaturesProps {
  items?: FeatureItem[];
  className?: string;
}

export const FeaturesSection: FC<FeaturesProps> = ({
  items = FEATURES,
  className = "",
}) => {
  return (
    <section
      className={`w-full bg-[#FBF9F5] py-[6.5rem] ${className}`}
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-10">
        {/* Visually hidden heading for screen readers to understand the section */}
        <h2 id="features-heading" className="sr-only">
          Mori Prep Features
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-20 gap-y-[6.0625rem]">
          {items.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FeaturesSection;
