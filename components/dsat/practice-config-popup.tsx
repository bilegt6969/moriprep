"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface PracticeConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPractice: (config: PracticeConfig) => void;
}

interface PracticeConfig {
  difficulties: string[];
  domains: string[];
  skills: string[];
  statusFilter: string;
  attemptFilter: string;
}

const domainSkills: Record<string, string[]> = {
  "Information and Ideas": [
    "Central Ideas and Details",
    "Inferences",
    "Command of Evidence — Textual",
    "Command of Evidence — Quantitative",
  ],
  "Craft and Structure": [
    "Words in Context",
    "Text Structure and Purpose",
    "Cross-Text Connections",
  ],
  "Expression of Ideas": ["Rhetorical Synthesis", "Transitions"],
  "Standard English Convention": ["Boundaries", "Form Structure and Sense"],
};

const domains = Object.keys(domainSkills);

export function PracticeConfigPopup({
  isOpen,
  onClose,
  onStartPractice,
}: PracticeConfigPopupProps) {
  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #d4d4d8;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #a1a1aa;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([
    "Easy",
    "Medium",
    "Hard",
  ]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [attemptFilter, setAttemptFilter] = useState<string>("all");
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);
  const [isStartingPractice, setIsStartingPractice] = useState<boolean>(false);
  const [isConfigLoaded, setIsConfigLoaded] = useState<boolean>(false);

  // Load saved configuration from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("practiceConfig");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setSelectedDifficulties(
          config.difficulties || ["Easy", "Medium", "Hard"],
        );
        setSelectedDomains(config.domains || []);
        setSelectedSkills(config.skills || []);
        setStatusFilter(config.statusFilter || "all");
        setAttemptFilter(config.attemptFilter || "all");
      } catch (e) {
        console.error("Error parsing saved config:", e);
      }
    }
    setIsConfigLoaded(true);
  }, []);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    const config = {
      difficulties: selectedDifficulties,
      domains: selectedDomains,
      skills: selectedSkills,
      statusFilter,
      attemptFilter,
    };
    localStorage.setItem("practiceConfig", JSON.stringify(config));
  }, [
    selectedDifficulties,
    selectedDomains,
    selectedSkills,
    statusFilter,
    attemptFilter,
  ]);

  // Real-time filtering count from API with client-side attempt/status filtering
  useEffect(() => {
    // Don't fetch until config is loaded from localStorage
    if (!isConfigLoaded) return;

    const fetchFilteredCount = async () => {
      setIsLoadingCount(true);
      try {
        const params = new URLSearchParams();

        // Add difficulties as comma-separated
        if (selectedDifficulties.length > 0) {
          params.append("difficulty", selectedDifficulties.join(","));
        }

        // Add domains as comma-separated
        if (selectedDomains.length > 0) {
          params.append("domain", selectedDomains.join(","));
        }

        // Add skills as comma-separated
        if (selectedSkills.length > 0) {
          params.append("skill", selectedSkills.join(","));
        }

        // If we need to apply attempt/status filters, fetch full questions
        // Otherwise, just fetch count for performance
        const needsFullQuestions =
          attemptFilter === "tried" ||
          attemptFilter === "not-tried" ||
          statusFilter === "correct" ||
          statusFilter === "incorrect";

        if (needsFullQuestions) {
          params.append("limit", "10000"); // Fetch all matching questions
        } else {
          params.append("count_only", "true");
        }

        const response = await fetch(`/api/questions?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();

          let filteredCount = 0;

          if (needsFullQuestions) {
            // data is an array of questions
            const questions = Array.isArray(data) ? data : [];

            // Fetch user progress from Firebase
            const { auth, db } = await import("@/lib/firebase");
            const currentUser = auth?.currentUser;

            if (currentUser && db) {
              const userId = currentUser.uid;
              const { collection, getDocs, query, where } = await import(
                "firebase/firestore"
              );

              const q = query(
                collection(db, "userProgress"),
                where("userId", "==", userId),
              );
              const querySnapshot = await getDocs(q);

              const userProgressMap = new Map<string, { attempts: any[] }>();
              querySnapshot.forEach((doc: any) => {
                const data = doc.data();
                userProgressMap.set(data.questionId, {
                  attempts: data.attempts || [],
                });
              });

              // Apply attempt filter
              if (attemptFilter === "tried") {
                filteredCount = questions.filter((q: any) =>
                  userProgressMap.has(q.question_id),
                ).length;
              } else if (attemptFilter === "not-tried") {
                filteredCount = questions.filter(
                  (q: any) => !userProgressMap.has(q.question_id),
                ).length;
              } else {
                filteredCount = questions.length;
              }

              // Apply status filter
              if (statusFilter === "correct") {
                filteredCount = questions.filter((q: any) => {
                  const progress = userProgressMap.get(q.question_id);
                  if (
                    !progress ||
                    !progress.attempts ||
                    progress.attempts.length === 0
                  )
                    return false;
                  return progress.attempts.some(
                    (attempt: any) => attempt.isCorrect === true,
                  );
                }).length;
              } else if (statusFilter === "incorrect") {
                filteredCount = questions.filter((q: any) => {
                  const progress = userProgressMap.get(q.question_id);
                  if (
                    !progress ||
                    !progress.attempts ||
                    progress.attempts.length === 0
                  )
                    return false;
                  const hasIncorrect = progress.attempts.some(
                    (attempt: any) => attempt.isCorrect === false,
                  );
                  const hasCorrect = progress.attempts.some(
                    (attempt: any) => attempt.isCorrect === true,
                  );
                  return hasIncorrect && !hasCorrect;
                }).length;
              }
            } else {
              // User not authenticated or db not available, can't apply attempt/status filters
              if (
                attemptFilter === "tried" ||
                statusFilter === "correct" ||
                statusFilter === "incorrect"
              ) {
                filteredCount = 0;
              } else {
                filteredCount = questions.length;
              }
            }
          } else {
            // data is { count: number }
            filteredCount = data.count || 0;
          }

          setFilteredCount(filteredCount);
        }
      } catch (error) {
        console.error("Error fetching filtered count:", error);
        setFilteredCount(0);
      } finally {
        setIsLoadingCount(false);
      }
    };

    fetchFilteredCount();
  }, [
    selectedDifficulties,
    selectedDomains,
    selectedSkills,
    statusFilter,
    attemptFilter,
    isConfigLoaded,
  ]);

  const availableSkills =
    selectedDomains.length === 0
      ? []
      : selectedDomains.flatMap((d) => domainSkills[d] || []);

  const handleStartPractice = () => {
    setIsStartingPractice(true);
    // Add a small delay to show the loading state
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
              className="bg-white rounded-3xl shadow-2xl w-[600px] h-[700px] pointer-events-auto overflow-hidden flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between flex-shrink-0 relative z-10">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Practice Configuration
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              {/* Top scroll blur - fixed below header */}
              <div
                className="absolute inset-x-0 top-[68px] z-20 h-16 bg-white/90 backdrop-blur-xl pointer-events-none"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 30%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, black 30%, transparent 100%)",
                }}
              />

              {/* Content with blur effects */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {/* Top scroll blur */}
                <div
                  className="absolute inset-x-0 top-0 z-10 h-12 bg-white/80 backdrop-blur-md pointer-events-none"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 20%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, black 20%, transparent 100%)",
                  }}
                />

                <div className="px-6 pt-12 pb-8 space-y-8">
                  {/* Difficulty Filter */}
                  <div className="flex flex-col gap-3.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                        Difficulty
                      </label>
                      {selectedDifficulties.length > 0 && (
                        <button
                          onClick={() => setSelectedDifficulties([])}
                          className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { label: "Easy", value: "Easy" },
                        { label: "Medium", value: "Medium" },
                        { label: "Hard", value: "Hard" },
                      ].map((item) => {
                        const isSelected = selectedDifficulties.includes(
                          item.value,
                        );
                        return (
                          <button
                            key={item.value}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedDifficulties(
                                  selectedDifficulties.filter(
                                    (d) => d !== item.value,
                                  ),
                                );
                              } else {
                                setSelectedDifficulties([
                                  ...selectedDifficulties,
                                  item.value,
                                ]);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ease-out active:scale-95 flex items-center justify-center ${
                              isSelected
                                ? "bg-zinc-900 text-white shadow-md"
                                : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Domain Filter */}
                  <div className="flex flex-col gap-3.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                        Domain
                      </label>
                      {selectedDomains.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedDomains([]);
                            setSelectedSkills([]);
                          }}
                          className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {domains.map((domain) => {
                        const isSelected = selectedDomains.includes(domain);
                        return (
                          <button
                            key={domain}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedDomains(
                                  selectedDomains.filter((d) => d !== domain),
                                );
                                setSelectedSkills([]);
                              } else {
                                setSelectedDomains([
                                  ...selectedDomains,
                                  domain,
                                ]);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ease-out active:scale-95 flex items-center justify-center ${
                              isSelected
                                ? "bg-zinc-900 text-white shadow-md"
                                : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                            }`}
                          >
                            {domain}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skills Filter - only show if domains are selected */}
                  {selectedDomains.length > 0 && (
                    <div className="flex flex-col gap-3.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                          Skills
                        </label>
                        <div className="flex gap-3">
                          {selectedSkills.length !== availableSkills.length &&
                            availableSkills.length > 0 && (
                              <button
                                onClick={() =>
                                  setSelectedSkills(availableSkills)
                                }
                                className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
                              >
                                Select all
                              </button>
                            )}
                          {selectedSkills.length > 0 && (
                            <button
                              onClick={() => setSelectedSkills([])}
                              className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        {selectedDomains.map((domain) => {
                          const domainSkillList = domainSkills[domain] || [];
                          if (domainSkillList.length === 0) return null;

                          return (
                            <div key={domain} className="flex flex-col gap-2">
                              <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                                {domain}
                              </span>
                              <div className="flex flex-wrap gap-2.5">
                                {domainSkillList.map((skill) => {
                                  const isSelected =
                                    selectedSkills.includes(skill);
                                  return (
                                    <button
                                      key={skill}
                                      onClick={() => {
                                        if (isSelected) {
                                          setSelectedSkills(
                                            selectedSkills.filter(
                                              (s) => s !== skill,
                                            ),
                                          );
                                        } else {
                                          setSelectedSkills([
                                            ...selectedSkills,
                                            skill,
                                          ]);
                                        }
                                      }}
                                      className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ease-out active:scale-95 flex items-center justify-center ${
                                        isSelected
                                          ? "bg-zinc-900 text-white shadow-md"
                                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                                      }`}
                                    >
                                      {skill}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Performance Filter */}
                  <div className="flex flex-col gap-3.5">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                      Performance
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { label: "All Questions", value: "all" },
                        { label: "Correct Only", value: "correct" },
                        { label: "Incorrect Only", value: "incorrect" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setStatusFilter(item.value)}
                          className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ease-out active:scale-95 flex items-center justify-center ${
                            statusFilter === item.value
                              ? "bg-zinc-900 text-white shadow-md"
                              : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Attempt Filter */}
                  <div className="flex flex-col gap-3.5">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                      Attempt Status
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { label: "All Questions", value: "all" },
                        { label: "Tried Only", value: "tried" },
                        { label: "Not Tried Only", value: "not-tried" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setAttemptFilter(item.value)}
                          className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ease-out active:scale-95 flex items-center justify-center ${
                            attemptFilter === item.value
                              ? "bg-zinc-900 text-white shadow-md"
                              : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white border-t border-zinc-100 px-6 py-4 flex-shrink-0 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-medium text-zinc-500 transition-all duration-300">
                    Showing{" "}
                    <span className="text-zinc-900 font-semibold bg-zinc-100 px-2 py-0.5 rounded-md mx-1">
                      {isLoadingCount ? "..." : filteredCount}
                    </span>{" "}
                    matching questions
                  </div>
                  <button
                    onClick={handleStartPractice}
                    disabled={isLoadingCount || filteredCount === 0}
                    className="px-8 py-3 bg-zinc-900 text-white text-[13px] rounded-full font-medium shadow-md hover:bg-black transition-all duration-300 ease-out active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {isStartingPractice ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Start Practice"
                    )}
                  </button>
                </div>

                {/* Loading skeleton overlay */}
                {isStartingPractice && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-3 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
                      <p className="text-sm font-medium text-zinc-600">
                        Preparing your practice session...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
