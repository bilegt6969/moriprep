"use client";

import { useState } from "react";
import { Bookmark, Flag, FileText, AudioLines } from "lucide-react";

export type Choice = {
  /** "A" | "B" | "C" | "D" ... */
  letter: string;
  /** Plain text, or JSX if you need to render an inline math image */
  content: React.ReactNode;
};

export type QuestionCardProps = {
  questionNumber: number;
  /** Plain text, or JSX if the question body contains inline math images */
  prompt: React.ReactNode;
  choices: Choice[];
  /** Controlled selection, e.g. "A". Pass undefined for no selection. */
  selected?: string;
  onSelect?: (letter: string) => void;
  markedForReview?: boolean;
  onToggleMark?: () => void;
};

export default function QuestionCard({
  questionNumber,
  prompt,
  choices,
  selected,
  onSelect,
  markedForReview = false,
  onToggleMark,
}: QuestionCardProps) {
  const [internalSelected, setInternalSelected] = useState<string | undefined>(selected);
  const [internalMarked, setInternalMarked] = useState(markedForReview);

  const activeLetter = selected ?? internalSelected;
  const isMarked = onToggleMark ? markedForReview : internalMarked;

  function handleSelect(letter: string) {
    if (onSelect) onSelect(letter);
    else setInternalSelected(letter);
  }

  function handleToggleMark() {
    if (onToggleMark) onToggleMark();
    else setInternalMarked((m) => !m);
  }

  return (
    <div className="w-full max-w-3xl rounded-xl border border-gray-300 bg-white overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-gray-50 px-5 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-black text-base font-semibold text-white">
            {questionNumber}
          </div>
          <button
            type="button"
            onClick={handleToggleMark}
            className="flex items-center gap-2 text-[15px] text-gray-800 hover:text-black"
          >
            <Bookmark
              size={18}
              strokeWidth={1.75}
              className={isMarked ? "fill-black text-black" : "text-gray-700"}
            />
            Mark for Review
          </button>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <button type="button" aria-label="Notes" className="hover:text-black">
            <FileText size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[15px] hover:text-black"
          >
            <Flag size={16} strokeWidth={1.75} />
            Report
          </button>
          <button
            type="button"
            aria-label="Line reader"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:border-gray-400"
          >
            <AudioLines size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <p className="font-serif text-[19px] leading-[1.6] text-gray-900">{prompt}</p>

        <div className="mt-6 flex flex-col gap-4">
          {choices.map((choice) => {
            const isActive = activeLetter === choice.letter;
            return (
              <button
                key={choice.letter}
                type="button"
                onClick={() => handleSelect(choice.letter)}
                className={`flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
                  isActive
                    ? "border-black bg-gray-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[15px] font-medium ${
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-gray-400 text-gray-900"
                  }`}
                >
                  {choice.letter}
                </span>
                <span className="font-serif text-[19px] leading-snug text-gray-900">
                  {choice.content}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
