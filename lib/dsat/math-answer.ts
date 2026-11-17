function parseNumericAnswer(answer: string): number | null {
  const normalized = answer.trim().replace(/\s+/g, "");
  if (!normalized || normalized.length > 80) return null;

  const fraction = normalized.match(
    /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\/([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/,
  );
  if (fraction) {
    const numerator = Number(fraction[1]);
    const denominator = Number(fraction[2]);
    if (
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator) ||
      denominator === 0
    ) {
      return null;
    }
    return numerator / denominator;
  }

  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized)) {
    return null;
  }
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function isMathAnswerCorrect(
  answer: string,
  correctAnswer: string,
  acceptedAnswers?: readonly string[] | null,
): boolean {
  const submitted = answer.trim().toLowerCase();
  if (!submitted) return false;

  const submittedNumber = parseNumericAnswer(submitted);
  const candidates =
    acceptedAnswers && acceptedAnswers.length > 0
      ? acceptedAnswers
      : [correctAnswer];

  return candidates.some((candidate) => {
    const expected = String(candidate ?? "")
      .trim()
      .toLowerCase();
    if (submitted === expected) return true;

    const expectedNumber = parseNumericAnswer(expected);
    if (submittedNumber === null || expectedNumber === null) return false;

    const tolerance =
      Number.EPSILON *
      8 *
      Math.max(1, Math.abs(submittedNumber), Math.abs(expectedNumber));
    return Math.abs(submittedNumber - expectedNumber) <= tolerance;
  });
}
