"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FC, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

// Same pattern used in FeatureShowcase's ImageWithSkeleton: pulse while
// loading, swap to a graceful fallback on error instead of leaving Next.js's
// default broken-image box sitting in the column.
const MockupImage: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[450px] aspect-[450/887]">
      {!isLoaded && !isError && (
        <div
          className="absolute inset-0 z-0 animate-pulse rounded-t-xl bg-gray-200"
          aria-hidden="true"
        />
      )}

      {isError && (
        <div
          className="absolute inset-0 z-0 flex items-center justify-center rounded-t-xl bg-gray-100 text-gray-400"
          role="img"
          aria-label={`${alt} failed to load`}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M4 16l4.5-4.5a2 2 0 012.8 0L15 15l1.2-1.2a2 2 0 012.8 0L21 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
          </svg>
        </div>
      )}

      {!isError && (
        <Image
          src={src}
          alt={alt}
          width={450}
          height={887}
          sizes="(min-width: 768px) 33vw, 90vw"
          className={`relative z-10 h-auto w-full rounded-t-xl transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
        />
      )}
    </div>
  );
};

export function SendReceiveSwap() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-10 pt-[6.375rem] pb-[6rem] border-t-2 border-[#f2f0ed]">
        {/* Section Header */}
        <motion.h1
          className="font-sans text-[44px] font-medium leading-[48px] tracking-[-1.35px] text-[#343433]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="block">Practice, learn, review.</span> All in one
          place.
        </motion.h1>

        {/* 3-Column Grid */}
        <motion.div
          className="mt-[3.1875rem] grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Practice Column - Blue */}
          <motion.div
            className="flex flex-col items-stretch justify-center gap-5 text-[#018DFF]"
            variants={itemVariants}
          >
            <div className="mx-auto w-full overflow-hidden rounded-xl bg-[#FBFAF9] px-4 pt-4">
              <MockupImage
                src="/assets/practice.png"
                alt="Practice phone mockup"
              />
            </div>
            <div className="flex items-center justify-center gap-[0.45rem]">
              <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="14"
                    y="14"
                    width="14"
                    height="14"
                    rx="7"
                    transform="rotate(-180 14 14)"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0744 4.54235C10.2506 4.03884 9.76658 3.55484 9.26307 3.73107L3.53771 5.73494C2.99344 5.92544 2.96251 6.68351 3.48946 6.91771L5.16162 7.6609C5.23783 7.69476 5.32794 7.64563 5.39673 7.59849V7.59849L7.34209 6.26566C7.55084 6.12263 7.79972 6.38084 7.64911 6.58419L6.27378 8.44112V8.44112C6.21535 8.52002 6.13945 8.63238 6.17932 8.7221L6.88771 10.316C7.12191 10.8429 7.87998 10.812 8.07048 10.2677L10.0744 4.54235Z"
                    fill="white"
                  />
                </svg>
              </div>
              <p className="font-sans text-base font-medium">Practice</p>
            </div>
          </motion.div>

          {/* Resources Column - Green */}
          <motion.div
            className="flex flex-col items-stretch justify-center gap-5 text-[#34C759]"
            variants={itemVariants}
          >
            <div className="mx-auto w-full overflow-hidden rounded-xl bg-[#FBFAF9] px-4 pt-4">
              <MockupImage
                src="/assets/resources.png"
                alt="Resources phone mockup"
              />
            </div>
            <div className="flex items-center justify-center gap-[0.45rem]">
              <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="14" height="14" rx="7" fill="currentColor" />
                  <path
                    d="M7.00906 3.88867V9.61595M7.00906 9.61595L9.15678 7.46822M7.00906 9.61595L4.86133 7.46822"
                    stroke="white"
                    strokeWidth="1.43182"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-sans text-base font-medium">Resources</p>
            </div>
          </motion.div>

          {/* Analytics Column - Gray */}
          <motion.div
            className="flex flex-col items-stretch justify-center gap-5 text-[#747484]"
            variants={itemVariants}
          >
            <div className="mx-auto w-full overflow-hidden rounded-xl bg-[#FBFAF9] px-4 pt-4">
              <MockupImage
                src="/assets/domains.png"
                alt="Domains phone mockup"
              />
            </div>
            <div className="flex items-center justify-center gap-[0.45rem]">
              <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="14" height="14" rx="7" fill="currentColor" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.01605 4.23143C7.41414 4.24732 7.80173 4.36528 8.14286 4.57443C8.48402 4.78361 8.76817 5.07756 8.96825 5.42955C8.97143 5.43515 8.9747 5.4407 8.97806 5.44619L9.28569 5.95021L8.84816 5.8312C8.52114 5.74225 8.18591 5.93578 8.09942 6.26346C8.01292 6.59115 8.20791 6.92889 8.53493 7.01784L10.4533 7.53964C10.7804 7.62859 11.1156 7.43506 11.2021 7.10737L11.7161 5.16001C11.8026 4.83232 11.6076 4.49458 11.2806 4.40563C10.9536 4.31668 10.6183 4.51021 10.5318 4.83789L10.3831 5.40132L10.0263 4.81667C9.72358 4.2876 9.29396 3.84355 8.77647 3.52625C8.25608 3.20718 7.66437 3.02706 7.05677 3.00282C6.44919 2.97858 5.84627 3.11101 5.30421 3.38693C4.76221 3.66281 4.29879 4.0731 3.95651 4.57888C3.76701 4.8589 3.84055 5.24157 4.12076 5.4336C4.40096 5.62563 4.78174 5.55431 4.97124 5.27428C5.19885 4.93794 5.50618 4.66638 5.86388 4.4843C6.22152 4.30226 6.61792 4.21555 7.01605 4.23143ZM3.13489 6.68396C3.09359 6.73945 3.06114 6.80293 3.04017 6.87287C3.03808 6.87985 3.0361 6.88687 3.03426 6.89392L2.52051 8.8402C2.43402 9.16789 2.629 9.50563 2.95603 9.59458C3.28305 9.68353 3.61828 9.49 3.70478 9.16232L3.85349 8.59892L4.2102 9.18334C4.51288 9.7124 4.9425 10.1565 5.45999 10.4737C5.98038 10.7928 6.57209 10.9729 7.1797 10.9972C7.78727 11.0214 8.39019 10.889 8.93225 10.6131C9.47425 10.3372 9.93768 9.9269 10.28 9.42112C10.4695 9.1411 10.3959 8.75843 10.1157 8.5664C9.8355 8.37437 9.45472 8.44569 9.26523 8.72572C9.03761 9.06206 8.73029 9.33362 8.37259 9.5157C8.01494 9.69774 7.61854 9.78445 7.22042 9.76857C6.82232 9.75268 6.43473 9.63472 6.09361 9.42557C5.75245 9.21639 5.4683 8.92244 5.26821 8.57045C5.26503 8.56485 5.26176 8.5593 5.25841 8.55381L4.95089 8.05L5.38846 8.16901C5.71548 8.25796 6.05071 8.06443 6.1372 7.73675C6.2237 7.40906 6.02871 7.07132 5.70169 6.98237L3.78455 6.46091L3.77758 6.45905C3.6966 6.43784 3.61519 6.43389 3.53728 6.44495C3.45936 6.45594 3.38241 6.4823 3.31081 6.52511C3.30322 6.52965 3.29572 6.53435 3.28833 6.53922C3.22753 6.57921 3.17615 6.62844 3.13489 6.68396Z"
                    fill="white"
                  />
                </svg>
              </div>
              <p className="font-sans text-base font-medium">Analytics</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
