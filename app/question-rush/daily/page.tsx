"use client";

import AnswerChoices from "@/components/dsat/question-rush/AnswerChoices";
import PassageContent from "@/components/dsat/question-rush/PassageContent";
import { MathText } from "@/components/MathText";
import { SanitizedQuestionHtml } from "@/components/SanitizedQuestionHtml";
import { isMathAnswerCorrect } from "@/lib/dsat/math-answer";
import {
  selectMixedPracticeQuestions,
  type MixedPracticeQuestion,
} from "@/lib/dsat/mixed-practice";
import { saveUserProgress } from "@/lib/dsat/questions-api";
import { saveUserAnswer } from "@/lib/user-api";
import type { DSATQuestion, SATMathQuestion } from "@/types/dsat";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type AnswerResult = { answer: string; isCorrect: boolean };

function isMathQuestion(
  item: MixedPracticeQuestion,
): item is Extract<MixedPracticeQuestion, { section: "Math" }> {
  return item.section === "Math";
}

function getQuestion(
  item: MixedPracticeQuestion,
): DSATQuestion | SATMathQuestion {
  return item.question;
}

function getQuestionKey(item: MixedPracticeQuestion): string {
  return `${item.section}:${item.question.question_id}`;
}

function isCorrectAnswer(item: MixedPracticeQuestion, answer: string): boolean {
  const question = item.question;
  if (isMathQuestion(item) && question.question_type === "spr") {
    return isMathAnswerCorrect(
      answer,
      question.correct_answer,
      question.accepted_answers,
    );
  }
  return answer === question.correct_answer;
}

export default function DailyPracticePage() {
  const [questions, setQuestions] = useState<MixedPracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [results, setResults] = useState<Record<string, AnswerResult>>({});
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSession = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [rwResponse, mathResponse] = await Promise.all([
        fetch("/api/questions?test=Reading%20and%20Writing"),
        fetch("/api/questions?test=Math"),
      ]);

      if (!rwResponse.ok || !mathResponse.ok) {
        throw new Error(
          "Could not load the practice questions. Please try again.",
        );
      }

      const [rwQuestions, mathQuestions] = (await Promise.all([
        rwResponse.json(),
        mathResponse.json(),
      ])) as [DSATQuestion[], SATMathQuestion[]];

      const session = selectMixedPracticeQuestions(rwQuestions, mathQuestions);
      setQuestions(session);
      setCurrentIndex(0);
      setSelectedAnswer("");
      setResults({});
      setQuestionStartedAt(Date.now());
    } catch (loadError) {
      console.error("Could not start daily mixed practice:", loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load the practice questions. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const current = questions[currentIndex];
  const currentResult = current ? results[getQuestionKey(current)] : undefined;
  const answeredCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter(
    (result) => result.isCorrect,
  ).length;

  async function submitAnswer() {
    if (!current || !selectedAnswer.trim() || currentResult) return;

    const question = getQuestion(current);
    const isCorrect = isCorrectAnswer(current, selectedAnswer);
    const timeSpent = Date.now() - questionStartedAt;
    const result = { answer: selectedAnswer, isCorrect };

    setResults((previous) => ({
      ...previous,
      [getQuestionKey(current)]: result,
    }));

    if (auth?.currentUser) {
      try {
        const saves = await Promise.allSettled([
          saveUserProgress(
            question.question_id,
            selectedAnswer,
            isCorrect,
            timeSpent,
            question,
          ),
          saveUserAnswer(
            question.question_id,
            question.domain,
            current.section,
            isCorrect,
          ),
        ]);
        const failedSave = saves.find(
          (save): save is PromiseRejectedResult => save.status === "rejected",
        );
        if (failedSave) throw failedSave.reason;
      } catch (saveError) {
        console.error("Could not save daily practice answer:", saveError);
        setError(
          "Your answer was recorded for this session, but progress could not be saved. Please check your connection.",
        );
      }
    }
  }

  function goToNextQuestion() {
    setError("");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      setSelectedAnswer("");
      setQuestionStartedAt(Date.now());
    } else {
      setCurrentIndex(questions.length);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
        <p className="text-sm text-gray-500">Preparing your 20 questions...</p>
      </main>
    );
  }

  if (error && questions.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-gray-700">{error}</p>
        <button
          type="button"
          onClick={() => void loadSession()}
          className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
        >
          Try again
        </button>
        <Link href="/overview" className="text-sm text-gray-500 underline">
          Back to Overview
        </Link>
      </main>
    );
  }

  if (currentIndex >= questions.length) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
          Daily practice complete
        </p>
        <h1 className="text-3xl font-semibold text-gray-950">
          {correctCount} of {questions.length} correct
        </h1>
        <p className="mt-3 text-gray-600">
          You answered {answeredCount} mixed Math and Reading &amp; Writing
          questions.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => void loadSession()}
            className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Practice another 20
          </button>
          <Link
            href="/overview"
            className="rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-800"
          >
            Back to Overview
          </Link>
        </div>
      </main>
    );
  }

  if (!current) return null;

  const mathQuestion = isMathQuestion(current) ? current.question : null;
  const rwQuestion =
    current.section === "Reading & Writing" ? current.question : null;
  const question = current.question;
  const isRawMathHtmlQuestion =
    mathQuestion?.source_file.startsWith("raw-math/") ?? false;
  const prompt =
    mathQuestion?.question ?? rwQuestion?.prompt ?? question.question;
  const choices = question.choices ?? {};

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-[1920px]">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/overview"
            className="text-sm text-gray-500 hover:text-black"
          >
            Exit practice
          </Link>
          <p className="text-sm font-medium text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </header>

        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#0080FF] transition-[width]"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-3 px-5 pt-5 sm:px-8 sm:pt-8">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {current.section}
            </span>
            <span className="text-xs text-gray-500">
              {question.domain} · {question.difficulty}
            </span>
          </div>

          <div className="flex flex-col border-t border-gray-200 md:min-h-[60vh] md:flex-row">
            <div className="passage-content min-w-0 flex-1 overflow-y-auto p-6 sm:p-8 md:border-r md:border-gray-200 md:p-10">
              <div className="mx-auto max-w-3xl font-serif text-[17px] leading-[1.7] text-[#1C1C1E] dark:text-gray-100 sm:text-[19px]">
                {rwQuestion ? (
                  <PassageContent question={rwQuestion} />
                ) : mathQuestion ? (
                  isRawMathHtmlQuestion ? (
                    <SanitizedQuestionHtml html={prompt} />
                  ) : (
                    <MathText
                      text={prompt}
                      mathExpressions={mathQuestion.math_expressions}
                      figures={mathQuestion.figures}
                    />
                  )
                ) : null}
              </div>
            </div>

            <div className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-6 md:p-8">
              {rwQuestion && (
                <div className="mb-6 font-serif text-[17px] leading-relaxed text-[#1C1C1E] dark:text-gray-100 sm:text-[19px]">
                  {rwQuestion.prompt}
                </div>
              )}

              {mathQuestion?.question_type === "spr" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    Your answer
                  </span>
                  <input
                    value={selectedAnswer}
                    onChange={(event) => setSelectedAnswer(event.target.value)}
                    disabled={!!currentResult}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-[#0080FF]"
                    placeholder="Enter your answer"
                  />
                </label>
              ) : (
                <AnswerChoices
                  choices={choices}
                  correctAnswer={question.correct_answer}
                  selectedAnswer={currentResult?.answer ?? ""}
                  highlightedAnswer={currentResult?.answer ?? selectedAnswer}
                  eliminatedChoices={new Set()}
                  wrongAnswers={new Set()}
                  showExplanation={!!currentResult}
                  isCrossOutMode={false}
                  lockOnAnswer
                  revealCorrectAnswer
                  renderChoiceAsBlock={isRawMathHtmlQuestion}
                  onAnswerHighlight={setSelectedAnswer}
                  onAnswerSubmit={() => void submitAnswer()}
                  renderChoice={(_key, choice) =>
                    mathQuestion ? (
                      isRawMathHtmlQuestion ? (
                        <SanitizedQuestionHtml html={choice} />
                      ) : (
                        <MathText
                          text={choice}
                          mathExpressions={mathQuestion.math_expressions}
                          figures={mathQuestion.figures}
                        />
                      )
                    ) : (
                      choice
                    )
                  }
                />
              )}

              {currentResult && (
                <div
                  className={`mt-6 rounded-2xl p-4 ${
                    currentResult.isCorrect
                      ? "bg-green-50 text-green-900"
                      : "bg-red-50 text-red-900"
                  }`}
                >
                  <p className="font-semibold">
                    {currentResult.isCorrect ? "Correct" : "Not quite"}
                  </p>
                  {!currentResult.isCorrect &&
                    (isRawMathHtmlQuestion &&
                    mathQuestion?.question_type !== "spr" ? (
                      <>
                        <p className="mt-1 text-sm">
                          Correct answer: {question.correct_answer}
                        </p>
                        <SanitizedQuestionHtml
                          className="text-sm"
                          html={question.correct_answer_text ?? ""}
                        />
                      </>
                    ) : (
                      <p className="mt-1 text-sm">
                        Correct answer: {question.correct_answer}
                        {question.correct_answer_text
                          ? ` — ${question.correct_answer_text}`
                          : ""}
                      </p>
                    ))}
                  {question.rationale &&
                    (isRawMathHtmlQuestion ? (
                      <SanitizedQuestionHtml
                        className="mt-2 text-sm leading-6"
                        html={question.rationale}
                      />
                    ) : (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                        {question.rationale}
                      </p>
                    ))}
                </div>
              )}

              {error && questions.length > 0 && (
                <p role="alert" className="mt-4 text-sm text-red-700">
                  {error}
                </p>
              )}

              {currentResult && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={goToNextQuestion}
                    className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
                  >
                    {currentIndex === questions.length - 1
                      ? "Finish"
                      : "Next question"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
