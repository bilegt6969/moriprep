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

// Recalculate user stats from scratch using distinct question counts (not attempt counts)
function recalculateUserStats(questions: any[], userProgress: Map<string, any>) {
  const userStats = {
    totalAnswered: userProgress.size, // Distinct questions, not attempts
    totalCorrect: 0,
    totalIncorrect: 0,
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
    skillDifficultyCounts: {} as Record<
      string,
      { answered: number; correct: number; incorrect: number }
    >,
    domainDifficultyCounts: {} as Record<
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

    // Update totals (based on last attempt outcome)
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

    // Joint counts: skill × difficulty
    if (question.skill && question.difficulty) {
      const sanitizedSkill = sanitizeFieldName(question.skill);
      const sanitizedDifficulty = sanitizeFieldName(question.difficulty);
      const key = `${sanitizedSkill}__${sanitizedDifficulty}`;
      if (!userStats.skillDifficultyCounts[key]) {
        userStats.skillDifficultyCounts[key] = {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
      }
      const stats = userStats.skillDifficultyCounts[key];
      stats.answered++;
      if (isCorrect) {
        stats.correct++;
      } else {
        stats.incorrect++;
      }
    }

    // Joint counts: domain × difficulty
    if (question.domain && question.difficulty) {
      const sanitizedDomain = sanitizeFieldName(question.domain);
      const sanitizedDifficulty = sanitizeFieldName(question.difficulty);
      const key = `${sanitizedDomain}__${sanitizedDifficulty}`;
      if (!userStats.domainDifficultyCounts[key]) {
        userStats.domainDifficultyCounts[key] = {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
      }
      const stats = userStats.domainDifficultyCounts[key];
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

// Update user-specific stats in Firebase
async function updateUserStatsInFirebase(userId: string, userStats: any) {
  try {
    const userStatsRef = doc(db, "userQuestionStats", userId);
    await setDoc(userStatsRef, {
      ...userStats,
      updatedAt: new Date().toISOString(),
    });
    console.log(`✅ Successfully backfilled user stats for ${userId} in Firebase`);
  } catch (error) {
    console.error(
      `❌ Error backfilling user stats for ${userId} in Firebase:`,
      error,
    );
    throw error;
  }
}

// Main function
async function main() {
  console.log("🚀 Starting user stats backfill to fix attempt-inflation bug...");

  try {
    // Load questions
    const questions = loadQuestionsData();

    // Fetch all user progress
    console.log("👥 Fetching user progress from Firebase...");
    const userProgressQuery = query(collection(db, "userProgress"));
    const userProgressSnapshot = await getDocs(userProgressQuery);

    console.log(`Found ${userProgressSnapshot.size} userProgress docs`);

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

    console.log(`Found ${userProgressMap.size} unique users with progress`);

    // Recalculate and update stats for each user
    for (const [userId, progressMap] of userProgressMap.entries()) {
      if (!userId || typeof userId !== "string" || userId.includes("/")) {
        console.warn(`⚠️ Skipping invalid userId:`, userId);
        continue;
      }
      console.log(
        `Backfilling user: ${userId} (${progressMap.size} distinct questions)`,
      );
      const userStats = recalculateUserStats(questions, progressMap);
      await updateUserStatsInFirebase(userId, userStats);
    }

    console.log("✨ Backfill complete!");
    console.log("📝 Next steps:");
    console.log("   1. Run 'npm run update-question-stats' to update global summary with joint counts");
    console.log("   2. Test the popup vs practice page counts to verify the fix");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
