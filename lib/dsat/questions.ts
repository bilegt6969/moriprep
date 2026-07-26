import { db } from "@/lib/firebase";
import { Attempt, DSATQuestion, UserProgress, UserStats } from "@/types/dsat";
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";

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
  const response = await fetch(`/api/questions`);
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  const questions = await response.json();
  return (
    questions.find(
      (q: any) => q.id === questionId || q.question_id === questionId,
    ) || null
  );
}

export async function saveUserProgress(
  userId: string,
  questionId: string,
  answer: string,
  isCorrect: boolean,
  timeSpent: number,
): Promise<void> {
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
}

export async function getQuestionAttempts(
  userId: string,
  questionId: string,
): Promise<Attempt[]> {
  try {
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
  const q = query(
    collection(db, "userProgress"),
    where("userId", "==", userId),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as UserProgress);
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const docRef = doc(db, "userStats", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserStats;
  }
  return null;
}

async function updateUserStats(
  userId: string,
  isCorrect: boolean,
  timeSpent: number,
): Promise<void> {
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
  const questions = await getQuestions({ limit: 1000 });
  return Array.from(new Set(questions.map((q: any) => q.domain)));
}

export async function getQuestionSkills(): Promise<string[]> {
  const questions = await getQuestions({ limit: 1000 });
  return Array.from(new Set(questions.map((q: any) => q.skill)));
}
