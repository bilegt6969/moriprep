import { db } from "@/lib/firebase";
import {
    Attempt,
    DSATQuestion,
    QuestionReport,
    UserProgress,
    UserStats,
} from "@/types/dsat";
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";

// Firestore helper functions for Practice questions
export async function getQuestions(filters?: {
  difficulty?: string;
  domain?: string;
  skill?: string;
  limit?: number;
}): Promise<DSATQuestion[]> {
  const params = new URLSearchParams();
  if (filters?.difficulty) params.append("difficulty", filters.difficulty);
  if (filters?.domain) params.append("domain", filters.domain);
  if (filters?.skill) params.append("skill", filters.skill);
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const response = await fetch(`/api/questions?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  return response.json();
}

export async function getQuestionById(
  questionId: string,
): Promise<DSATQuestion | null> {
  const response = await fetch(`/api/questions?question_id=${questionId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch question");
  }
  const questions = await response.json();
  return questions[0] || null;
}

// Sanitize field names for Firestore (replace all non-alphanumeric with underscores)
function sanitizeFieldName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");
}

// Update user question stats for practice configuration (real-time incremental updates)
async function updateUserQuestionStats(
  userId: string,
  question: DSATQuestion,
  isCorrect: boolean,
): Promise<void> {
  if (!db) return;

  const userStatsRef = doc(db, "userQuestionStats", userId);
  const docSnap = await getDoc(userStatsRef);

  const sanitizedDomain = question.domain
    ? sanitizeFieldName(question.domain)
    : null;
  const sanitizedSkill = question.skill
    ? sanitizeFieldName(question.skill)
    : null;
  const sanitizedDifficulty = question.difficulty
    ? sanitizeFieldName(question.difficulty)
    : null;

  if (docSnap.exists()) {
    // Incrementally update existing stats
    const updateData: any = {
      totalAnswered: increment(1),
      updatedAt: new Date().toISOString(),
    };

    if (isCorrect) {
      updateData.totalCorrect = increment(1);
    } else {
      updateData.totalIncorrect = increment(1);
    }

    // Update domain stats
    if (sanitizedDomain) {
      updateData[`domainCounts.${sanitizedDomain}.answered`] = increment(1);
      if (isCorrect) {
        updateData[`domainCounts.${sanitizedDomain}.correct`] = increment(1);
      } else {
        updateData[`domainCounts.${sanitizedDomain}.incorrect`] = increment(1);
      }
    }

    // Update skill stats
    if (sanitizedSkill) {
      updateData[`skillCounts.${sanitizedSkill}.answered`] = increment(1);
      if (isCorrect) {
        updateData[`skillCounts.${sanitizedSkill}.correct`] = increment(1);
      } else {
        updateData[`skillCounts.${sanitizedSkill}.incorrect`] = increment(1);
      }
    }

    // Update difficulty stats
    if (sanitizedDifficulty) {
      updateData[`difficultyCounts.${sanitizedDifficulty}.answered`] =
        increment(1);
      if (isCorrect) {
        updateData[`difficultyCounts.${sanitizedDifficulty}.correct`] =
          increment(1);
      } else {
        updateData[`difficultyCounts.${sanitizedDifficulty}.incorrect`] =
          increment(1);
      }
    }

    await updateDoc(userStatsRef, updateData);
  } else {
    // Create new user stats document
    const newStats: any = {
      totalAnswered: 1,
      totalCorrect: isCorrect ? 1 : 0,
      totalIncorrect: isCorrect ? 0 : 1,
      domainCounts: {},
      skillCounts: {},
      difficultyCounts: {},
      updatedAt: new Date().toISOString(),
    };

    if (sanitizedDomain) {
      newStats.domainCounts[sanitizedDomain] = {
        answered: 1,
        correct: isCorrect ? 1 : 0,
        incorrect: isCorrect ? 0 : 1,
      };
    }

    if (sanitizedSkill) {
      newStats.skillCounts[sanitizedSkill] = {
        answered: 1,
        correct: isCorrect ? 1 : 0,
        incorrect: isCorrect ? 0 : 1,
      };
    }

    if (sanitizedDifficulty) {
      newStats.difficultyCounts[sanitizedDifficulty] = {
        answered: 1,
        correct: isCorrect ? 1 : 0,
        incorrect: isCorrect ? 0 : 1,
      };
    }

    await setDoc(userStatsRef, newStats);
  }
}

export async function saveUserProgress(
  userId: string,
  questionId: string,
  answer: string,
  isCorrect: boolean,
  timeSpent: number,
  question?: DSATQuestion,
): Promise<void> {
  if (!db) return;

  const progressRef = doc(db, "userProgress", `${userId}_${questionId}`);

  const newAttempt: Attempt = {
    answer,
    isCorrect,
    timeSpent,
    attemptedAt: new Date(),
  };

  const docSnap = await getDoc(progressRef);

  if (docSnap.exists()) {
    // Add new attempt to existing array
    await updateDoc(progressRef, {
      attempts: arrayUnion(newAttempt),
      lastAttemptedAt: new Date().toISOString(),
    });
  } else {
    // Create new document with first attempt
    await setDoc(progressRef, {
      userId,
      questionId,
      attempts: [newAttempt],
      lastAttemptedAt: new Date().toISOString(),
    });
  }

  // Update user stats
  await updateUserStats(userId, isCorrect, timeSpent);

  // Update user question stats for practice configuration
  if (question) {
    await updateUserQuestionStats(userId, question, isCorrect);
  }
}

export async function getQuestionAttempts(
  userId: string,
  questionId: string,
): Promise<Attempt[]> {
  try {
    if (!db) return [];
    const progressRef = doc(db, "userProgress", `${userId}_${questionId}`);
    const docSnap = await getDoc(progressRef);

    if (docSnap.exists()) {
      const progress = docSnap.data() as UserProgress;
      return progress.attempts || [];
    }

    return [];
  } catch (error) {
    console.error("Error fetching question attempts:", error);
    return [];
  }
}

export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  if (!db) return [];
  const q = query(
    collection(db, "userProgress"),
    where("userId", "==", userId),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as UserProgress);
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  if (!db) return null;
  const docRef = doc(db, "userStats", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserStats;
  }
  return null;
}

export async function updateUserStats(
  userId: string,
  isCorrect: boolean,
  timeSpent: number,
): Promise<void> {
  if (!db) return;
  const statsRef = doc(db, "userStats", userId);
  const docSnap = await getDoc(statsRef);

  if (docSnap.exists()) {
    const stats = docSnap.data() as UserStats;
    const newTotal = stats.totalQuestions + 1;
    const newCorrect = stats.correctAnswers + (isCorrect ? 1 : 0);
    const newAverageTime =
      (stats.averageTime * stats.totalQuestions + timeSpent) / newTotal;

    await updateDoc(statsRef, {
      totalQuestions: newTotal,
      correctAnswers: newCorrect,
      averageTime: newAverageTime,
      lastUpdated: new Date().toISOString(),
    });
  } else {
    await setDoc(statsRef, {
      userId,
      totalQuestions: 1,
      correctAnswers: isCorrect ? 1 : 0,
      averageTime: timeSpent,
      weakDomains: [],
      strongDomains: [],
      lastUpdated: new Date().toISOString(),
    });
  }
}

export async function getQuestionDomains(): Promise<string[]> {
  const response = await fetch(`/api/questions?domains_only=true`);
  if (!response.ok) {
    throw new Error("Failed to fetch domains");
  }
  return response.json();
}

export async function getQuestionSkills(): Promise<string[]> {
  const response = await fetch(`/api/questions?skills_only=true`);
  if (!response.ok) {
    throw new Error("Failed to fetch skills");
  }
  return response.json();
}

export async function saveAnsweredQuestions(
  userId: string,
  answeredQuestions: Map<string, { isCorrect: boolean; answer: string }>,
): Promise<void> {
  if (!db) return;
  const answeredRef = doc(db, "userAnsweredQuestions", userId);
  // Convert Map to object to avoid nested arrays which Firebase doesn't support
  const answeredQuestionsObj = Object.fromEntries(answeredQuestions.entries());
  await setDoc(answeredRef, {
    userId,
    answeredQuestions: answeredQuestionsObj,
    lastUpdated: new Date().toISOString(),
  });
}

export async function getAnsweredQuestions(
  userId: string,
): Promise<Map<string, { isCorrect: boolean; answer: string }>> {
  try {
    if (!db) return new Map();
    const answeredRef = doc(db, "userAnsweredQuestions", userId);
    const docSnap = await getDoc(answeredRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as {
        answeredQuestions: Record<
          string,
          { isCorrect: boolean; answer: string }
        >;
      };
      return new Map(Object.entries(data.answeredQuestions));
    }

    return new Map();
  } catch (error) {
    console.error("Error fetching answered questions:", error);
    return new Map();
  }
}

export async function saveQuestionReport(
  userId: string,
  questionId: string,
  reportType: string,
  details: string,
): Promise<void> {
  if (!db) return;

  const reportRef = doc(collection(db, "questionReports"));
  const report: QuestionReport = {
    userId,
    questionId,
    reportType,
    details,
    createdAt: new Date(),
  };

  await setDoc(reportRef, report);
}
