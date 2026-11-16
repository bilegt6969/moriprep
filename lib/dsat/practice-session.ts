export const PRACTICE_CONFIG_KEY = "practiceConfig";
export const QUESTION_RUSH_LAST_SESSION_KEY = "questionRushLastSession";

export function isQuestionRushSessionPath(path: string | null): path is string {
  return !!path && path.startsWith("/question-rush/rw?");
}
