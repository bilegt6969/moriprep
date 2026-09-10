"use client";

import { MathPracticeConfigPopup } from "@/components/dsat/math-practice-config-popup";
import { RWPracticeConfigPopup } from "@/components/dsat/rw-practice-config-popup";
import { motion } from "framer-motion";
import { useReducedMotion } from "hooks/use-reduced-motion";
import { ArrowRight, BookOpen, Calculator } from "lucide-react";
import { useEffect, useState } from "react";

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

export function DSATPracticeCards() {
  const reduce = useReducedMotion();
  const [isRWConfigPopupOpen, setIsRWConfigPopupOpen] = useState(false);
  const [isMathConfigPopupOpen, setIsMathConfigPopupOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [rwQuestions, setRwQuestions] = useState("Loading...");
  const [mathQuestions, setMathQuestions] = useState("Loading...");

  useEffect(() => {
    setIsMounted(true);
    Promise.all([
      fetch("/api/question-stats").then((res) => res.json()),
      fetch("/api/question-stats?test=Math").then((res) => res.json()),
    ])
      .then(([rwData, mathData]) => {
        if (rwData.total) {
          setRwQuestions(rwData.total.toLocaleString());
        }
        if (mathData.total || mathData.count) {
          setMathQuestions((mathData.total || mathData.count).toLocaleString());
        }
      })
      .catch((error) => {
        console.error("Error fetching question stats:", error);
      });
  }, []);

  const handleStartRWPractice = (config: any) => {
    const params = new URLSearchParams();

    if (config.difficulties.length > 0)
      params.set("difficulties", config.difficulties.join(","));
    if (config.domains.length > 0)
      params.set("domains", config.domains.join(","));
    if (config.skills.length > 0) params.set("skills", config.skills.join(","));
    if (config.statusFilter && config.statusFilter !== "all")
      params.set("statusFilter", config.statusFilter);
    if (config.attemptFilter && config.attemptFilter !== "all")
      params.set("attemptFilter", config.attemptFilter);

    const queryString = params.toString();
    const url = `/practice/rw${queryString ? `?${queryString}` : ""}`;
    window.location.href = url;
  };

  const handleStartMathPractice = (config: any) => {
    const params = new URLSearchParams();

    if (config.difficulties.length > 0)
      params.set("difficulties", config.difficulties.join(","));
    if (config.domains.length > 0)
      params.set("domains", config.domains.join(","));
    if (config.skills.length > 0) params.set("skills", config.skills.join(","));
    if (config.statusFilter && config.statusFilter !== "all")
      params.set("statusFilter", config.statusFilter);
    if (config.attemptFilter && config.attemptFilter !== "all")
      params.set("attemptFilter", config.attemptFilter);

    const queryString = params.toString();
    const url = `/practice/math${queryString ? `?${queryString}` : ""}`;
    window.location.href = url;
  };

  return (
    <>
      <section className="min-h-screen w-full px-4 py-8 md:px-8 lg:px-12 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-8"
          >
            Practice, learn, review. All in one place.
          </motion.h1>

          {/* Two Main Cards */}
          <motion.div
            variants={containerVariants}
            initial={isMounted ? "hidden" : "visible"}
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Reading & Writing Card */}
            <motion.div
              variants={slideUp}
              className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-8 shadow-lg text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Reading & Writing</h2>
              </div>

              <div className="mb-6">
                <p className="text-blue-100 text-sm mb-2">Total Questions</p>
                <p className="text-4xl font-bold">{rwQuestions}</p>
              </div>

              <p className="text-blue-100 mb-8 flex-1">
                Master reading comprehension with adaptive questions across 4
                domains: Information and Ideas, Craft and Structure, Standard
                English Conventions, and Expression of Ideas.
              </p>

              <button
                onClick={() => setIsRWConfigPopupOpen(true)}
                className="group flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all"
              >
                Start Practicing
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>

            {/* Math Card */}
            <motion.div
              variants={slideUp}
              className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-8 shadow-lg text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Mathematics</h2>
              </div>

              <div className="mb-6">
                <p className="text-purple-100 text-sm mb-2">Total Questions</p>
                <p className="text-4xl font-bold">{mathQuestions}</p>
              </div>

              <p className="text-purple-100 mb-8 flex-1">
                Tackle complex math problems with our advanced problem sets
                covering Algebra, Advanced Math, Geometry, Statistics, and Data
                Analysis.
              </p>

              <button
                onClick={() => setIsMathConfigPopupOpen(true)}
                className="group flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all"
              >
                Start Practicing
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <RWPracticeConfigPopup
        isOpen={isRWConfigPopupOpen}
        onClose={() => setIsRWConfigPopupOpen(false)}
        onStartPractice={handleStartRWPractice}
      />
      <MathPracticeConfigPopup
        isOpen={isMathConfigPopupOpen}
        onClose={() => setIsMathConfigPopupOpen(false)}
        onStartPractice={handleStartMathPractice}
      />
    </>
  );
}
