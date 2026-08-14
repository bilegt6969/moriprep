"use client";

import Image from "next/image";
import Link from "next/link";

export default function CallToAction() {
  return (
    // The main container with the beige background and padding
    <section className="relative bg-[#FBFAF9] overflow-hidden py-[4.875rem] pb-[5.75rem] w-full">
      {/* Inner container to constrain width and handle layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 relative">
        {/* The background Character Illustration Container */}
        <div className="absolute inset-y-0 left-1/2 right-0 flex items-center justify-start -translate-y-1 opacity-100 pointer-events-none">
          <Image
            src="/character/moriprep.png"
            alt="Mori Prep Character"
            width={495}
            height={179}
            className="object-contain"
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        {/* Content Container */}
        <div className="flex flex-col items-start gap-4 md:pr-[60%] text-[#474645] relative z-10">
          <div className="flex flex-col gap-6">
            <h1 className="font-medium text-[44px] leading-[48px] tracking-[-1.35px] text-[#343433] m-0">
              Explore Mori Prep
            </h1>

            <p className="font-normal text-[17px] leading-[26px] tracking-[-0.22px] text-[#494440] m-0">
              Mori Prep is Mongolia’s first open Digital SAT platform built by
              Bytecode to make top-tier university preparation free and
              accessible to everyone.
            </p>
          </div>

          {/* Call to Action Button */}
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
    </section>
  );
}
