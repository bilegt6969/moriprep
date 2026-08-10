"use client";

import { motion } from "framer-motion";

const shimmer = {
  initial: { backgroundPosition: "200% 0" },
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear" as const,
    },
  },
};

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4"
      >
        {/* Animated Logo */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear" as const,
          }}
          className="w-12 h-12 border-[3px] border-[#E5E5EA] border-t-[#0071E3] rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-neutral-400 font-medium"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[100dvh] min-h-[650px] w-full bg-white overflow-hidden flex flex-col">
      {/* Ambient Background Skeleton */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-neutral-200/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-neutral-300/20 rounded-full blur-[80px]" />
      </div>

      {/* Navbar Spacer */}
      <div className="h-[70px] sm:h-[90px] shrink-0" />

      {/* Hero Content Skeleton */}
      <div className="absolute left-0 right-0 top-[45%] -translate-y-1/2 z-20 px-4">
        <div className="flex flex-col items-center justify-center max-w-5xl mx-auto w-full text-center">
          {/* Title Skeleton */}
          <div className="w-full max-w-3xl mb-6">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              className="h-16 sm:h-20 md:h-32 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-2xl bg-[length:200%_100%]"
            />
          </div>

          {/* Subtitle Skeleton */}
          <div className="w-full max-w-2xl mb-8">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              className="h-6 sm:h-8 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-xl bg-[length:200%_100%]"
            />
          </div>

          {/* Button Skeleton */}
          <div className="w-48 h-12">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-full bg-[length:200%_100%]"
            />
          </div>
        </div>
      </div>

      {/* Logo Ticker Skeleton */}
      <div className="absolute bottom-0 left-0 right-0 h-[75px] sm:h-[85px] md:h-[100px] w-full bg-transparent flex flex-col justify-center z-20">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
          <div className="w-32 h-4 mb-2">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded bg-[length:200%_100%]"
            />
          </div>
          <div className="w-full h-12">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded bg-[length:200%_100%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Title Skeleton */}
        <div className="text-center mb-12">
          <div className="w-32 h-4 mx-auto mb-4">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded bg-[length:200%_100%]"
            />
          </div>
          <div className="w-full max-w-4xl h-12 sm:h-16 mx-auto">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-2xl bg-[length:200%_100%]"
            />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4">
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-full bg-[length:200%_100%]"
                />
              </div>
              <div className="w-full h-6 mb-2">
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded bg-[length:200%_100%]"
                />
              </div>
              <div className="w-full h-20">
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded bg-[length:200%_100%]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="relative rounded-[2rem] p-6 sm:p-8 md:p-10 bg-neutral-50 border border-neutral-200">
      <div className="flex justify-between items-center mb-6">
        <div className="w-32 h-6">
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded bg-[length:200%_100%]"
          />
        </div>
        <div className="w-24 h-8">
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-full bg-[length:200%_100%]"
          />
        </div>
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        <div className="w-16 h-8">
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded bg-[length:200%_100%]"
          />
        </div>
        <div className="w-32 h-16">
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded bg-[length:200%_100%]"
          />
        </div>
      </div>

      <div className="w-full h-12 mb-8">
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded bg-[length:200%_100%]"
        />
      </div>

      <div className="space-y-4 mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5">
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded bg-[length:200%_100%]"
              />
            </div>
            <div className="flex-1 h-5">
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded bg-[length:200%_100%]"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-12">
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          className="h-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-full bg-[length:200%_100%]"
        />
      </div>
    </div>
  );
}
