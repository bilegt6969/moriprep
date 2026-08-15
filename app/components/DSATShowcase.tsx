"use client";

import Navbar from "components/Heading/Navbar";
import Image from "next/image";
import { FC, ReactNode } from "react";

// --- Shared Reusable Assets ---

const CheckIcon: FC<{ className?: string }> = ({
  className = "text-current",
}) => (
  <svg
    width="18"
    height="14"
    viewBox="0 0 18 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mt-[6px] min-w-[18px] ${className}`}
    aria-hidden="true"
  >
    <path
      d="M1 6.76191L6.33333 12L17 1"
      stroke="currentColor"
      strokeWidth="2.25"
    />
  </svg>
);

const PlayIcon: FC = () => (
  <svg
    width="26"
    height="28"
    viewBox="0 0 26 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute z-10 drop-shadow-md"
    aria-hidden="true"
  >
    <path
      d="M4 5.29857L4 18.7014C4 21.0333 6.54391 22.4736 8.54349 21.2739L19.7125 14.5725C21.6546 13.4073 21.6546 10.5927 19.7125 9.42752L8.54349 2.72609C6.54392 1.52635 4 2.96669 4 5.29857Z"
      fill="white"
    />
  </svg>
);

// --- Interface Definitions ---

interface ShowcaseProps {
  badge: string;
  badgeColorClass: string;
  title: ReactNode;
  description: string;
  bulletPoints: string[];
  demoTitle: string;
  demoSubtitle?: string;
  demoThumbnailSrc: string;
  videoSrc?: string;
  posterSrc: string;
  phoneImageSrc?: string;
  reversed?: boolean;
}

// --- Reusable Showcase Section Component ---

export const FeatureShowcase: FC<ShowcaseProps> = ({
  badge,
  badgeColorClass,
  title,
  description,
  bulletPoints,
  demoTitle,
  demoSubtitle = "Watch the demo",
  demoThumbnailSrc,
  videoSrc = "",
  posterSrc,
  phoneImageSrc = "/assets/phone.png",
  reversed = false,
}) => {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-y-16 px-4 md:px-6 lg:px-10 py-[5.625rem] md:grid-cols-2 md:gap-x-[5.75rem]">
        {/* Text Content Column */}
        <div
          className={`flex flex-col gap-4 ${reversed ? "md:order-2" : "md:order-1"}`}
        >
          <p
            className={`text-[14px] font-semibold leading-[20px] tracking-[-0.09px] ${badgeColorClass}`}
          >
            {badge}
          </p>

          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[36px] font-medium leading-[1.1] tracking-[-1.35px] text-[#121212] md:text-[44px] md:leading-[48px]">
              {title}
            </h2>
            <p className="text-[17px] leading-[27px] tracking-[-0.3px] text-[#494440] md:text-[19px]">
              {description}
            </p>
          </div>

          <ul
            className={`m-0 flex flex-col gap-4 py-2 text-[#494440] ${badgeColorClass}`}
          >
            {bulletPoints.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-[0.9375rem] whitespace-nowrap"
              >
                <CheckIcon />
                <span className="text-[17px] font-medium leading-[26px] tracking-[-0.22px] text-[#121212]">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          {/* Watch Demo Button */}
          <button
            type="button"
            className="-ml-3 mt-2 flex w-fit items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <div className="relative flex items-center justify-center">
              <PlayIcon />
              <div className="relative h-[44px] w-[78px] overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={demoThumbnailSrc}
                  alt={`${demoTitle} thumbnail`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[3px]">
              <h3 className="text-[15px] font-semibold tracking-[-0.09px] text-[#121212]">
                {demoTitle}
              </h3>
              <span className="text-[14px] text-[#494440]/50">
                {demoSubtitle}
              </span>
            </div>
          </button>
        </div>

        {/* Media / Phone Mockup Column */}
        <div
          className={`flex items-center justify-center ${reversed ? "md:order-1" : "md:order-2"}`}
        >
          <div className="relative -mb-[30%] flex w-full max-w-[381px] items-center justify-center px-6 pt-8 pb-0 md:-mb-[50%]">
            {/* Phone Bezel */}
            <Image
              src={phoneImageSrc}
              alt="App interface mockup frame"
              width={381}
              height={751}
              priority
              className="relative z-10 h-auto w-full"
            />

            {/* Embedded Screen Video */}
            <div className="absolute top-[3%] z-0 h-[94%] w-[88%] overflow-hidden rounded-[2.5rem]">
              {videoSrc ? (
                <video
                  src={videoSrc}
                  poster={posterSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${posterSrc})` }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Main Showcase Section Component ---

export function DSATShowcase() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar
        siteName="mori Prep"
        categories={[
          { label: "Practice", href: "#practice" },
          { label: "Lessons", href: "#lessons" },
          { label: "Resources", href: "#resources" },
        ]}
        showBanner={true}
      />
      {/* Question Bank Practice Section */}
      <FeatureShowcase
        badge="Practice"
        badgeColorClass="text-[#10B981]" // Tailwind Emerald-500
        title={
          <>
            Practice the domains{" "}
            <span className="text-[#10B981]">you care about.</span>
          </>
        }
        description="Filter thousands of official College Board DSAT practice questions by domain, topic, and difficulty to target your exact study needs."
        bulletPoints={[
          "All DSAT Domains",
          "Instant Explanations",
          "Bluebook-Style UI",
        ]}
        demoTitle="Question Bank Demo"
        demoThumbnailSrc="/videos/promo-watch.png"
        posterSrc="/videos/promo-watch.png"
        reversed={false}
      />

      {/* Performance Analytics Section */}
      <FeatureShowcase
        badge="Analytics"
        badgeColorClass="text-[#F97316]" // Tailwind Orange-500
        title={
          <>
            Test performance you{" "}
            <span className="text-[#F97316]">can understand.</span>
          </>
        }
        description="Clear domain accuracy breakdowns and real-time pacing metrics. No confusing test jargon—just instant clarity on what to review next."
        bulletPoints={[
          "Domain Accuracy Tracking",
          "Weak Spot Identification",
          "Real-Time Pacing Metrics",
        ]}
        demoTitle="Analytics Overview"
        demoThumbnailSrc="/videos/promo-activity.png"
        posterSrc="/videos/promo-activity.png"
        reversed={true}
      />
    </main>
  );
}

export default function FeaturesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Question Bank Practice Section */}
      <FeatureShowcase
        badge="Practice"
        badgeColorClass="text-[#10B981]" // Tailwind Emerald-500
        title={
          <>
            Practice the domains{" "}
            <span className="text-[#10B981]">you care about.</span>
          </>
        }
        description="Filter thousands of official College Board DSAT practice questions by domain, topic, and difficulty to target your exact study needs."
        bulletPoints={[
          "All DSAT Domains",
          "Instant Explanations",
          "Bluebook-Style UI",
        ]}
        demoTitle="Question Bank Demo"
        demoThumbnailSrc="/videos/promo-watch.png"
        posterSrc="/videos/promo-watch.png"
        reversed={false}
      />

      {/* Performance Analytics Section */}
      <FeatureShowcase
        badge="Analytics"
        badgeColorClass="text-[#F97316]" // Tailwind Orange-500
        title={
          <>
            Test performance you{" "}
            <span className="text-[#F97316]">can understand.</span>
          </>
        }
        description="Clear domain accuracy breakdowns and real-time pacing metrics. No confusing test jargon—just instant clarity on what to review next."
        bulletPoints={[
          "Domain Accuracy Tracking",
          "Weak Spot Identification",
          "Real-Time Pacing Metrics",
        ]}
        demoTitle="Analytics Overview"
        demoThumbnailSrc="/videos/promo-activity.png"
        posterSrc="/videos/promo-activity.png"
        reversed={true}
      />
    </main>
  );
}
