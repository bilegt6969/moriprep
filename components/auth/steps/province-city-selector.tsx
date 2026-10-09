"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { OnboardingData } from "../onboarding-flow";

const ChevronRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const XIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// Phonetic matching for Mongolian search
const KEY_CYR = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "i",
  ё: "o",
  ж: "j",
  з: "z",
  и: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  ө: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ү: "u",
  ф: "f",
  х: "h",
  ц: "Z",
  ч: "C",
  ш: "S",
  щ: "S",
  ъ: "",
  ы: "i",
  ь: "",
  э: "i",
  ю: "u",
  я: "a",
};

function phon(text: string): string {
  let t = String(text).toLowerCase().replace(/ü/g, "u").replace(/ö/g, "o");
  if (/[а-яёөү]/.test(t)) {
    t = [...t]
      .map((c) => (c in KEY_CYR ? KEY_CYR[c as keyof typeof KEY_CYR] : c))
      .join("");
  } else {
    for (const [a, b] of [
      ["kh", "h"],
      ["zh", "j"],
      ["sh", "S"],
      ["ch", "C"],
      ["ts", "Z"],
      ["tz", "Z"],
      ["c", "Z"],
      ["x", "h"],
      ["w", "v"],
      ["yu", "u"],
      ["ya", "a"],
      ["yo", "o"],
      ["ye", "e"],
      ["iu", "u"],
      ["ia", "a"],
      ["oe", "o"],
    ])
      t = t.split(a).join(b);
    t = t.replace(/y/g, "i").replace(/e/g, "i");
  }
  t = t.replace(/[^a-zA-Z0-9\s]/g, " ").replace(/([a-zA-Z])\1+/g, "$1");
  return t.replace(/\s+/g, " ").trim();
}

function editDist1(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0,
    j = 0,
    edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function searchSchools(
  schools: School[],
  query: string,
  {
    district = null,
    limit = 20,
  }: { district?: string | null; limit?: number } = {},
): School[] {
  const GENERIC = new Set(["sCol", "surgul", "surguli", "ibs"]); // school, surguul, ebs
  const all = phon(query).split(" ").filter(Boolean);
  const filtered = all.filter((t) => !GENERIC.has(t));
  const qTokens = filtered.length ? filtered : all;

  console.log("Search query:", query, "Phonetic tokens:", qTokens);
  if (!qTokens.length) return [];
  const results: { school: School; score: number }[] = [];
  for (const s of schools) {
    const keys = s.phonetic || [];
    let score = 0;
    let matchedAny = false;

    for (const q of qTokens) {
      let best = 0;
      for (const k of keys) {
        if (k === q) {
          best = 3;
          break;
        }
        if (k.startsWith(q)) best = Math.max(best, 2);
        else if (q.length >= 4 && k.length >= 4 && editDist1(q, k))
          best = Math.max(best, 1.5);
        else if (q.length >= 3 && k.includes(q)) best = Math.max(best, 1);
      }
      if (best > 0) {
        matchedAny = true;
        score += best;
      }
    }

    // Only include schools that matched at least one token
    if (!matchedAny) continue;

    const corePhon = phon(s.core || "");
    if (corePhon && corePhon.includes(qTokens.join(" "))) score += 4;
    if (s.number != null && qTokens.includes(String(s.number))) score += 3;
    if (district && s.parentName === district) score += 5;
    results.push({ school: s, score });
  }
  console.log("Search results count:", results.length);
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.school);
}

const customEase = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

interface School {
  id: string;
  name: string;
  nameLatin: string;
  parentId: string;
  parentName: string;
  number?: number | null;
  aliases: string[];
  searchText: string;
  core?: string;
  coreLatin?: string;
  phonetic?: string[];
}

interface LocationWithCount {
  name: string; // internal key ("Ulaanbaatar" or "Булган аймаг")
  displayName: string;
  count: number;
  type: "city" | "aimag" | "other";
}

interface ProvinceCitySelectorProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ProvinceCitySelector({
  data,
  updateData,
  onNext,
  onBack,
}: ProvinceCitySelectorProps) {
  const [locations, setLocations] = useState<LocationWithCount[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [allSchools, setAllSchools] = useState<School[]>([]);

  // Selected values
  const [selectedLocation, setSelectedLocation] = useState(
    data.parentName || "",
  );
  const [selectedSchool, setSelectedSchool] = useState(data.school || "");
  const [grade, setGrade] = useState(data.grade || "");
  const [classLetter, setClassLetter] = useState(data.classLetter || "");
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [locationSearch, setLocationSearch] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingSchool, setIsEditingSchool] = useState(false);

  const locationInputRef = useRef<HTMLInputElement>(null);
  const schoolInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const schoolDropdownRef = useRef<HTMLDivElement>(null);

  // ---------- Load data ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/schools_enriched_v4.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();

        // Safety check: ensure the file has phonetic data
        if (!jsonData.schools[0]?.phonetic) {
          console.error("Loaded JSON has no phonetic field – wrong/old file!");
        }

        console.log("Loaded schools:", jsonData.schools.length);
        console.log("First school name:", jsonData.schools[0]?.name);
        console.log("First school phonetic:", jsonData.schools[0]?.phonetic);
        console.log(
          "First school parentName:",
          jsonData.schools[0]?.parentName,
        );
        setAllSchools(jsonData.schools);

        // Count schools per parent
        const locationCounts = new Map<string, number>();
        jsonData.schools.forEach((school: School) => {
          locationCounts.set(
            school.parentName,
            (locationCounts.get(school.parentName) || 0) + 1,
          );
        });

        // Group all дүүрэг under "Ulaanbaatar"
        let ulaanbaatarCount = 0;
        const locationList: LocationWithCount[] = [];

        Array.from(locationCounts.entries()).forEach(([name, count]) => {
          if (name.includes("дүүрэг")) {
            ulaanbaatarCount += count;
          } else if (name === "Бусад") {
            locationList.push({
              name,
              displayName: "Бусад",
              count,
              type: "other",
            });
          } else {
            // Aimags – keep original Mongolian name
            locationList.push({
              name,
              displayName: name,
              count,
              type: "aimag",
            });
          }
        });

        // Add Ulaanbaatar at the top
        if (ulaanbaatarCount > 0) {
          locationList.unshift({
            name: "Ulaanbaatar",
            displayName: "Ulaanbaatar",
            count: ulaanbaatarCount,
            type: "city",
          });
        }

        // Sort: Ulaanbaatar first → aimags alphabetically → Бусад last
        locationList.sort((a, b) => {
          if (a.type === "city") return -1;
          if (b.type === "city") return 1;
          if (a.type === "other") return 1;
          if (b.type === "other") return -1;
          return a.displayName.localeCompare(b.displayName, "mn");
        });

        setLocations(locationList);

        // Restore previous selection
        if (data.parentName) {
          if (
            data.parentName.includes("дүүрэг") ||
            data.parentName === "Ulaanbaatar"
          ) {
            setSelectedLocation("Ulaanbaatar");
          } else {
            setSelectedLocation(data.parentName);
          }
        } else {
          // Default to Ulaanbaatar
          setSelectedLocation("Ulaanbaatar");
          updateData({ parentName: "Ulaanbaatar" });
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------- Filter schools when location changes ----------
  useEffect(() => {
    if (!selectedLocation || allSchools.length === 0) {
      setFilteredSchools([]);
      return;
    }

    let locationSchools: School[];

    if (selectedLocation === "Ulaanbaatar") {
      locationSchools = allSchools.filter((s) =>
        s.parentName.includes("дүүрэг"),
      );
    } else {
      locationSchools = allSchools.filter(
        (s) => s.parentName === selectedLocation,
      );
    }

    setFilteredSchools(locationSchools);
  }, [selectedLocation, allSchools]);

  // ---------- Click outside to close ----------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
        setIsEditingLocation(false);
      }
      if (
        schoolDropdownRef.current &&
        !schoolDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSchoolDropdown(false);
        setIsEditingSchool(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------- Handlers ----------
  const handleLocationSelect = (location: LocationWithCount) => {
    setSelectedLocation(location.name);
    setSelectedSchool("");
    setSchoolSearch("");
    setGrade("");
    setClassLetter("");
    setIsEditingLocation(false);
    setShowLocationDropdown(false);
    setIsEditingSchool(false);
    updateData({
      parentName: location.name,
      school: "",
      grade: "",
      classLetter: "",
    });
  };

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school.name);
    setSchoolSearch("");
    setGrade("");
    setClassLetter("");
    setIsEditingSchool(false);
    setShowSchoolDropdown(false);
    updateData({ school: school.name, grade: "", classLetter: "" });
  };

  const startEditingLocation = () => {
    setIsEditingLocation(true);
    setLocationSearch("");
    setShowLocationDropdown(true);
    setTimeout(() => locationInputRef.current?.focus(), 50);
  };

  const startEditingSchool = () => {
    setIsEditingSchool(true);
    setSchoolSearch("");
    setShowSchoolDropdown(true);
    setTimeout(() => schoolInputRef.current?.focus(), 50);
  };

  const clearLocation = () => {
    setSelectedLocation("");
    setSelectedSchool("");
    setSchoolSearch("");
    setIsEditingLocation(true);
    setShowLocationDropdown(true);
    updateData({ parentName: "", school: "" });
    setTimeout(() => locationInputRef.current?.focus(), 50);
  };

  const clearSchool = () => {
    setSelectedSchool("");
    setSchoolSearch("");
    setGrade("");
    setClassLetter("");
    setIsEditingSchool(true);
    setShowSchoolDropdown(true);
    updateData({ school: "", grade: "", classLetter: "" });
    setTimeout(() => schoolInputRef.current?.focus(), 50);
  };

  const handleGradeSelect = (selectedGrade: string) => {
    setGrade(selectedGrade);
    setClassLetter("");
    updateData({ grade: selectedGrade, classLetter: "" });
  };

  const handleClassLetterSelect = (letter: string) => {
    setClassLetter(letter);
    updateData({ classLetter: letter });
  };

  // ---------- Filtering ----------
  const filteredLocations = locations.filter((loc) => {
    if (!locationSearch.trim()) return true;
    return loc.displayName.toLowerCase().includes(locationSearch.toLowerCase());
  });

  const filteredSchoolList = (() => {
    const q = schoolSearch.trim().toLowerCase();
    if (!q) return filteredSchools;

    console.log("School search query:", q);
    console.log("Filtered schools count:", filteredSchools.length);
    if (filteredSchools.length > 0) {
      console.log("First school name:", filteredSchools[0].name);
      console.log("First school phonetic:", filteredSchools[0].phonetic);
    }

    // First try the phonetic search
    const district =
      selectedLocation === "Ulaanbaatar" ? null : selectedLocation;
    const phoneticResults = searchSchools(filteredSchools, q, {
      district,
      limit: 50,
    });

    console.log("Phonetic search results:", phoneticResults.length);

    // If phonetic search returns results, use them
    if (phoneticResults.length > 0) {
      return phoneticResults;
    }

    // Fallback: simple text search across all fields
    const fallbackResults = filteredSchools.filter((school) => {
      return (
        school.name.toLowerCase().includes(q) ||
        school.nameLatin.toLowerCase().includes(q) ||
        school.searchText.toLowerCase().includes(q) ||
        (school.aliases &&
          school.aliases.some((alias) => alias.toLowerCase().includes(q))) ||
        (school.core && school.core.toLowerCase().includes(q)) ||
        (school.coreLatin && school.coreLatin.toLowerCase().includes(q)) ||
        (school.number && school.number.toString() === q)
      );
    });

    console.log("Fallback search results:", fallbackResults.length);
    return fallbackResults.slice(0, 50);
  })();

  // Helper to get display name of selected location
  const selectedLocationDisplay =
    locations.find((l) => l.name === selectedLocation)?.displayName ||
    selectedLocation;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
        Select your Province / City <span className="text-red-500">*</span>
      </h1>
      <p className="text-neutral-500 mb-8">
        This helps us narrow down your school search.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <svg
            className="h-6 w-6 animate-spin text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-6">
          {/* ========== LOCATION ========== */}
          <div className="text-left relative" ref={locationDropdownRef}>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Province / City
            </label>

            {/* Selected chip */}
            {selectedLocation && !isEditingLocation ? (
              <div
                onClick={startEditingLocation}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-full border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left cursor-pointer"
              >
                <span className="inline-flex items-center gap-2 font-medium text-neutral-900">
                  <span className="px-3 py-1.5 rounded-full bg-neutral-900 text-white text-sm font-medium">
                    {selectedLocationDisplay}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearLocation();
                  }}
                  className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500"
                >
                  <XIcon />
                </button>
              </div>
            ) : (
              /* Search input */
              <div className="relative">
                <input
                  ref={locationInputRef}
                  type="text"
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setShowLocationDropdown(true);
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder="Search province or city..."
                  className="w-full px-5 py-3 pr-10 rounded-full border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors bg-white text-left"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                  <ChevronRightIcon />
                </div>
              </div>
            )}

            <AnimatePresence>
              {showLocationDropdown &&
                (isEditingLocation || !selectedLocation) && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: customEase }}
                    className="absolute z-20 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
                  >
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
                        <button
                          key={location.name}
                          type="button"
                          onClick={() => handleLocationSelect(location)}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                        >
                          <div className="font-medium text-neutral-900 text-sm">
                            {location.displayName}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {location.count} schools
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-neutral-500">
                        No results found
                      </div>
                    )}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* ========== SCHOOL ========== */}
          {selectedLocation && (
            <div className="text-left relative" ref={schoolDropdownRef}>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                School
              </label>

              {/* Selected chip */}
              {selectedSchool && !isEditingSchool ? (
                <div
                  onClick={startEditingSchool}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-full border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left cursor-pointer"
                >
                  <span className="inline-flex items-center gap-2 font-medium text-neutral-900 text-sm truncate">
                    <span className="px-3 py-1.5 rounded-full bg-neutral-900 text-white text-sm font-medium truncate max-w-[280px]">
                      {selectedSchool}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSchool();
                    }}
                    className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 shrink-0"
                  >
                    <XIcon />
                  </button>
                </div>
              ) : (
                /* Search input */
                <div className="relative">
                  <input
                    ref={schoolInputRef}
                    type="text"
                    value={schoolSearch}
                    onChange={(e) => {
                      setSchoolSearch(e.target.value);
                      setShowSchoolDropdown(true);
                    }}
                    onFocus={() => setShowSchoolDropdown(true)}
                    placeholder="Type number or school name..."
                    className="w-full px-5 py-3 pr-10 rounded-full border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors bg-white text-left"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <ChevronRightIcon />
                  </div>
                </div>
              )}

              <AnimatePresence>
                {showSchoolDropdown && (isEditingSchool || !selectedSchool) && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: customEase }}
                    className="absolute z-20 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
                  >
                    {filteredSchoolList.length > 0 ? (
                      filteredSchoolList.map((school) => (
                        <button
                          key={school.id}
                          type="button"
                          onClick={() => handleSchoolSelect(school)}
                          className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                        >
                          <div className="font-medium text-neutral-900 text-sm">
                            {school.name}
                          </div>
                          {school.number != null && (
                            <div className="text-xs text-neutral-500">
                              #{school.number}
                            </div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-neutral-500">
                        No results found
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ========== GRADE & CLASS ========== */}
          {selectedSchool && (
            <div className="text-left space-y-4">
              <label className="block text-sm font-medium text-neutral-900">
                Your class (optional)
              </label>

              {/* Grade Selection */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                    "Gap 1",
                    "Gap 2-3",
                    "Gap 3-4",
                    "Other",
                  ].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleGradeSelect(g)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        grade === g
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Class Letter Selection */}
              {grade && !grade.includes("Gap") && grade !== "Other" && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {["A", "B", "C", "D", "E", "F", "G", "H"].map((letter) => (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => handleClassLetterSelect(letter)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          classLetter === letter
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                        }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-400 mt-2">
                    Select your class letter
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
