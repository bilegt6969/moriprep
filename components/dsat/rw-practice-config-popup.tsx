"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RWPracticeConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPractice: (config: RWPracticeConfig) => void;
}

interface RWPracticeConfig {
  difficulties: string[];
  domains: string[];
  skills: string[];
  statusFilter: string;
  attemptFilter: string;
}

import { allSkills, domainSkills, domains } from "@/lib/dsat/domain-skills";
const allDifficulties = ["Easy", "Medium", "Hard"];
const DEFAULT_TOTAL_QUESTIONS = 1688;

const PILL_SELECTED = "bg-zinc-900 text-white shadow-md";
const PILL_UNSELECTED =
  "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700";
const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30 focus-visible:ring-offset-2";

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function dedupe<T>(list: T[]): T[] {
  return Array.from(new Set(list));
}

export function RWPracticeConfigPopup({
  isOpen,
  onClose,
  onStartPractice,
}: RWPracticeConfigPopupProps) {
  const [selectedDifficulties, setSelectedDifficulties] =
    useState<string[]>(allDifficulties);
  const [selectedDomains, setSelectedDomains] = useState<string[]>(domains);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(allSkills);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [attemptFilter, setAttemptFilter] = useState<string>("all");
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);
  const [countIsStale, setCountIsStale] = useState<boolean>(false);
  const [isStartingPractice, setIsStartingPractice] = useState<boolean>(false);
  const [isConfigLoaded, setIsConfigLoaded] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);

  // Load saved configuration from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("rwPracticeConfig");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setSelectedDifficulties(config.difficulties || allDifficulties);
        setSelectedDomains(config.domains || domains);
        setSelectedSkills(config.skills || allSkills);
        setStatusFilter(config.statusFilter || "all");
        setAttemptFilter(config.attemptFilter || "all");
      } catch (error) {
        console.error("Error loading saved config:", error);
      }
    }
    setIsConfigLoaded(true);
  }, []);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    if (isConfigLoaded) {
      const config = {
        difficulties: selectedDifficulties,
        domains: selectedDomains,
        skills: selectedSkills,
        statusFilter,
        attemptFilter,
      };
      localStorage.setItem("rwPracticeConfig", JSON.stringify(config));
    }
  }, [
    selectedDifficulties,
    selectedDomains,
    selectedSkills,
    statusFilter,
    attemptFilter,
    isConfigLoaded,
  ]);

  // Debounced filtered count fetcher
  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        setIsLoadingCount(true);
        setCountIsStale(false);

        const buildParams = (userId?: string) => {
          const params = new URLSearchParams();
          if (selectedDifficulties.length > 0) {
            params.set("difficulty", selectedDifficulties.join(","));
          }
          if (selectedDomains.length > 0) {
            params.set("domain", selectedDomains.join(","));
          }
          if (selectedSkills.length > 0) {
            params.set("skill", selectedSkills.join(","));
          }
          if (userId) {
            params.set("userId", userId);
          }
          if (statusFilter !== "all") {
            params.set("statusFilter", statusFilter);
          }
          if (attemptFilter !== "all") {
            params.set("attemptFilter", attemptFilter);
          }
          return params;
        };

        const needsUserStats =
          statusFilter !== "all" ||
          attemptFilter === "not-tried" ||
          attemptFilter === "tried";
        const hasContentFilters =
          selectedDomains.length > 0 ||
          selectedSkills.length > 0 ||
          selectedDifficulties.length > 0;

        if (needsUserStats) {
          const { auth } = await import("@/lib/firebase");
          const userId = auth?.currentUser?.uid;

          if (!userId) {
            setFilteredCount(0);
            return;
          }

          const needsGlobalTotal = attemptFilter === "not-tried";
          const [userResponse, globalResponse] = await Promise.all([
            fetch(`/api/question-stats?${buildParams(userId).toString()}`, {
              signal: controller.signal,
            }),
            needsGlobalTotal
              ? fetch(`/api/question-stats?${buildParams().toString()}`, {
                  signal: controller.signal,
                })
              : Promise.resolve(null),
          ]);

          if (!userResponse.ok)
            throw new Error("Failed to load question stats");
          const userData = await userResponse.json();

          let count = userData.answered || 0;
          if (attemptFilter === "not-tried") {
            const globalData =
              globalResponse && globalResponse.ok
                ? await globalResponse.json()
                : {};
            const totalAvailable =
              globalData.count ?? globalData.total ?? DEFAULT_TOTAL_QUESTIONS;
            const finalCount = totalAvailable - count;
            setFilteredCount(Math.max(0, finalCount));
          } else {
            if (statusFilter === "correct") count = userData.correct || 0;
            else if (statusFilter === "incorrect")
              count = userData.incorrect || 0;
            setFilteredCount(Math.max(0, count));
          }
        } else if (hasContentFilters) {
          const response = await fetch(
            `/api/question-stats?${buildParams().toString()}`,
            {
              signal: controller.signal,
            },
          );
          if (!response.ok) throw new Error("Failed to load question stats");
          const data = await response.json();
          setFilteredCount(data.count ?? data.total ?? DEFAULT_TOTAL_QUESTIONS);
        } else {
          setFilteredCount(DEFAULT_TOTAL_QUESTIONS);
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Error fetching filtered count:", error);
        setCountIsStale(true);
        setFilteredCount(DEFAULT_TOTAL_QUESTIONS);
      } finally {
        setIsLoadingCount(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    selectedDifficulties,
    selectedDomains,
    selectedSkills,
    statusFilter,
    attemptFilter,
    isConfigLoaded,
    isOpen,
  ]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const toggleDomain = (domain: string) => {
    const domainSkillList = domainSkills[domain] || [];
    if (selectedDomains.includes(domain)) {
      setSelectedDomains((prev) => prev.filter((d) => d !== domain));
      setSelectedSkills((prev) =>
        prev.filter((s) => !domainSkillList.includes(s)),
      );
    } else {
      setSelectedDomains((prev) => [...prev, domain]);
      setSelectedSkills((prev) => dedupe([...prev, ...domainSkillList]));
    }
  };

  const handleStartPractice = () => {
    setIsStartingPractice(true);
    setTimeout(() => {
      onStartPractice({
        difficulties: selectedDifficulties,
        domains: selectedDomains,
        skills: selectedSkills,
        statusFilter,
        attemptFilter,
      });
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.4,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Practice configuration"
              className="bg-white rounded-3xl shadow-2xl w-[600px] max-w-full h-[700px] max-h-[90vh] pointer-events-auto overflow-hidden flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between flex-shrink-0 relative z-10">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Reading & Writing Practice Configuration
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className={`p-2 hover:bg-zinc-100 rounded-full transition-colors ${FOCUS_RING}`}
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              {/* Top scroll blur */}
              <div
                className="absolute inset-x-0 top-[60px] z-20 h-16 bg-white/90 backdrop-blur-xl pointer-events-none"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 30%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, black 30%, transparent 100%)",
                }}
              />

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pt-6 px-6 pb-4">
                {/* Difficulty */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-700 mb-3">
                    Difficulty
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allDifficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() =>
                          setSelectedDifficulties((prev) =>
                            toggleValue(prev, difficulty),
                          )
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${FOCUS_RING} ${
                          selectedDifficulties.includes(difficulty)
                            ? PILL_SELECTED
                            : PILL_UNSELECTED
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Domains */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-700 mb-3">
                    Domains
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {domains.map((domain) => (
                      <button
                        key={domain}
                        onClick={() => toggleDomain(domain)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${FOCUS_RING} ${
                          selectedDomains.includes(domain)
                            ? PILL_SELECTED
                            : PILL_UNSELECTED
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-zinc-700">
                      Skills
                    </label>
                    {selectedDomains.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const allSkills = selectedDomains.flatMap(
                              (d) => domainSkills[d] || [],
                            );
                            setSelectedSkills(allSkills);
                          }}
                          className="text-xs text-zinc-600 hover:text-zinc-900 underline"
                        >
                          Select all
                        </button>
                        <button
                          onClick={() => setSelectedSkills([])}
                          className="text-xs text-zinc-600 hover:text-zinc-900 underline"
                        >
                          Deselect all
                        </button>
                      </div>
                    )}
                  </div>
                  {selectedDomains.length === 0 ? (
                    <p className="text-sm text-zinc-500 italic">
                      Select domains to see skills
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {selectedDomains.map((domain) => {
                        const domainSkillList = domainSkills[domain] || [];
                        if (domainSkillList.length === 0) return null;
                        return (
                          <div key={domain}>
                            <div className="text-xs font-semibold text-zinc-600 mb-2 uppercase tracking-wide">
                              {domain}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {domainSkillList.map((skill) => (
                                <button
                                  key={skill}
                                  onClick={() =>
                                    setSelectedSkills((prev) =>
                                      toggleValue(prev, skill),
                                    )
                                  }
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${FOCUS_RING} ${
                                    selectedSkills.includes(skill)
                                      ? PILL_SELECTED
                                      : PILL_UNSELECTED
                                  }`}
                                >
                                  {skill}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-700 mb-3">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "all", label: "All" },
                      { value: "correct", label: "Correct" },
                      { value: "incorrect", label: "Incorrect" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStatusFilter(option.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${FOCUS_RING} ${
                          statusFilter === option.value
                            ? PILL_SELECTED
                            : PILL_UNSELECTED
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attempt Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-700 mb-3">
                    Attempted
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "all", label: "All" },
                      { value: "not-tried", label: "Not Tried" },
                      { value: "tried", label: "Tried" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setAttemptFilter(option.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${FOCUS_RING} ${
                          attemptFilter === option.value
                            ? PILL_SELECTED
                            : PILL_UNSELECTED
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white border-t border-zinc-100 px-6 py-4 flex-shrink-0 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-zinc-600">
                    {isLoadingCount ? (
                      <span>Loading...</span>
                    ) : (
                      <>
                        <span className="font-medium text-zinc-900">
                          {filteredCount.toLocaleString()}
                        </span>{" "}
                        questions available
                        {countIsStale && (
                          <span className="text-amber-600 ml-2">
                            (estimate)
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleStartPractice}
                  disabled={isStartingPractice || filteredCount === 0}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    isStartingPractice || filteredCount === 0
                      ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                      : "bg-zinc-900 text-white hover:bg-zinc-800"
                  }`}
                >
                  {isStartingPractice ? "Starting..." : "Start Practice"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
