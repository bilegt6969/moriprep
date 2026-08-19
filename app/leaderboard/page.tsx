"use client";

import { motion } from "framer-motion";

export default function LeaderboardPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden py-20">
      <div className="w-full max-w-[1200px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h1 className="text-[48px] md:text-[64px] font-bold tracking-tight text-[#1D1D1F] mb-4">
            Leaderboard
          </h1>
          <p className="text-xl text-[#86868B]">
            Compete with top performers and track your ranking
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#F5F5F7] rounded-[32px] p-12 md:p-20 text-center max-w-[800px] mx-auto"
        >
          {/* Trophy Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="w-24 h-24 mx-auto mb-8"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full text-[#FFD84D]"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </motion.div>

          <h2 className="text-[36px] md:text-[42px] font-bold tracking-tight text-[#1D1D1F] mb-4">
            Coming Soon
          </h2>

          <p className="text-lg text-[#86868B] mb-8 max-w-[500px] mx-auto leading-relaxed">
            We're building an exciting leaderboard feature where you can compete
            with fellow students, track your progress, and climb to the top!
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="/practice"
              className="inline-block bg-[#1D1D1F] text-white rounded-xl px-8 py-4 text-[15px] font-medium transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Start Practicing
            </a>
            <a
              href="/analytics"
              className="inline-block bg-white text-[#1D1D1F] rounded-xl px-8 py-4 text-[15px] font-medium transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-95"
            >
              View Your Stats
            </a>
          </motion.div>

          {/* Feature Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FFD84D]/20 flex items-center justify-center mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-[#FFD84D]"
                >
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                Global Rankings
              </h3>
              <p className="text-sm text-[#86868B]">
                See how you stack up against students worldwide
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#AEE2F4]/20 flex items-center justify-center mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-[#0C6E9A]"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                Weekly Challenges
              </h3>
              <p className="text-sm text-[#86868B]">
                Compete in themed challenges to earn bonus points
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FBD9AE]/20 flex items-center justify-center mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-[#9A4A0C]"
                >
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                Achievements
              </h3>
              <p className="text-sm text-[#86868B]">
                Unlock badges and achievements as you progress
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
