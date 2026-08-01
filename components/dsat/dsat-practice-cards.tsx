"use client";

import { motion } from "framer-motion";
import { BookOpenIcon, CalculatorIcon, LockIcon } from "lucide-react";
import Link from "next/link";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: customEase },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: customEase },
  },
};

const practiceAreas = [
  {
    id: "reading-writing",
    title: "Reading & Writing",
    description: "1,492 questions spanning all four College Board domains.",
    icon: <BookOpenIcon className="w-7 h-7 stroke-[1.5]" />,
    available: true,
    href: "/practice/rw",
    buttonText: "Start Practicing",
  },
  {
    id: "math",
    title: "Mathematics",
    description: "2,390 questions covering advanced algebra and data analysis.",
    icon: <CalculatorIcon className="w-7 h-7 stroke-[1.5]" />,
    available: false,
    href: "#",
    buttonText: "Coming Soon",
  },
];

export function DSATPracticeCards() {
  return (
    <section className="py-32 px-6 bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-200 selection:text-neutral-900 relative overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto relative z-10"
      >
        {/* Modern Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {practiceAreas.map((area) => (
            <motion.div
              key={area.id}
              variants={scaleIn}
              whileHover={area.available ? { y: -6 } : { y: 0 }}
              transition={{ duration: 0.5, ease: customEase }}
              className="h-full"
            >
              <div
                className={`h-full flex flex-col p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 ${
                  area.available
                    ? "bg-white border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-neutral-300"
                    : "bg-white/40 backdrop-blur-xl border-neutral-200/40 shadow-sm"
                }`}
              >
                {/* Top: Lightest Visual Weight */}
                <div className="flex items-start justify-between mb-10">
                  <div
                    className={`p-4 rounded-2xl transition-colors duration-300 flex items-center justify-center ${
                      area.available
                        ? "bg-neutral-50 text-neutral-900 shadow-inner"
                        : "bg-white/50 text-neutral-400"
                    }`}
                  >
                    {area.icon}
                  </div>
                  <span className="text-2xl font-medium text-neutral-300 font-mono tracking-tighter">
                    {area.id === "reading-writing" ? "01" : "02"}
                  </span>
                </div>

                {/* Middle: Medium Visual Weight */}
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4 text-neutral-900">
                    {area.title}
                  </h3>
                  <p className="text-neutral-500 text-base leading-relaxed">
                    {area.description}
                  </p>
                </div>

                {/* Bottom: Heaviest Visual Weight (Anchors the card) */}
                <div className="mt-10 pt-8 border-t border-neutral-100">
                  {area.available ? (
                    <Link
                      href={area.href}
                      className="w-full inline-flex items-center justify-center px-8 py-4 bg-neutral-900 text-white rounded-full font-medium text-base transition-all duration-300 hover:bg-black hover:shadow-xl hover:shadow-black/10 active:scale-[0.98]"
                    >
                      {area.buttonText}
                    </Link>
                  ) : (
                    <div className="w-full inline-flex items-center justify-center px-8 py-4 bg-white/50 text-neutral-400 rounded-full font-medium text-base border border-neutral-200/80 gap-2 cursor-not-allowed">
                      <LockIcon className="w-4 h-4" />
                      {area.buttonText}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
