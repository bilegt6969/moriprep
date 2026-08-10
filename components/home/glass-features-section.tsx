"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

// --- Sub-components for Mockups ---

const MockupQuestions = ({ isActive }: { isActive: boolean }) => (
  <div
    className={`w-[85%] h-[80%] rounded-xl shadow-2xl flex flex-col p-4 overflow-hidden backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
    ${
      isActive
        ? "bg-[#1d1d1f]/95 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        : "bg-[#2c2c2e]/95 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    }`}
  >
    {/* macOS Traffic Lights */}
    <div className="flex items-center gap-1.5 mb-4">
      <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
      <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
      <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
    </div>
    {/* Content Skeleton */}
    <div className="space-y-3 mb-5">
      <div
        className={`h-2 rounded-full w-full ${
          isActive ? "bg-gray-600" : "bg-gray-600"
        }`}
      />
      <div
        className={`h-2 rounded-full w-4/5 ${
          isActive ? "bg-gray-600" : "bg-gray-600"
        }`}
      />
      <div
        className={`h-2 rounded-full w-2/3 ${
          isActive ? "bg-gray-600" : "bg-gray-600"
        }`}
      />
    </div>
    {/* Buttons */}
    <div className="mt-auto flex gap-2">
      <div className="flex-1 h-8 rounded-lg bg-[#007aff] shadow-sm flex items-center justify-center">
        <div className="w-3 h-1 rounded-full bg-white/60" />
      </div>
      <div
        className={`flex-1 h-8 rounded-lg flex items-center justify-center ${
          isActive ? "bg-gray-700" : "bg-gray-700"
        }`}
      >
        <div
          className={`w-3 h-1 rounded-full ${
            isActive ? "bg-gray-500" : "bg-gray-500"
          }`}
        />
      </div>
    </div>
  </div>
);

const MockupAnalytics = ({ isActive }: { isActive: boolean }) => (
  <div
    className={`w-[85%] rounded-xl shadow-2xl p-4 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
    ${
      isActive
        ? "bg-[#1d1d1f]/95 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        : "bg-[#2c2c2e]/95 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    }`}
  >
    <div className="flex justify-between items-center mb-4">
      <span
        className={`text-[10px] font-semibold ${
          isActive ? "text-gray-400" : "text-gray-400"
        }`}
      >
        Performance
      </span>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#007aff]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#af52de]" />
      </div>
    </div>

    <div className="space-y-3">
      {[
        { label: "Math", pct: "78%", color: "bg-[#34c759]" },
        { label: "Reading", pct: "65%", color: "bg-[#007aff]" },
        { label: "Writing", pct: "82%", color: "bg-[#af52de]" },
      ].map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-[9px] font-medium mb-1">
            <span className={isActive ? "text-gray-300" : "text-gray-300"}>
              {item.label}
            </span>
            <span className={isActive ? "text-white" : "text-white"}>
              {item.pct}
            </span>
          </div>
          <div
            className={`w-full h-1.5 rounded-full ${
              isActive ? "bg-gray-700" : "bg-gray-700"
            }`}
          >
            <div
              className={`h-full rounded-full ${item.color}`}
              style={{ width: item.pct }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MockupPractice = ({ isActive }: { isActive: boolean }) => (
  <div
    className={`w-[90%] h-[85%] rounded-xl shadow-2xl flex overflow-hidden backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
    ${
      isActive
        ? "bg-[#1d1d1f]/95 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        : "bg-[#2c2c2e]/95 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    }`}
  >
    {/* iPadOS Sidebar */}
    <div
      className={`w-12 border-r flex flex-col items-center py-3 gap-2 transition-colors duration-700
      ${
        isActive
          ? "bg-[#1c1c1e]/50 border-white/10"
          : "bg-[#1c1c1e]/50 border-white/10"
      }`}
    >
      <div className="w-7 h-7 rounded-full bg-[#007aff] flex items-center justify-center shadow-sm">
        <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />
      </div>
      <div
        className={`w-7 h-7 rounded-full ${
          isActive ? "bg-gray-700" : "bg-gray-700"
        }`}
      />
      <div
        className={`w-7 h-7 rounded-full ${
          isActive ? "bg-gray-700" : "bg-gray-700"
        }`}
      />
    </div>
    {/* Main Content */}
    <div className="flex-1 p-4 flex flex-col">
      <div
        className={`text-[10px] font-semibold mb-4 ${
          isActive ? "text-gray-200" : "text-gray-200"
        }`}
      >
        Practice Test 1
      </div>
      <div className="space-y-2 mb-4">
        <div
          className={`h-2 rounded-full w-full ${
            isActive ? "bg-gray-600" : "bg-gray-600"
          }`}
        />
        <div
          className={`h-2 rounded-full w-5/6 ${
            isActive ? "bg-gray-600" : "bg-gray-600"
          }`}
        />
        <div
          className={`h-2 rounded-full w-4/6 ${
            isActive ? "bg-gray-600" : "bg-gray-600"
          }`}
        />
      </div>
      <div className="mt-auto flex justify-between items-center">
        <div
          className={`text-[8px] font-medium px-2 py-1 rounded-full ${
            isActive ? "bg-gray-700 text-gray-300" : "bg-gray-700 text-gray-300"
          }`}
        >
          12:45 remaining
        </div>
      </div>
    </div>
  </div>
);

// --- Content Data ---

interface Feature {
  id: string;
  pillText: string;
  title: string;
  description: string;
  renderMockup: (isActive: boolean) => React.ReactElement;
}

const features: Feature[] = [
  {
    id: "01",
    pillText: "practice",
    title: "Practice Sessions",
    description:
      "Fully customizable learning paths and practice tests built to maximize understanding.",
    renderMockup: (isActive: boolean) => (
      <MockupQuestions isActive={isActive} />
    ),
  },
  {
    id: "02",
    pillText: "insights",
    title: "Insights",
    description:
      "Track your performance and make smarter, data-driven learning decisions.",
    renderMockup: (isActive: boolean) => (
      <MockupAnalytics isActive={isActive} />
    ),
  },
  {
    id: "03",
    pillText: "hub",
    title: "Learning Hub",
    description:
      "Start a modern, effective learning journey and master subjects in minutes.",
    renderMockup: (isActive: boolean) => <MockupPractice isActive={isActive} />,
  },
];

// --- Main Component ---

export default function GlassFeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovering]);

  const HeadingPill = ({
    text,
    num,
    index,
  }: {
    text: string;
    num: string;
    index: number;
  }) => {
    const isActive = activeIndex === index;
    return (
      <span
        onClick={() => setActiveIndex(index)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] relative transform hover:scale-[1.03] active:scale-[0.97] align-middle mx-1
          ${
            isActive
              ? "bg-white/20 border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              : "bg-[#1d1d1f] border border-white/5 hover:bg-[#2c2c2e]"
          }`}
      >
        <span
          className={`font-semibold transition-all duration-500 ${
            isActive
              ? "bg-clip-text text-transparent"
              : "text-[#86868b] font-normal"
          }`}
          style={
            isActive
              ? {
                  backgroundImage:
                    "linear-gradient(to right, #f08b3a, #e54572, #9150c6, #5281ea)",
                }
              : {}
          }
        >
          {text}
        </span>
        <span
          className={`text-[10px] font-bold tracking-tighter ${
            isActive ? "text-[#5281ea]" : "text-gray-600"
          }`}
        >
          {num}
        </span>
      </span>
    );
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-2 md:p-4 overflow-hidden font-sans selection:bg-[#007aff]/30">
      <div className="relative z-10 w-full max-w-[95%] mx-auto flex flex-col pt-12 md:pt-24 bg-black backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-white/5">
        {/* Dynamic Header - Restored Original Sizes */}
        <h2 className="text-[14px] sm:text-[18px] md:text-[22px] font-medium tracking-tight leading-[1.35] mb-20 max-w-4xl select-none text-[#86868b]">
          <div
            className={`transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] mb-1 ${
              activeIndex === 0 ? "text-white" : ""
            }`}
          >
            Mori Prep <HeadingPill text="questions" num="01" index={0} /> helps
            you practice,
          </div>
          <div
            className={`transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] mb-1 ${
              activeIndex === 1 ? "text-white" : ""
            }`}
          >
            <HeadingPill text="analytics" num="02" index={1} /> tracks your
            progress, and
          </div>
          <div
            className={`transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              activeIndex === 2 ? "text-white" : ""
            }`}
          >
            <HeadingPill text="practice" num="03" index={2} /> prepares you for
            test day.
          </div>
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full pb-16">
          {features.map((feature, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.div
                key={feature.id}
                onMouseEnter={() => {
                  setActiveIndex(index);
                  setIsHovering(true);
                }}
                onMouseLeave={() => setIsHovering(false)}
                animate={{
                  scale: isActive ? 1.02 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`relative flex flex-col p-6 rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer group
                  ${
                    isActive
                      ? "bg-black border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-10"
                      : "bg-[#1d1d1f] border border-white/5 hover:bg-[#2c2c2e] z-0"
                  }
                `}
              >
                {/* Mockup Container */}
                <div className="relative h-[220px] mb-8 flex items-center justify-center w-full">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.05 : 0.95,
                      opacity: isActive ? 1 : 0.6,
                      y: isActive ? 0 : 10,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full h-full flex items-center justify-center origin-bottom"
                  >
                    {feature.renderMockup(isActive)}
                  </motion.div>
                </div>

                {/* Text Content - Restored Original Sizes */}
                <div className="mt-auto">
                  <div
                    className={`text-[10px] font-mono font-bold mb-4 tracking-wider transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${isActive ? "text-[#5281ea]" : "text-gray-500"}`}
                  >
                    {feature.id}
                  </div>
                  <h3
                    className={`text-[14px] font-semibold mb-3 tracking-tight transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${isActive ? "text-white" : "text-white"}`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-[11px] leading-relaxed font-medium transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${isActive ? "text-gray-300" : "text-gray-400"}`}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
