import dotenv from "dotenv";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
} from "firebase/firestore";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "bytecode-c55af.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Fail loudly if config is missing
const requiredKeys: (keyof typeof firebaseConfig)[] = [
  "apiKey",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];
const missing = requiredKeys.filter((k) => !firebaseConfig[k]);
if (missing.length) {
  console.error("❌ Missing Firebase env vars:", missing.join(", "));
  console.error(
    "   Make sure you're loading the right .env file (dotenv.config).",
  );
  process.exit(1);
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Load questions from JSON
function loadQuestionsData() {
  const questionsPath = path.join(process.cwd(), "questions.json");
  const questionsData = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
  console.log("Loaded", questionsData.length, "questions from questions.json");
  return questionsData;
}

// Sanitize field names for Firestore (replace all non-alphanumeric with underscores)
function sanitizeFieldName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");
}

// Calculate question statistics - simplified to just store total and basic counts
function calculateStats(questions: any[]) {
  const stats = {
    total: questions.length,
    // Store simple counts with sanitized keys
    domainCounts: {} as Record<string, number>,
    skillCounts: {} as Record<string, number>,
    difficultyCounts: {} as Record<string, number>,
  };

  questions.forEach((q) => {
    // Count by domain
    if (q.domain) {
      const sanitizedDomain = sanitizeFieldName(q.domain);
      stats.domainCounts[sanitizedDomain] =
        (stats.domainCounts[sanitizedDomain] || 0) + 1;
    }

    // Count by skill (global)
    if (q.skill) {
      const sanitizedSkill = sanitizeFieldName(q.skill);
      stats.skillCounts[sanitizedSkill] =
        (stats.skillCounts[sanitizedSkill] || 0) + 1;
    }

    // Count by difficulty
    if (q.difficulty) {
      const sanitizedDifficulty = sanitizeFieldName(q.difficulty);
      stats.difficultyCounts[sanitizedDifficulty] =
        (stats.difficultyCounts[sanitizedDifficulty] || 0) + 1;
    }
  });

  return stats;
}

// Calculate user-specific statistics - simplified with sanitized keys
function calculateUserStats(questions: any[], userProgress: Map<string, any>) {
  const userStats = {
    totalAnswered: userProgress.size,
    totalCorrect: 0,
    totalIncorrect: 0,
    // Simple structure with sanitized keys
    domainCounts: {} as Record<
      string,
      { answered: number; correct: number; incorrect: number }
    >,
    skillCounts: {} as Record<
      string,
      { answered: number; correct: number; incorrect: number }
    >,
    difficultyCounts: {} as Record<
      string,
      { answered: number; correct: number; incorrect: number }
    >,
  };

  // Create a map of question_id to question data for quick lookup
  const questionMap = new Map(questions.map((q) => [q.question_id, q]));

  userProgress.forEach((progress, questionId) => {
    const question = questionMap.get(questionId);
    if (!question) return;

    const attempts = progress.attempts || [];
    if (attempts.length === 0) return;

    const lastAttempt = attempts[attempts.length - 1];
    const isCorrect = lastAttempt.isCorrect;

    // Update totals
    if (isCorrect) {
      userStats.totalCorrect++;
    } else {
      userStats.totalIncorrect++;
    }

    // Update domain stats
    if (question.domain) {
      const sanitizedDomain = sanitizeFieldName(question.domain);
      if (!userStats.domainCounts[sanitizedDomain]) {
        userStats.domainCounts[sanitizedDomain] = {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
      }
      const stats = userStats.domainCounts[sanitizedDomain];
      stats.answered++;
      if (isCorrect) {
        stats.correct++;
      } else {
        stats.incorrect++;
      }
    }

    // Update skill stats
    if (question.skill) {
      const sanitizedSkill = sanitizeFieldName(question.skill);
      if (!userStats.skillCounts[sanitizedSkill]) {
        userStats.skillCounts[sanitizedSkill] = {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
      }
      const stats = userStats.skillCounts[sanitizedSkill];
      stats.answered++;
      if (isCorrect) {
        stats.correct++;
      } else {
        stats.incorrect++;
      }
    }

    // Update difficulty stats
    if (question.difficulty) {
      const sanitizedDifficulty = sanitizeFieldName(question.difficulty);
      if (!userStats.difficultyCounts[sanitizedDifficulty]) {
        userStats.difficultyCounts[sanitizedDifficulty] = {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
      }
      const stats = userStats.difficultyCounts[sanitizedDifficulty];
      stats.answered++;
      if (isCorrect) {
        stats.correct++;
      } else {
        stats.incorrect++;
      }
    }
  });

  return userStats;
}

// Update stats in Firebase
async function updateStatsInFirebase(stats: any) {
  try {
    const statsRef = doc(db, "questionStats", "summary");
    await Promise.race([
      setDoc(statsRef, { ...stats, updatedAt: new Date().toISOString() }),
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                "Firestore write timed out — check your Firebase config/env vars",
              ),
            ),
          15000,
        ),
      ),
    ]);
    console.log("✅ Successfully updated question stats in Firebase");
    console.log("Stats summary:", {
      total: stats.total,
      domains: Object.keys(stats.domainCounts).length,
      skills: Object.keys(stats.skillCounts).length,
      difficulties: Object.keys(stats.difficultyCounts).length,
    });
  } catch (error) {
    console.error("❌ Error updating stats in Firebase:", error);
    throw error;
  }
}

// Update user-specific stats in Firebase
async function updateUserStatsInFirebase(userId: string, userStats: any) {
  try {
    const userStatsRef = doc(db, "userQuestionStats", userId);
    await setDoc(userStatsRef, {
      ...userStats,
      updatedAt: new Date().toISOString(),
    });
    console.log(`✅ Successfully updated user stats for ${userId} in Firebase`);
  } catch (error) {
    console.error(
      `❌ Error updating user stats for ${userId} in Firebase:`,
      error,
    );
    throw error;
  }
}

// Main function
async function main() {
  console.log("🚀 Starting question stats update...");

  try {
    // Load questions
    const questions = loadQuestionsData();

    // Calculate global stats
    console.log("📊 Calculating global statistics...");
    const stats = calculateStats(questions);

    console.log("Global statistics calculated:");
    console.log("- Total questions:", stats.total);
    console.log("- Domains:", Object.entries(stats.domainCounts));
    console.log("- Skills:", Object.entries(stats.skillCounts));
    console.log("- Difficulties:", Object.entries(stats.difficultyCounts));

    // Update Firebase with global stats
    await updateStatsInFirebase(stats);

    // Calculate and update user-specific stats for all users
    console.log("👥 Calculating user-specific statistics...");
    const userProgressQuery = query(collection(db, "userProgress"));
    const userProgressSnapshot = await getDocs(userProgressQuery);

    console.log(`Found ${userProgressSnapshot.size} users with progress`);

    // Group user progress by userId
    const userProgressMap = new Map<string, Map<string, any>>();
    userProgressSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const userId = data.userId;
      if (!userId) {
        console.warn(
          `⚠️ userProgress doc ${docSnap.id} missing userId, skipping`,
        );
        return;
      }
      if (!userProgressMap.has(userId)) {
        userProgressMap.set(userId, new Map());
      }
      const questionId = data.questionId || data.question_id;
      userProgressMap.get(userId)!.set(questionId, data);
    });

    // Calculate and update stats for each user
    for (const [userId, progressMap] of userProgressMap.entries()) {
      if (!userId || typeof userId !== "string" || userId.includes("/")) {
        console.warn(`⚠️ Skipping invalid userId:`, userId);
        continue;
      }
      console.log(
        `Processing user: ${userId} (${progressMap.size} answered questions)`,
      );
      const userStats = calculateUserStats(questions, progressMap);
      await updateUserStatsInFirebase(userId, userStats);
    }

    console.log("✨ Done!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
