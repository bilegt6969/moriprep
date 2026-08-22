"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "hooks/use-reduced-motion";
import { ChevronRight, LockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { PracticeConfigPopup } from "./practice-config-popup";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

// Updated data structure to match the new dashboard aesthetic
const practiceAreas = [
  {
    id: "reading-writing",
    title: "Reading & Writing",
    greeting: "Ready to practice?",
    questions: "Loading...",
    focus: "4 Domains",
    description: "Our system adapts to your reading comprehension level.",
    color: "bg-[#FFC800]", // Matching the yellow from the reference
    textColor: "text-neutral-900",
    available: true,
    buttonText: "Start Practicing",
  },
  {
    id: "math",
    title: "Mathematics",
    greeting: "Expert problem sets",
    questions: "2,390",
    focus: "Advanced Algebra",
    description: "Enter any topic, and we'll supply the perfect problem set.",
    color: "bg-[#7DD3FC]", // Matching the blue from the reference
    textColor: "text-neutral-900",
    available: false,
    buttonText: "Coming Soon",
  },
];

export function DSATPracticeCards() {
  const reduce = useReducedMotion();
  const [isConfigPopupOpen, setIsConfigPopupOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [practiceAreas, setPracticeAreas] = useState(practiceAreas);

  useEffect(() => {
    setIsMounted(true);
    // Fetch total questions from Firebase stats
    fetch("/api/question-stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.total) {
          setTotalQuestions(data.total);
          // Update the practice areas with the actual count
          setPracticeAreas((prev) => {
            const updated = [...prev];
            updated[0].questions = data.total.toLocaleString();
            return updated;
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching question stats:", error);
      });
  }, []);

  const handleStartPractice = (config: any) => {
    const params = new URLSearchParams();

    if (config.difficulties.length > 0) {
      params.set("difficulties", config.difficulties.join(","));
    }
    if (config.domains.length > 0) {
      params.set("domains", config.domains.join(","));
    }
    if (config.skills.length > 0) {
      params.set("skills", config.skills.join(","));
    }
    if (config.statusFilter && config.statusFilter !== "all") {
      params.set("statusFilter", config.statusFilter);
    }
    if (config.attemptFilter && config.attemptFilter !== "all") {
      params.set("attemptFilter", config.attemptFilter);
    }

    const queryString = params.toString();
    const url = `/practice/rw${queryString ? `?${queryString}` : ""}`;
    window.location.href = url;
  };

  return (
    <>
      {/* Pure white background as requested */}
      <section className="min-h-screen w-full px-4 py-12 md:px-8 lg:px-12 bg-white relative font-sans">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-2">
            Practice Overview
          </h1>
          <p className="text-neutral-500 text-lg">
            Choose your domain and start improving today.
          </p>
        </motion.div>

        {/* Dashboard Cards Container */}
        <motion.div
          variants={containerVariants}
          initial={isMounted ? "hidden" : "visible"}
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto flex flex-col gap-4 md:gap-6"
        >
          {practiceAreas.map((area) => (
            <motion.div
              key={area.id}
              variants={slideUp}
              className={`w-full ${area.color} rounded-[32px] p-8 md:p-10 relative overflow-hidden transition-transform duration-300 ${
                !reduce && area.available ? "hover:scale-[1.01]" : ""
              }`}
              suppressHydrationWarning
            >
              <div className="flex flex-col md:flex-row justify-between h-full gap-8 md:gap-4 relative z-10">
                {/* Left Side: Headers and Stats */}
                <div className="flex flex-col justify-between h-full min-h-[160px]">
                  <div>
                    <h3
                      className={`text-lg md:text-xl font-medium mb-1 opacity-80 ${area.textColor}`}
                    >
                      {area.greeting}
                    </h3>
                    <h2
                      className={`text-4xl md:text-5xl font-bold tracking-tight ${area.textColor}`}
                    >
                      {area.title}
                    </h2>
                  </div>

                  {/* Stats Row - Mimicking the "Total holding" layout */}
                  <div className="flex gap-12 mt-12">
                    <div>
                      <p
                        className={`text-sm mb-1 opacity-70 ${area.textColor}`}
                      >
                        Total questions
                      </p>
                      <p
                        className={`text-2xl font-semibold tracking-tight ${area.textColor}`}
                      >
                        {area.questions}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-sm mb-1 opacity-70 ${area.textColor}`}
                      >
                        Focus area
                      </p>
                      <p
                        className={`text-2xl font-semibold tracking-tight ${area.textColor}`}
                      >
                        {area.focus}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Action Button */}
                <div className="flex flex-col justify-end items-start md:items-end">
                  <p
                    className={`hidden md:block max-w-[240px] text-right mb-6 text-sm opacity-80 ${area.textColor}`}
                  >
                    {area.description}
                  </p>

                  {area.available ? (
                    <button
                      onClick={() => setIsConfigPopupOpen(true)}
                      className="group flex items-center gap-2 bg-white/20 hover:bg-white/30 text-neutral-900 px-6 py-3 rounded-full font-semibold transition-all backdrop-blur-sm"
                    >
                      {area.buttonText}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-black/5 text-neutral-900/50 px-6 py-3 rounded-full font-semibold cursor-not-allowed">
                      <LockIcon className="w-4 h-4" />
                      {area.buttonText}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <PracticeConfigPopup
        isOpen={isConfigPopupOpen}
        onClose={() => setIsConfigPopupOpen(false)}
        onStartPractice={handleStartPractice}
      />
    </>
  );
}
