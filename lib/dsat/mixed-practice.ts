import type { DSATQuestion, SATMathQuestion } from "@/types/dsat";

export type MixedPracticeQuestion =
  | { section: "Reading & Writing"; question: DSATQuestion }
  | { section: "Math"; question: SATMathQuestion };

const QUESTIONS_PER_SECTION = 10;

function shuffled<T>(items: T[], random: () => number): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

export function selectMixedPracticeQuestions(
  readingAndWriting: DSATQuestion[],
  math: SATMathQuestion[],
  random: () => number = Math.random,
): MixedPracticeQuestion[] {
  if (
    readingAndWriting.length < QUESTIONS_PER_SECTION ||
    math.length < QUESTIONS_PER_SECTION
  ) {
    throw new Error("Not enough questions available for a mixed practice session.");
  }

  const rwQuestions = shuffled(readingAndWriting, random).slice(
    0,
    QUESTIONS_PER_SECTION,
  );
  const mathQuestions = shuffled(math, random).slice(0, QUESTIONS_PER_SECTION);
  const rwFirst = random() < 0.5;
  const mixed: MixedPracticeQuestion[] = [];

  for (let index = 0; index < QUESTIONS_PER_SECTION; index += 1) {
    if (rwFirst) {
      mixed.push(
        { section: "Reading & Writing", question: rwQuestions[index] },
        { section: "Math", question: mathQuestions[index] },
      );
    } else {
      mixed.push(
        { section: "Math", question: mathQuestions[index] },
        { section: "Reading & Writing", question: rwQuestions[index] },
      );
    }
  }

  return mixed;
}
