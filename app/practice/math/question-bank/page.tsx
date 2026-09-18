"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SATMathQuestion } from "@/types/dsat";
import { MathText } from "@/components/MathText";
import { Filter, Search, BookOpen, ChevronDown, Tag } from "lucide-react";

export default function MathQuestionBankPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<SATMathQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<SATMathQuestion | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>("");
  const [filterSkill, setFilterSkill] = useState<string>("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/questions?test=Math");
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterDomain && q.domain !== filterDomain) return false;
    if (filterSkill && q.skill !== filterSkill) return false;
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        q.question.toLowerCase().includes(query) ||
        q.skill.toLowerCase().includes(query) ||
        q.domain.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const domains = Array.from(new Set(questions.map((q) => q.domain)));
  const skills = Array.from(new Set(questions.map((q) => q.skill)));
  const difficulties = ["Easy", "Medium", "Hard"];

  const handleQuestionClick = (question: SATMathQuestion) => {
    // Navigate to practice page with this specific question
    const params = new URLSearchParams();
    params.set("question_id", question.question_id);
    if (question.domain) params.set("domain", question.domain);
    if (question.skill) params.set("skill", question.skill);
    if (question.difficulty) params.set("difficulty", question.difficulty);
    router.push(`/practice/math?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SAT Math Question Bank
          </h1>
          <p className="text-gray-600">
            Browse and practice {questions.length} SAT Math questions
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Domain Filter */}
            <div className="flex-1">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="">All Domains</option>
                  {domains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Skill Filter */}
            <div className="flex-1">
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="">All Skills</option>
                  {skills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex-1">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="">All Difficulties</option>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(filterDomain || filterSkill || filterDifficulty || searchQuery) && (
            <button
              onClick={() => {
                setFilterDomain("");
                setFilterSkill("");
                setFilterDifficulty("");
                setSearchQuery("");
              }}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Question Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredQuestions.length} of {questions.length} questions
        </div>

        {/* Question List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div
              key={question.question_id}
              onClick={() => handleQuestionClick(question)}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Question Type Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        question.question_type === "mcq"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {question.question_type === "mcq" ? "Multiple Choice" : "Student-Produced Response"}
                    </span>
                  </div>

                  {/* Question Content */}
                  <div className="mb-4 text-gray-900">
                    <MathText
                      text={question.question}
                      mathExpressions={question.math_expressions}
                      figures={question.figures}
                    />
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {question.domain}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {question.skill}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        question.difficulty === "Easy"
                          ? "bg-green-100 text-green-700"
                          : question.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                    {question.parse_status === "partial_fallback" && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                        Preview
                      </span>
                    )}
                  </div>
                </div>

                {/* Question ID */}
                <div className="text-xs text-gray-400 font-mono">
                  #{question.question_id}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
