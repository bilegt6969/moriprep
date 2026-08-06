"use client";

import { motion, Variants } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function BillowLandingSection() {
  // Cloud background from the original HTML
  const CLOUD_BG_URL =
    "https://framerusercontent.com/images/v8vSnAp2uGbpWVPFEf15yk8.png";

  // Framer Motion animation variants for smooth, subtle entrances
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  // Continuous subtle floating for the UI elements
  const floatingAnimation: any = {
    y: ["-3%", "3%"],
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 4,
      ease: "easeInOut",
    },
  };

  return (
    <>
      {/* Import the exact matching fonts for perfect typography replication */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap');
        .font-newsreader { font-family: 'Newsreader', ui-serif, Georgia, serif; }
        .font-inter { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; }
      `,
        }}
      />

      <section className="min-h-screen bg-[#fcfcfc] py-24 px-4 sm:px-6 md:px-12 flex flex-col items-center font-inter overflow-hidden">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14"
        >
          {/* Pill Badge */}
          <div className="flex items-center gap-1.5 border border-[#446278]/20 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 mb-8 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-[#0080ff]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5M12 15l-3-3a22 22 0 0 1 3.79-1.39L15 8l-1.5 1.5M16.5 10.5 15 9" />
              <path d="M12 15l4.5 4.5a1.5 1.5 0 0 0 2.12 0l1.88-1.88a1.5 1.5 0 0 0 0-2.12L16 11l-4 4Z" />
              <path d="m8.5 7.5 4.5-4.5a1.5 1.5 0 0 1 2.12 0l1.88 1.88a1.5 1.5 0 0 1 0 2.12L12.5 11l-4-3.5Z" />
            </svg>
            <span className="text-[11px] font-semibold text-[#001c2e] tracking-tight">
              Getting started
            </span>
          </div>

          <h2 className="font-eb-garamond text-[44px] md:text-[52px] font-medium text-[#001c2e] leading-[1.1] tracking-tighter mb-5">
            Your first win is
            <br />
            five minutes away.
          </h2>

          <p className="text-[#757575] text-[15px] max-w-[420px] mx-auto leading-[1.6]">
            Billow is built to get you up and running fast.
            <br />
            No long onboarding, no complicated setup.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1060px] mx-auto w-full"
        >
          {/* Card 1: Import */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-[24px] border border-[#f0f0f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-[400px]"
          >
            {/* Top Graphic Area */}
            <div className="relative h-[220px] w-full bg-[#f6f9fc] flex items-center justify-center overflow-hidden">
              <img
                src={CLOUD_BG_URL}
                alt="Clouds"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-60 mix-blend-multiply"
              />

              {/* CSV Tag */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur border border-gray-100 rounded-[6px] px-2 py-1 flex items-center gap-1.5 shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3 h-3 text-[#0080ff]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="16" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span className="text-[9px] font-bold text-[#001c2e]">CSV</span>
              </div>

              {/* Exact Spreadsheet Mock UI */}
              <div className="absolute inset-0 flex flex-col gap-2 p-6 pt-12 opacity-40 max-w-[280px] mx-auto">
                <div className="flex gap-2 w-full mb-1">
                  <div className="h-2.5 w-[20%] bg-gray-200 rounded-sm" />
                  <div className="h-2.5 w-[20%] bg-gray-200 rounded-sm" />
                  <div className="h-2.5 w-[30%] bg-gray-200 rounded-sm" />
                  <div className="h-2.5 w-[15%] bg-gray-200 rounded-sm" />
                </div>
                <div className="flex gap-2 w-full">
                  <div className="h-[22px] w-[20%] bg-gray-100 rounded-[4px]" />
                  <div className="h-[22px] w-[20%] bg-[#0080ff]/10 border border-[#0080ff]/40 rounded-[4px]" />
                  <div className="h-[22px] w-[30%] bg-gray-100 rounded-[4px]" />
                  <div className="h-[22px] w-[15%] bg-gray-100 rounded-[4px]" />
                </div>
                <div className="flex gap-2 w-full">
                  <div className="h-[22px] w-[20%] bg-gray-100 rounded-[4px]" />
                  <div className="h-[22px] w-[20%] bg-gray-100 rounded-[4px]" />
                  <div className="h-[22px] w-[30%] bg-gray-100 rounded-[4px]" />
                  <div className="h-[22px] w-[15%] bg-[#0080ff]/10 border border-[#0080ff]/40 rounded-[4px]" />
                </div>
                <div className="flex gap-2 w-full">
                  <div className="h-[22px] w-[20%] bg-gray-100 rounded-[4px]" />
                  <div className="h-[22px] w-[20%] bg-gray-100 rounded-[4px]" />
                  <div className="h-[22px] w-[30%] bg-[#0080ff]/10 border border-[#0080ff]/40 rounded-[4px]" />
                  <div className="h-[22px] w-[15%] bg-gray-100 rounded-[4px]" />
                </div>
              </div>

              {/* Floating Action Button */}
              <motion.button
                animate={floatingAnimation}
                className="relative z-10 flex items-center gap-2 bg-[#1a56ff] text-white px-7 py-2.5 rounded-[12px] shadow-[0_8px_24px_rgba(26,86,255,0.35)]"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="font-newsreader font-medium text-[19px] mt-0.5 tracking-wide">
                  Import
                </span>
              </motion.button>
            </div>

            {/* Text Area */}
            <div className="p-7 flex-1 flex flex-col items-center justify-center text-center">
              <h3 className="font-newsreader text-[19px] font-medium text-[#001c2e] mb-2.5">
                Bring your clients with you
              </h3>
              <p className="text-[#757575] text-[13px] leading-[1.6]">
                Import your existing data in one click. Drop in a CSV or import
                with AI. Your entire book of business, ready to go.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Send Invoice */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-[24px] border border-[#f0f0f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-[400px]"
          >
            <div className="relative h-[220px] w-full bg-[#f6f9fc] flex items-center justify-center overflow-hidden">
              <img
                src={CLOUD_BG_URL}
                alt="Clouds"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-60 mix-blend-multiply"
              />

              <div className="relative z-10 w-full flex justify-center mt-4">
                {/* Mock Invoice Card */}
                <motion.div
                  animate={floatingAnimation}
                  className="bg-white border border-[#f0f0f0] rounded-[16px] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.05)] w-[160px] p-5 flex flex-col items-center relative z-10"
                >
                  <div className="text-[#001c2e] font-bold text-[28px] tracking-tight leading-none mb-2">
                    <span className="text-[20px] mr-0.5">$</span>20
                    <span className="text-[20px] ml-0.5">K</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#d7ffc9]/40 text-[#009447] px-2 py-0.5 rounded-[4px] text-[8px] font-semibold tracking-wide">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    50% Deposit
                  </div>
                  <div className="w-full mt-5 space-y-1.5 flex flex-col items-center">
                    <div className="h-1 w-full bg-[#f0f0f0] rounded-full" />
                    <div className="h-1 w-2/3 bg-[#f0f0f0] rounded-full" />
                  </div>
                </motion.div>

                {/* Floating 2 Min Badge - positioned exactly like screenshot */}
                <motion.div
                  animate={{ y: ["4%", "-4%"] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 4.5,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-3 right-[25%] z-20 bg-gradient-to-br from-[#1a56ff] to-[#0a35b0] text-white w-[42px] h-[42px] rounded-full shadow-[0_8px_16px_rgba(26,86,255,0.3)] flex flex-col items-center justify-center border-2 border-white"
                >
                  <span className="font-newsreader font-medium text-[16px] leading-none mt-0.5">
                    2
                  </span>
                  <span className="text-[7.5px] font-medium leading-none tracking-wide text-white/90">
                    min
                  </span>
                </motion.div>
              </div>
            </div>

            <div className="p-7 flex-1 flex flex-col items-center justify-center text-center">
              <h3 className="font-newsreader text-[19px] font-medium text-[#001c2e] mb-2.5">
                Send your first invoice
              </h3>
              <p className="text-[#757575] text-[13px] leading-[1.6]">
                Create beautiful invoices in under 2 minutes. Pick a client, add
                line items, hit send. No templates to configure, no setup
                wizards to click through.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Cockpit */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-[24px] border border-[#f0f0f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-[400px]"
          >
            <div className="relative h-[220px] w-full bg-[#f6f9fc] overflow-hidden">
              <img
                src={CLOUD_BG_URL}
                alt="Clouds"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-60 mix-blend-multiply"
              />

              {/* Exact Chart & UI Layout */}
              <div className="absolute inset-0 z-10 w-full h-full flex flex-col">
                {/* Top Metrics */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <span className="font-bold text-[#001c2e] text-[20px]">
                    $95K
                  </span>
                  <span className="bg-[#e6f2fc] text-[#0080ff] text-[8.5px] font-bold px-1.5 py-0.5 rounded-[4px]">
                    +48%
                  </span>
                </div>

                {/* SVG Line Chart perfectly matching the angles */}
                <svg
                  viewBox="0 0 200 100"
                  className="absolute bottom-8 left-4 right-4 w-[calc(100%-32px)] h-20 overflow-visible"
                >
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#1a56ff"
                        stopOpacity="0.12"
                      />
                      <stop offset="100%" stopColor="#1a56ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Chart Fill */}
                  <path
                    d="M0,70 L50,45 L90,55 L160,15 L160,100 L0,100 Z"
                    fill="url(#chartGradient)"
                  />
                  {/* Chart Line */}
                  <path
                    d="M0,70 L50,45 L90,55 L160,15"
                    fill="none"
                    stroke="#1a56ff"
                    strokeWidth="1.5"
                  />

                  {/* Data Points */}
                  <circle
                    cx="50"
                    cy="45"
                    r="3"
                    className="fill-white stroke-[#1a56ff]"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="90"
                    cy="55"
                    r="3"
                    className="fill-white stroke-[#1a56ff]"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="160"
                    cy="15"
                    r="3"
                    className="fill-white stroke-[#1a56ff]"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Floating Unpaid Invoices Badge */}
                <motion.div
                  animate={floatingAnimation}
                  className="absolute right-6 bottom-7 z-20 bg-gradient-to-br from-[#1a56ff] to-[#0a35b0] text-white p-3.5 rounded-[12px] shadow-[0_12px_24px_rgba(26,86,255,0.35)] w-[120px]"
                >
                  <div className="text-[8px] text-white/80 font-medium mb-1 tracking-wide">
                    Unpaid Invoices
                  </div>
                  <div className="font-newsreader text-[18px] font-medium leading-none">
                    $14,000
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="p-7 flex-1 flex flex-col items-center justify-center text-center">
              <h3 className="font-newsreader text-[19px] font-medium text-[#001c2e] mb-2.5">
                See your cockpit come alive
              </h3>
              <p className="text-[#757575] text-[13px] leading-[1.6]">
                Watch your dashboard fill in from day one. Every invoice,
                payment, and lead you log instantly shapes your cockpit. Clarity
                from action one.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
