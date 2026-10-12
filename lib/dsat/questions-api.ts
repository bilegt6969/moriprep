import type { DSATQuestion } from "@/types/dsat";

export type Section = "Reading and Writing" | "Math";

export interface ModuleRecord {
  section: Section;
  module: 1 | 2;
  /** Module 2 routing result ("Easy" | "Medium" | "Hard"), null for module 1 */
  difficulty: string | null;
  questions: DSATQuestion[];
  /** question index -> answer the student chose / typed */
  answers: Record<number, string>;
  /** question_ids the student flagged */
  marked: string[];
}

export interface TestAttempt {
  id: string;
  testId: string;
  testName: string;
  date: string;
  modules: ModuleRecord[];
}

export interface Attempt {
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  attemptedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  questionId: string;
  attempts: Attempt[];
  lastAttemptedAt: Date;
  domain?: string;
  skill?: string;
}

export interface UserStats {
  userId: string;
  totalQuestions: number;
  totalAttempts: number;
  correctAnswers: number;
  averageTime: number;
  weakDomains: string[];
  strongDomains: string[];
  lastUpdated: Date;
}

/**
 * Save user progress to the server
 * This replaces the direct Firestore access with a secure API call
 */
export async function saveUserProgress(
  questionId: string,
  answer: string,
  isCorrect: boolean,
  timeSpent: number,
  question?: DSATQuestion,
): Promise<void> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch("/api/user-progress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      questionId,
      answer,
      isCorrect,
      timeSpent,
      question,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save progress");
  }
}

/**
 * Get user progress from the server
 */
export async function getUserProgress(): Promise<UserProgress[]> {
  const token = await getIdToken();
  if (!token) {
    return [];
  }

  const response = await fetch("/api/user-progress", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch progress");
  }

  return response.json();
}

/**
 * Update user stats on the server
 */
export async function updateUserStats(
  isCorrect: boolean,
  timeSpent: number,
): Promise<void> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch("/api/user-stats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      isCorrect,
      timeSpent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update stats");
  }
}

/**
 * Get user stats from the server
 */
export async function getUserStats(): Promise<UserStats | null> {
  const token = await getIdToken();
  if (!token) {
    return null;
  }

  const response = await fetch("/api/user-stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch stats");
  }

  return response.json();
}

/**
 * Update user question stats on the server
 */
export async function updateUserQuestionStats(
  question: DSATQuestion,
  isCorrect: boolean,
  isFirstAttempt: boolean,
  testType?: Section,
): Promise<void> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch("/api/user-question-stats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      question,
      isCorrect,
      isFirstAttempt,
      testType: testType || "Reading and Writing",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update question stats");
  }
}

/**
 * Save answered questions to the server
 */
export async function saveAnsweredQuestions(
  answeredQuestions: Map<string, { isCorrect: boolean; answer: string }>,
): Promise<void> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  // Convert Map to object
  const answeredQuestionsObj = Object.fromEntries(answeredQuestions.entries());

  const response = await fetch("/api/user-answered-questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      answeredQuestions: answeredQuestionsObj,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save answered questions");
  }
}

/**
 * Get answered questions from the server
 */
export async function getAnsweredQuestions(): Promise<
  Map<string, { isCorrect: boolean; answer: string }>
> {
  const token = await getIdToken();
  if (!token) {
    return new Map();
  }

  const response = await fetch("/api/user-answered-questions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch answered questions");
  }

  const data = await response.json();
  return new Map(Object.entries(data));
}

/**
 * Save a question report to the server
 */
export async function saveQuestionReport(
  questionId: string,
  reportType: string,
  details: string,
): Promise<void> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch("/api/question-reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      questionId,
      reportType,
      details,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save report");
  }
}

/**
 * Helper function to get the current Firebase ID token
 */
async function getIdToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const { auth } = await import("@/lib/firebase");
    if (!auth || !auth.currentUser) return null;

    const token = await auth.currentUser.getIdToken();
    return token;
  } catch (error) {
    console.error("Error getting ID token:", error);
    return null;
  }
}

/**
 * Get question attempts for a specific question
 * This filters from the full user progress
 */
export async function getQuestionAttempts(
  questionId: string,
): Promise<Attempt[]> {
  const progress = await getUserProgress();
  const questionProgress = progress.find((p) => p.questionId === questionId);
  return questionProgress?.attempts || [];
}
