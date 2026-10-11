"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { OnboardingData } from "../onboarding-flow";

const customEase = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

interface SchoolSearchProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface School {
  id: string;
  name: string;
  nameLatin: string;
  parentId: string;
  parentName: string;
  number?: number;
  aliases: string[];
  searchText: string;
}

export function SchoolSearch({
  data,
  updateData,
  onNext,
  onBack,
}: SchoolSearchProps) {
  const [searchTerm, setSearchTerm] = useState(data.school || "");
  const [classLetter, setClassLetter] = useState(data.classLetter || "");
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        console.log("Fetching schools data from /schools_enriched_v4.json");
        const response = await fetch("/schools_enriched_v4.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setAllSchools(jsonData.schools);
        console.log("Loaded schools:", jsonData.schools.length);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setLoadError(
          error instanceof Error ? error.message : "Failed to load school data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    if (!data.parentName || !searchTerm) {
      setFilteredSchools([]);
      setShowDropdown(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    const parentFiltered = allSchools.filter(
      (school) => school.parentName === data.parentName,
    );

    const results = parentFiltered.filter((school) => {
      // Check searchText which includes all aliases
      if (school.searchText.toLowerCase().includes(term)) return true;

      // Check if the search term matches the number exactly
      if (school.number && term === school.number.toString()) return true;

      // Check if the search term matches the name
      if (school.name.toLowerCase().includes(term)) return true;

      // Check if the search term matches the Latin name
      if (school.nameLatin.toLowerCase().includes(term)) return true;

      return false;
    });

    setFilteredSchools(results.slice(0, 10)); // Limit to 10 results
    setShowDropdown(results.length > 0);
  }, [searchTerm, data.parentName, allSchools]);

  const handleSelectSchool = (school: School) => {
    setSearchTerm(school.name);
    setShowDropdown(false);
  };

  const handleNext = () => {
    updateData({ school: searchTerm, classLetter });
    onNext();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm) {
      handleNext();
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
        Enter your school <span className="text-red-500">*</span>
      </h1>
      <p className="text-neutral-500 mb-8">
        Searching in:{" "}
        <span className="font-medium text-neutral-900">{data.parentName}</span>
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
      ) : loadError ? (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="text-red-500 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            Failed to load school data
          </h3>
          <p className="text-sm text-neutral-500 mb-4">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-4 relative">
          <div className="relative">
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your school name or number..."
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
            />
            {showDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredSchools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => handleSelectSchool(school)}
                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                  >
                    <div className="font-medium text-neutral-900 text-sm">
                      {school.name}
                    </div>
                    {school.number && (
                      <div className="text-xs text-neutral-500">
                        #{school.number}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            value={classLetter}
            onChange={(e) => setClassLetter(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Your class (e.g., A, B, C - optional)"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
          />
          <p className="text-sm text-neutral-400">
            The letter of your class, like the A in 10A. Skip this if your class
            has none.
          </p>
        </div>
      )}
    </motion.div>
  );
}
