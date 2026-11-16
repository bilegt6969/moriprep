"use client";

import { Check, X } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";

type AnswerChoicesProps = {
  choices: Record<string, string>;
  correctAnswer: string;
  selectedAnswer: string;
  highlightedAnswer: string;
  eliminatedChoices: ReadonlySet<string>;
  wrongAnswers: ReadonlySet<string>;
  showExplanation: boolean;
  isCrossOutMode: boolean;
  lockOnAnswer?: boolean;
  revealCorrectAnswer?: boolean;
  onAnswerHighlight: (answer: string) => void;
  onAnswerSubmit: () => void;
  onShowExplanation?: () => void;
  onToggleElimination?: (event: MouseEvent, key: string) => void;
  renderChoice?: (key: string, value: string) => ReactNode;
};

export default function AnswerChoices({
  choices,
  correctAnswer,
  selectedAnswer,
  highlightedAnswer,
  eliminatedChoices,
  wrongAnswers,
  showExplanation,
  isCrossOutMode,
  lockOnAnswer = false,
  revealCorrectAnswer = false,
  onAnswerHighlight,
  onAnswerSubmit,
  onShowExplanation,
  onToggleElimination,
  renderChoice,
}: AnswerChoicesProps) {
  return (
    <div className="space-y-3">
      {Object.entries(choices).map(([key, value]) => {
        const isSelected = selectedAnswer === key;
        const isHighlighted = highlightedAnswer === key;
        const isEliminated = eliminatedChoices.has(key);
        const isCorrect = key === correctAnswer;
        const hasAnswered = !!selectedAnswer;
        const isLocked =
          lockOnAnswer
            ? hasAnswered
            : hasAnswered && selectedAnswer === correctAnswer;
        const isWrongSelected = hasAnswered && isSelected && !isCorrect;
        const isRightAnswerShown = hasAnswered && isSelected && isCorrect;
        const isPreviouslyWrong = wrongAnswers.has(key);

        let borderClass = "border-gray-400";
        let bgClass = "bg-white dark:bg-gray-800";
        const textClass = isEliminated
          ? "text-gray-400 dark:text-gray-500 line-through"
          : "text-[#1C1C1E] dark:text-gray-100";

        if (isPreviouslyWrong) {
          borderClass = "border-red-600";
          bgClass = "bg-red-50";
        } else if (hasAnswered) {
          if ((revealCorrectAnswer && isCorrect) || (isSelected && isCorrect)) {
            borderClass = "border-green-600";
            bgClass = "bg-green-50";
          } else if (isSelected && !isCorrect) {
            borderClass = "border-red-600";
            bgClass = "bg-red-50";
          }
        } else if (isHighlighted) {
          borderClass = "border-sky-500";
          bgClass = "bg-white dark:bg-gray-800";
        } else if (!isEliminated) {
          borderClass = "border-gray-600 hover:border-gray-900";
        } else {
          borderClass = "border-gray-300 bg-gray-50/40";
        }

        return (
          <div
            key={key}
            onClick={() => !isLocked && onAnswerHighlight(key)}
            className={`group relative flex min-w-0 items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${borderClass} ${bgClass} ${isLocked ? "cursor-default" : "cursor-pointer"}`}
          >
            <div
              className={`flex size-7 shrink-0 items-center justify-center rounded-full font-sans text-sm font-bold transition-colors ${
                isRightAnswerShown || (revealCorrectAnswer && isCorrect)
                  ? "bg-green-600 text-white"
                  : isWrongSelected
                    ? "bg-red-600 text-white"
                    : isHighlighted
                      ? "bg-sky-500 text-white"
                      : isSelected
                        ? "bg-black text-white"
                        : isEliminated
                          ? "border-2 border-gray-300 text-gray-400"
                          : "border-2 border-gray-600 text-[#1C1C1E] dark:text-gray-100"
              }`}
            >
              {isRightAnswerShown || (revealCorrectAnswer && isCorrect) ? (
                <Check size={16} strokeWidth={3} />
              ) : isWrongSelected ? (
                <X size={16} strokeWidth={3} />
              ) : (
                key
              )}
            </div>

            <span
              className={`flex min-w-0 flex-1 font-serif text-[17px] leading-relaxed sm:text-[19px] ${textClass}`}
            >
              {renderChoice ? renderChoice(key, value) : value}
            </span>

            {isHighlighted &&
              !isLocked &&
              !showExplanation &&
              !isPreviouslyWrong && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAnswerSubmit();
                  }}
                  className="ml-2 flex shrink-0 items-center justify-center rounded-full border-2 border-sky-600 bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
                >
                  Check
                </button>
              )}

            {isWrongSelected && !lockOnAnswer && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onShowExplanation?.();
                }}
                className="ml-2 flex shrink-0 items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Explain
              </button>
            )}

            {isCrossOutMode && !isLocked && (
              <button
                type="button"
                onClick={(event) => onToggleElimination?.(event, key)}
                className="relative ml-2 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              >
                <div
                  className={`relative flex size-6 items-center justify-center rounded-full border-2 font-sans text-[11px] font-bold ${isEliminated ? "border-gray-400 text-gray-400" : "border-gray-500 text-gray-600 group-hover:border-gray-800 group-hover:text-gray-800"}`}
                >
                  {key}
                  <div className="absolute h-[1.5px] w-full rotate-[-45deg] bg-current" />
                </div>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
