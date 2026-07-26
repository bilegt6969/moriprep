"use client";

import { motion } from "framer-motion";
import { BookOpenIcon, CalculatorIcon } from "lucide-react";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: customEase },
  },
};

const practiceAreas = [
  {
    title: "Reading & Writing",
    description: "1492 questions covering all domains",
    icon: <BookOpenIcon className="w-8 h-8 stroke-[1.5]" />,
    available: true,
    href: "/dsat/rw",
  },
  {
    title: "Math",
    description: "2390 questions covering all topics",
    icon: <CalculatorIcon className="w-8 h-8 stroke-[1.5]" />,
    available: false,
    href: "#",
  },
];

export function DSATPracticeCards() {
  return (
    <section className="py-32 px-6 bg-[#fafafa] overflow-hidden relative selection:bg-neutral-200">
      {/* Subtle radial background gradient mimicking the soft light in the screenshots */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-[#fafafa] to-[#fafafa] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto relative z-10"
      >
        {/* Updated Heading to match the Serif aesthetic */}
        <motion.div variants={cardVariants} className="text-center mb-20">
          <h2 className="text-5xl md:text-[4rem] font-serif text-neutral-900 tracking-tight mb-6 leading-tight">
            Choose Your Practice.
          </h2>
          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto font-light leading-relaxed">
            Select a section to begin practicing with real exam-style questions.
            Track your progress, identify weaknesses, and achieve your target
            score.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {practiceAreas.map((area, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                scale: area.available ? 1.02 : 1,
                y: area.available ? -8 : 0,
                transition: { duration: 0.4, ease: customEase },
              }}
              className="h-full"
            >
              {/* Minimalist Cards with subtle borders and shadows */}
              <div
                className={`h-full p-10 md:p-12 rounded-[2.5rem] bg-white border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative flex flex-col items-center text-center ${
                  !area.available ? "opacity-60 grayscale-[50%]" : ""
                }`}
              >
                <div className="mb-8">
                  <div className="bg-neutral-50 p-5 rounded-full border border-neutral-100 text-neutral-800">
                    {area.icon}
                  </div>
                </div>

                <h3 className="text-3xl font-serif text-neutral-900 tracking-tight mb-3">
                  {area.title}
                </h3>
                <p className="text-neutral-500 font-light leading-relaxed mb-10 text-lg">
                  {area.description}
                </p>

                {area.available ? (
                  <button
                    onClick={() => (window.location.href = area.href)}
                    className="mt-auto w-full py-4 px-8 bg-[#111] hover:bg-black text-white rounded-full font-medium text-lg transition-all duration-300 shadow-md hover:shadow-xl focus:ring-4 focus:ring-neutral-200"
                  >
                    Start Practicing
                  </button>
                ) : (
                  <button
                    disabled
                    className="mt-auto w-full py-4 px-8 bg-neutral-100 text-neutral-400 rounded-full font-medium text-lg cursor-not-allowed border border-neutral-200"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={cardVariants}
          className="mt-20 text-center text-sm text-neutral-400 font-light"
        >
          <p>SAT® is a registered trademark of the College Board.</p>
          <p>
            This practice is not affiliated with or endorsed by the College
            Board.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
