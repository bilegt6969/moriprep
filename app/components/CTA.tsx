"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CallToAction() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <section className="relative bg-[#FBFAF9] overflow-hidden py-6 sm:py-8 md:py-[4.875rem] md:pb-[5.75rem] w-full">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 relative">
        {/* Wrapper: stacked column on mobile, normal flow (with absolute image) on desktop */}
        <div className="flex flex-col md:block">
          {/* Character image */}
          <div
            className="
              relative flex justify-center mb-4
              md:absolute md:inset-y-0 md:left-1/2 md:right-0
              md:flex md:items-center md:justify-start md:-translate-y-1 md:mb-0
              pointer-events-none
            "
          >
            <div className="relative w-[300px] sm:w-[360px] md:w-[495px] aspect-[495/179]">
              {!isLoaded && !isError && (
                <div
                  className="absolute inset-0 z-0 animate-pulse rounded-xl bg-gray-200"
                  aria-hidden="true"
                />
              )}

              {/* Illustration is decorative, so a failed load just quietly
                  leaves empty space rather than showing an error glyph —
                  but we still stop the skeleton from pulsing forever. */}
              {!isError && (
                <Image
                  src="/character/moriprep.png"
                  alt="Mori Prep Character"
                  fill
                  sizes="(min-width: 768px) 495px, 360px"
                  className={`object-contain transition-opacity duration-500 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  priority
                  onLoad={() => setIsLoaded(true)}
                  onError={() => setIsError(true)}
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div
            className="
              flex flex-col items-center gap-4 text-center
              md:items-start md:text-left md:pr-[60%]
              text-[#474645] relative z-10
            "
          >
            <div className="flex flex-col gap-4 md:gap-6">
              <h1 className="font-medium text-[32px] sm:text-[38px] md:text-[44px] leading-[38px] sm:leading-[44px] md:leading-[48px] tracking-[-1.35px] text-[#343433] m-0">
                Explore Mori Prep
              </h1>
              <p className="font-normal text-[16px] md:text-[17px] leading-[24px] md:leading-[26px] tracking-[-0.22px] text-[#494440] m-0">
                Mori Prep is Mongolia’s first open Digital SAT platform built by
                Bytecode to make top-tier university preparation free and
                accessible to everyone.
              </p>
            </div>

            <Link
              href="/practice"
              className="inline-block mt-2 transition-all duration-200 ease-out font-medium hover:opacity-80 group"
            >
              <div className="relative inline-flex items-center text-[#018DFF] text-[17px] font-medium">
                Start Practicing Free
                <svg
                  width="18"
                  height="15"
                  viewBox="0 0 18 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:scale-110"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.94417 0.373474L17.2534 7.49997L9.94417 14.6265L8.7225 13.3735L13.8492 8.37497H0L0 6.62497L13.8492 6.62497L8.7225 1.62647L9.94417 0.373474Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
