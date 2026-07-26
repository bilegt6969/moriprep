"use client";

import { motion } from "framer-motion";
import { Check, ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const customEase = [0.16, 1, 0.3, 1] as const;

const domains = [
  "Craft and Structure",
  "Information and Ideas",
  "Standard English Conventions",
  "Expression of Ideas",
];

const difficulties = [
  {
    id: "Easy",
    label: "Easy",
    description: "Build confidence with foundational concepts",
  },
  {
    id: "Medium",
    label: "Medium",
    description: "Challenge yourself with intermediate problems",
  },
  {
    id: "Hard",
    label: "Hard",
    description: "Test your mastery with complex questions",
  },
];

export default function RWSetupPage() {
  const router = useRouter();
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    [],
  );

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev: string[]) =>
      prev.includes(domain)
        ? prev.filter((d: string) => d !== domain)
        : [...prev, domain],
    );
  };

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties((prev: string[]) =>
      prev.includes(difficulty)
        ? prev.filter((d: string) => d !== difficulty)
        : [...prev, difficulty],
    );
  };

  const handleStartPractice = () => {
    const params = new URLSearchParams();
    if (selectedDomains.length > 0) {
      params.set("domains", selectedDomains.join(","));
    }
    if (selectedDifficulties.length > 0) {
      params.set("difficulties", selectedDifficulties.join(","));
    }
    router.push(`/dsat/rw?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-white to-neutral-50">
      {/* Header */}
      <header className="px-6 py-6">
        <Link
          href="/dsat/rw"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-black transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          Back to Practice
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: customEase }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: customEase, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-6"
          >
            <Sparkles className="w-8 h-8 text-neutral-600" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
            Customize Your Practice
          </h1>
          <p className="text-lg text-neutral-500 max-w-md mx-auto">
            Select the domains and difficulty level to focus your practice
            session.
          </p>
        </motion.div>

        {/* Section: Domains */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: customEase, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
            Select Domains
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domains.map((domain) => (
              <motion.button
                key={domain}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDomain(domain)}
                className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedDomains.includes(domain)
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                {selectedDomains.includes(domain) && (
                  <div className="absolute top-4 right-4">
                    <Check className="w-5 h-5" />
                  </div>
                )}
                <span className="font-medium">{domain}</span>
              </motion.button>
            ))}
          </div>
          {selectedDomains.length === 0 && (
            <p className="text-sm text-neutral-400 mt-3">
              Leave empty to practice all domains
            </p>
          )}
        </motion.div>

        {/* Section: Difficulty */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: customEase, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
            Select Difficulty
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficulties.map((diff) => (
              <motion.button
                key={diff.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDifficulty(diff.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedDifficulties.includes(diff.id)
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                {selectedDifficulties.includes(diff.id) && (
                  <div className="absolute top-4 right-4">
                    <Check className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <span className="font-semibold block mb-2">{diff.label}</span>
                  <span className="text-sm opacity-80">{diff.description}</span>
                </div>
              </motion.button>
            ))}
          </div>
          {selectedDifficulties.length === 0 && (
            <p className="text-sm text-neutral-400 mt-3">
              Leave empty to practice all difficulty levels
            </p>
          )}
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: customEase, delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartPractice}
            className="inline-flex items-center justify-center px-12 py-4 rounded-full bg-black text-white font-semibold text-lg hover:bg-neutral-800 transition-all shadow-xl shadow-black/10"
          >
            Start Practice Session
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
