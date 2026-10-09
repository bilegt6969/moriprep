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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("/schools_enriched.json");
        const jsonData = await response.json();
        setAllSchools(jsonData.schools);
      } catch (error) {
        console.error("Error fetching schools:", error);
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
    </motion.div>
  );
}
