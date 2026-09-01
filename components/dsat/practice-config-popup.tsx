"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

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

export function PracticeConfigPopup({
  isOpen,
  onClose,
  onStartPractice,
}: PracticeConfigPopupProps) {
  // Custom scrollbar styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 3px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a1a1aa; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
  const [showSkills, setShowSkills] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);

  // Load saved configuration from localStorage on mount. Only fall back to
  // "everything selected" when a field is genuinely missing (e.g. an older
  // saved config) — an intentionally empty selection the user saved earlier
  // should stay empty.
  useEffect(() => {
    const savedConfig = localStorage.getItem("practiceConfig");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setSelectedDifficulties(config.difficulties ?? allDifficulties);
        setSelectedDomains(config.domains ?? domains);
        // Filter out any skills that no longer exist in the current allSkills
        const savedSkills = config.skills ?? allSkills;
        const validSkills = savedSkills.filter((skill: string) =>
          allSkills.includes(skill),
        );
        setSelectedSkills(validSkills);
        setStatusFilter(config.statusFilter || "all");
        setAttemptFilter(config.attemptFilter || "all");
      } catch (e) {
        console.error(
          "Error parsing saved practice config, using defaults:",
          e,
        );
      }
    }
    setIsConfigLoaded(true);
  }, []);

  // Persist configuration whenever it changes — but not before the saved
  // config has actually been loaded, otherwise this fires once on mount
  // with default values and clobbers what was just read from storage.
  useEffect(() => {
    if (!isConfigLoaded) return;
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
    isConfigLoaded,
  ]);

  // Don't let a stale "Loading..." state carry over into the next time the
  // popup is opened.
  useEffect(() => {
    if (!isOpen) setIsStartingPractice(false);
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Debounced, cancellable fetch of the matching-question count. Debouncing
  // avoids firing a request on every single filter click, and the
  // AbortController stops an older, slower request from overwriting the
  // result of a newer one.
  useEffect(() => {
    if (!isConfigLoaded || !isOpen) return;

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoadingCount(true);
      setCountIsStale(false);

      const buildParams = (userId?: string) => {
        const params = new URLSearchParams();
        if (userId) params.append("userId", userId);
        selectedDomains.forEach((d) => params.append("domain", d));
        selectedSkills.forEach((s) => params.append("skill", s));
        if (selectedDifficulties.length > 0) {
          params.append("difficulty", selectedDifficulties.join(","));
        }
        return params;
      };

      try {
        const needsUserStats =
          attemptFilter !== "all" || statusFilter !== "all";
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
        if ((error as Error).name === "AbortError") return; // superseded by a newer request
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

  // Cancel any in-flight request if the component unmounts entirely.
  useEffect(() => () => abortRef.current?.abort(), []);

  const availableSkills = useMemo(
    () => selectedDomains.flatMap((d) => domainSkills[d] || []),
    [selectedDomains],
  );

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
                  Practice Configuration
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className={`p-2 hover:bg-zinc-100 rounded-full transition-colors ${FOCUS_RING}`}
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
              <div className="flex-1 overflow-y-auto custom-scrollbar relative z-30">
                <div
                  className="absolute inset-x-0 top-0 h-12 bg-white/80 backdrop-blur-md pointer-events-none"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 20%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, black 20%, transparent 100%)",
                  }}
                />

                <div className="px-6 pt-12 pb-8 space-y-8">
                  {/* Difficulty Filter */}
                  <FilterSection
                    label="Difficulty"
                    selectedCount={selectedDifficulties.length}
                    totalCount={allDifficulties.length}
                    onSelectAll={() => setSelectedDifficulties(allDifficulties)}
                    onClearAll={() => setSelectedDifficulties([])}
                  >
                    <div className="flex flex-wrap gap-2.5">
                      {allDifficulties.map((value) => (
                        <Pill
                          key={value}
                          selected={selectedDifficulties.includes(value)}
                          onClick={() =>
                            setSelectedDifficulties((prev) =>
                              toggleValue(prev, value),
                            )
                          }
                        >
                          {value}
                        </Pill>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Domain Filter */}
                  <FilterSection
                    label="Domain"
                    selectedCount={selectedDomains.length}
                    totalCount={domains.length}
                    onSelectAll={() => {
                      setSelectedDomains(domains);
                      setSelectedSkills(allSkills);
                    }}
                    onClearAll={() => {
                      setSelectedDomains([]);
                      setSelectedSkills([]);
                    }}
                  >
                    <div className="flex flex-wrap gap-2.5">
                      {domains.map((domain) => (
                        <Pill
                          key={domain}
                          selected={selectedDomains.includes(domain)}
                          onClick={() => toggleDomain(domain)}
                        >
                          {domain}
                        </Pill>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Skills Filter - grouped by domain as compact checkbox cards
                      instead of a second layer of expand/collapse, so opening
                      "Skills" shows everything at once without extra clicks. */}
                  {selectedDomains.length > 0 && (
                    <div className="flex flex-col gap-3.5">
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => setShowSkills(!showSkills)}
                          className={`flex items-center gap-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest hover:text-zinc-900 transition-colors rounded ${FOCUS_RING}`}
                        >
                          Skills
                          <span className="text-zinc-400 font-normal normal-case tracking-normal">
                            {selectedSkills.length}/{availableSkills.length}
                          </span>
                          <motion.div
                            animate={{ rotate: showSkills ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </button>
                        {showSkills && (
                          <div className="flex gap-3">
                            {selectedSkills.length !==
                              availableSkills.length && (
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
                        )}
                      </div>

                      <AnimatePresence>
                        {showSkills && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                              {selectedDomains.map((domain) => {
                                const domainSkillList =
                                  domainSkills[domain] || [];
                                if (domainSkillList.length === 0) return null;
                                const selectedInDomain = domainSkillList.filter(
                                  (s) => selectedSkills.includes(s),
                                ).length;

                                return (
                                  <div
                                    key={domain}
                                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                                        {domain}
                                      </span>
                                      <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                                        {selectedInDomain}/
                                        {domainSkillList.length}
                                      </span>
                                    </div>
                                    <div className="space-y-1.5">
                                      {domainSkillList.map((skill) => {
                                        const isSelected =
                                          selectedSkills.includes(skill);
                                        return (
                                          <button
                                            key={skill}
                                            onClick={() =>
                                              setSelectedSkills((prev) =>
                                                toggleValue(prev, skill),
                                              )
                                            }
                                            className={`flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-150 ${FOCUS_RING} ${
                                              isSelected
                                                ? "bg-zinc-900 text-white shadow-md"
                                                : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
                                            }`}
                                          >
                                            <div
                                              className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                                isSelected
                                                  ? "bg-white border-white"
                                                  : "border-zinc-300 bg-white"
                                              }`}
                                            >
                                              {isSelected && (
                                                <Check
                                                  className="w-3 h-3 text-zinc-900"
                                                  strokeWidth={3}
                                                />
                                              )}
                                            </div>
                                            {skill}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Performance Filter */}
                  <FilterSection label="Performance">
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { label: "All Questions", value: "all" },
                        { label: "Correct Only", value: "correct" },
                        { label: "Incorrect Only", value: "incorrect" },
                      ].map((item) => (
                        <Pill
                          key={item.value}
                          selected={statusFilter === item.value}
                          onClick={() => setStatusFilter(item.value)}
                        >
                          {item.label}
                        </Pill>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Attempt Filter */}
                  <FilterSection label="Attempt Status">
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { label: "All Questions", value: "all" },
                        { label: "Tried Only", value: "tried" },
                        { label: "Not Tried Only", value: "not-tried" },
                      ].map((item) => (
                        <Pill
                          key={item.value}
                          selected={attemptFilter === item.value}
                          onClick={() => setAttemptFilter(item.value)}
                        >
                          {item.label}
                        </Pill>
                      ))}
                    </div>
                  </FilterSection>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white border-t border-zinc-100 px-6 py-4 flex-shrink-0 relative z-10">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-[13px] font-medium text-zinc-500 transition-all duration-300">
                    {filteredCount === 0 && !isLoadingCount ? (
                      <span className="text-zinc-400">
                        No questions match these filters — try widening your
                        selection.
                      </span>
                    ) : (
                      <>
                        Showing{" "}
                        <span className="text-zinc-900 font-semibold bg-zinc-100 px-2 py-0.5 rounded-md mx-1">
                          {isLoadingCount ? "…" : filteredCount}
                        </span>{" "}
                        matching questions
                      </>
                    )}
                    {countIsStale && (
                      <span className="block text-[11px] text-amber-600 mt-0.5">
                        Couldn't refresh the count — showing an estimate.
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleStartPractice}
                    disabled={
                      isLoadingCount ||
                      filteredCount === 0 ||
                      isStartingPractice
                    }
                    className={`px-8 py-3 bg-zinc-900 text-white text-[13px] rounded-full font-medium shadow-md hover:bg-black transition-all duration-300 ease-out active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2 flex-shrink-0 ${FOCUS_RING}`}
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

function FilterSection({
  label,
  selectedCount,
  totalCount,
  onSelectAll,
  onClearAll,
  children,
}: {
  label: string;
  selectedCount?: number;
  totalCount?: number;
  onSelectAll?: () => void;
  onClearAll?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
          {label}
        </label>
        {(onSelectAll || onClearAll) && (
          <div className="flex gap-3">
            {onSelectAll &&
              selectedCount !== undefined &&
              totalCount !== undefined &&
              selectedCount !== totalCount && (
                <button
                  onClick={onSelectAll}
                  className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
                >
                  Select all
                </button>
              )}
            {onClearAll && selectedCount !== undefined && selectedCount > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Pill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ease-out active:scale-95 flex items-center justify-center ${FOCUS_RING} ${
        selected ? PILL_SELECTED : PILL_UNSELECTED
      }`}
    >
      {children}
    </button>
  );
}
