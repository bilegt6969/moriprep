"use client";

import { auth, db } from "@/lib/firebase";
import { DSATQuestion } from "@/types/dsat";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ChevronDown, ChevronLeft, Filter, MoreHorizontal } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

interface TopicProgress {
  name: string;
  progress: string;
  accuracy: string;
  total: number;
  completed: number;
  correct: number;
}

function PracticePage() {
  const [questions, setQuestions] = useState<DSATQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  // Topic definitions based on DSAT structure
  const topics = [
    // Craft and Structure
    {
      name: "Cross-Text Connections",
      domain: "Craft and Structure",
      skill: "Cross-Text Connections",
    },
    {
      name: "Text Structure and Purpose",
      domain: "Craft and Structure",
      skill: "Text Structure and Purpose",
    },
    {
      name: "Words in Context",
      domain: "Craft and Structure",
      skill: "Words in Context",
    },
    // Expression of Ideas
    {
      name: "Rhetorical Synthesis",
      domain: "Expression of Ideas",
      skill: "Rhetorical Synthesis",
    },
    {
      name: "Transitions",
      domain: "Expression of Ideas",
      skill: "Transitions",
    },
    // Information and Ideas
    {
      name: "Central Ideas and Details",
      domain: "Information and Ideas",
      skill: "Central Ideas and Details",
    },
    {
      name: "Command of Evidence",
      domain: "Information and Ideas",
      skill: "Command of Evidence",
    },
    {
      name: "Inferences",
      domain: "Information and Ideas",
      skill: "Inferences",
    },
    // Standard English Conventions
    {
      name: "Boundaries",
      domain: "Standard English Conventions",
      skill: "Boundaries",
    },
    {
      name: "Form, Structure, and Sense",
      domain: "Standard English Conventions",
      skill: "Form, Structure, and Sense",
    },
  ];

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  async function fetchQuestions() {
    try {
      if (!db) return;
      const q = query(collection(db, "questions"));
      const querySnapshot = await getDocs(q);
      const questionsData = querySnapshot.docs.map(
        (doc) => doc.data() as DSATQuestion,
      );
      setQuestions(questionsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  }

  async function fetchUserProgress() {
    try {
      if (!db) return;
      const progressQuery = query(
        collection(db, "userProgress"),
        where("userId", "==", user.uid),
      );
      const progressSnapshot = await getDocs(progressQuery);
      const progressData = progressSnapshot.docs.map((doc) => doc.data());

      // Calculate progress for each topic
      const topicStats = topics.map((topic) => {
        let topicQuestions = questions.filter(
          (q) => q.domain === topic.domain && q.skill === topic.skill,
        );

        // Apply difficulty filter
        if (selectedDifficulty !== "all") {
          topicQuestions = topicQuestions.filter(
            (q) => q.difficulty === selectedDifficulty,
          );
        }

        const total = topicQuestions.length;

        const completedAttempts = progressData.filter((p) => {
          const question = questions.find(
            (q) => q.question_id === p.questionId,
          );
          if (!question) return false;
          if (
            question.domain !== topic.domain ||
            question.skill !== topic.skill
          )
            return false;
          if (
            selectedDifficulty !== "all" &&
            question.difficulty !== selectedDifficulty
          )
            return false;
          return true;
        });
        const completed = completedAttempts.length;
        const correct = completedAttempts.filter((p) => p.isCorrect).length;

        const accuracy =
          completed > 0 ? Math.round((correct / completed) * 100) : 0;

        return {
          name: topic.name,
          progress: `${completed}/${total}`,
          accuracy: `${accuracy}`, // Stripped the % sign for custom rendering
          total,
          completed,
          correct,
        };
      });

      setTopicProgress(topicStats);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  }

  // Refetch progress when filters change
  useEffect(() => {
    if (user && questions.length > 0) {
      fetchUserProgress();
    }
  }, [selectedDifficulty, selectedDomain]);

  // Reusable component for rendering topic rows
  const renderTopicRow = (topic: TopicProgress, idx: number) => {
    const progressPercentage =
      topic.total > 0 ? (topic.completed / topic.total) * 100 : 0;

    return (
      <div
        key={idx}
        className="grid grid-cols-[2fr_1.5fr_1fr] py-3.5 items-center"
      >
        {/* Topic Name */}
        <div className="flex items-center gap-3.5">
          <div className="w-5 h-5 rounded-full border-[1.5px] border-gray-200" />
          <span className="text-[15px] text-gray-900">{topic.name}</span>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-end gap-4 pr-10">
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-[15px] text-gray-500 w-12 text-right">
            {topic.progress}
          </span>
        </div>

        {/* Accuracy */}
        <div className="flex items-center justify-end gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <div className="text-[15px]">
            <span className="font-medium text-gray-900">{topic.accuracy}</span>
            <span className="text-gray-400 ml-1 text-sm">%</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Top Breadcrumb */}
        <button className="flex items-center text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1 stroke-[1.5]" />
          Back to Question Bank
        </button>

        {/* Header & Actions */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-medium tracking-tight">
            Reading & Writing
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2 text-gray-500 stroke-[1.5]" />
              Filters
              <ChevronDown
                className={`w-4 h-4 ml-2 text-gray-400 stroke-[1.5] transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <MoreHorizontal className="w-4 h-4 mr-2 text-gray-500 stroke-[1.5]" />
              More options
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-6">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Difficulty
                </label>
                <div className="space-y-2">
                  {["all", "Easy", "Medium", "Hard"].map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                        selectedDifficulty === difficulty
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {difficulty === "all" ? "All difficulties" : difficulty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Domain Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Domain
                </label>
                <div className="space-y-2">
                  {[
                    "all",
                    "Craft and Structure",
                    "Expression of Ideas",
                    "Information and Ideas",
                    "Standard English Conventions",
                  ].map((domain) => (
                    <button
                      key={domain}
                      onClick={() => setSelectedDomain(domain)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                        selectedDomain === domain
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {domain === "all" ? "All domains" : domain}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedDifficulty("all");
                  setSelectedDomain("all");
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Practice All Section */}
        <div className="flex items-center justify-between p-6 border border-gray-100 shadow-sm rounded-2xl mb-12">
          <div>
            <h2 className="text-lg font-medium mb-1">Practice all topics</h2>
            <p className="text-[15px] text-gray-500">
              Start practicing all 10 skills in Reading & Writing.
            </p>
          </div>
          <button className="bg-gray-100 text-gray-900 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
            Start practice
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr] border-b border-gray-200 pb-3 mb-8 text-[13px] text-gray-500">
          <div>Topic</div>
          <div className="flex justify-end pr-14">Progress</div>
          <div className="flex justify-end">Accuracy</div>
        </div>

        {/* Main Content / Domains */}
        <div className="space-y-12">
          {/* Craft and Structure */}
          {selectedDomain === "all" ||
          selectedDomain === "Craft and Structure" ? (
            <div className="border-b border-gray-100 pb-8">
              <h3 className="text-[22px] font-medium mb-6 tracking-tight">
                Craft and Structure
              </h3>
              <div className="space-y-1">
                {topicProgress
                  .filter((t) =>
                    [
                      "Cross-Text Connections",
                      "Text Structure and Purpose",
                      "Words in Context",
                    ].includes(t.name),
                  )
                  .map(renderTopicRow)}
              </div>
            </div>
          ) : null}

          {/* Expression of Ideas */}
          {selectedDomain === "all" ||
          selectedDomain === "Expression of Ideas" ? (
            <div className="border-b border-gray-100 pb-8">
              <h3 className="text-[22px] font-medium mb-6 tracking-tight">
                Expression of Ideas
              </h3>
              <div className="space-y-1">
                {topicProgress
                  .filter((t) =>
                    ["Rhetorical Synthesis", "Transitions"].includes(t.name),
                  )
                  .map(renderTopicRow)}
              </div>
            </div>
          ) : null}

          {/* Information and Ideas */}
          {selectedDomain === "all" ||
          selectedDomain === "Information and Ideas" ? (
            <div className="border-b border-gray-100 pb-8">
              <h3 className="text-[22px] font-medium mb-6 tracking-tight">
                Information and Ideas
              </h3>
              <div className="space-y-1">
                {topicProgress
                  .filter((t) =>
                    [
                      "Central Ideas and Details",
                      "Command of Evidence",
                      "Inferences",
                    ].includes(t.name),
                  )
                  .map(renderTopicRow)}
              </div>
            </div>
          ) : null}

          {/* Standard English Conventions */}
          {selectedDomain === "all" ||
          selectedDomain === "Standard English Conventions" ? (
            <div className="pb-8">
              <h3 className="text-[22px] font-medium mb-6 tracking-tight">
                Standard English Conventions
              </h3>
              <div className="space-y-1">
                {topicProgress
                  .filter((t) =>
                    ["Boundaries", "Form, Structure, and Sense"].includes(
                      t.name,
                    ),
                  )
                  .map(renderTopicRow)}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-10">
          <p className="text-[11px] leading-5 text-gray-400 text-center max-w-3xl mx-auto">
            ONEPREP and PREPPY AI are trademarks or registered trademarks of
            OnePrep.
            <br />
            <br />
            SAT and AP are trademarks or registered trademarks of the College
            Board and ACT is a trademark or registered trademark of ACT
            Education Corp. and are used on this website for identification
            purposes. Use of SAT, AP, and ACT on this website does not imply any
            relationship or affiliation with the College Board or ACT Education
            Corp. nor endorsement by them of the contents on the website or of
            the services provided by OnePrep.
          </p>
        </div>
      </div>
    </div>
  );
}

function PracticePageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          Loading...
        </div>
      }
    >
      <PracticePage />
    </Suspense>
  );
}

export default PracticePageWrapper;
