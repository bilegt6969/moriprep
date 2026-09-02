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
  const questionsPath = path.join(process.cwd(), "math_questions.json");
  const questionsData = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
  console.log("Loaded", questionsData.length, "questions from math_questions.json");
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
    totalCount: questions.length,
    count: questions.length, // Alias for popup compatibility
    total: questions.length, // Alias for backward compatibility
    // Store simple counts with sanitized keys
    domainCounts: {} as Record<string, number>,
    skillCounts: {} as Record<string, number>,
    difficultyCounts: {} as Record<string, number>,
    // Joint counts for exact domain/skill × difficulty combinations
    skillDifficultyCounts: {} as Record<string, number>,
    domainDifficultyCounts: {} as Record<string, number>,
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

    // Joint counts: skill × difficulty
    if (q.skill && q.difficulty) {
      const sanitizedSkill = sanitizeFieldName(q.skill);
      const sanitizedDifficulty = sanitizeFieldName(q.difficulty);
      const jointKey = `${sanitizedSkill}__${sanitizedDifficulty}`;
      stats.skillDifficultyCounts[jointKey] =
        (stats.skillDifficultyCounts[jointKey] || 0) + 1;
    }

    // Joint counts: domain × difficulty
    if (q.domain && q.difficulty) {
      const sanitizedDomain = sanitizeFieldName(q.domain);
      const sanitizedDifficulty = sanitizeFieldName(q.difficulty);
      const jointKey = `${sanitizedDomain}__${sanitizedDifficulty}`;
      stats.domainDifficultyCounts[jointKey] =
        (stats.domainDifficultyCounts[jointKey] || 0) + 1;
    }
  });

  return stats;
}

// Calculate user-specific statistics
function calculateUserStats(questions: any[], userProgress: any[]) {
  const answeredQuestionIds = new Set(userProgress.map((p) => p.question_id));
  const answeredQuestions = questions.filter((q) =>
    answeredQuestionIds.has(q.question_id)
  );

  const stats = {
    totalAnswered: answeredQuestions.length,
    totalCorrect: userProgress.filter((p) => p.is_correct).length,
    totalIncorrect: userProgress.filter((p) => !p.is_correct).length,
    // Store simple counts with sanitized keys
    domainCounts: {} as Record<string, number>,
    skillCounts: {} as Record<string, number>,
    difficultyCounts: {} as Record<string, number>,
    // Joint counts for exact domain/skill × difficulty combinations
    skillDifficultyCounts: {} as Record<string, { answered: number; correct: number; incorrect: number }>,
    domainDifficultyCounts: {} as Record<string, { answered: number; correct: number; incorrect: number }>,
  };

  answeredQuestions.forEach((q) => {
    const progress = userProgress.find((p) => p.question_id === q.question_id);
    const isCorrect = progress?.is_correct || false;

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

    // Joint counts: skill × difficulty
    if (q.skill && q.difficulty) {
      const sanitizedSkill = sanitizeFieldName(q.skill);
      const sanitizedDifficulty = sanitizeFieldName(q.difficulty);
      const jointKey = `${sanitizedSkill}__${sanitizedDifficulty}`;
      if (!stats.skillDifficultyCounts[jointKey]) {
        stats.skillDifficultyCounts[jointKey] = { answered: 0, correct: 0, incorrect: 0 };
      }
      stats.skillDifficultyCounts[jointKey].answered += 1;
      if (isCorrect) {
        stats.skillDifficultyCounts[jointKey].correct += 1;
      } else {
        stats.skillDifficultyCounts[jointKey].incorrect += 1;
      }
    }

    // Joint counts: domain × difficulty
    if (q.domain && q.difficulty) {
      const sanitizedDomain = sanitizeFieldName(q.domain);
      const sanitizedDifficulty = sanitizeFieldName(q.difficulty);
      const jointKey = `${sanitizedDomain}__${sanitizedDifficulty}`;
      if (!stats.domainDifficultyCounts[jointKey]) {
        stats.domainDifficultyCounts[jointKey] = { answered: 0, correct: 0, incorrect: 0 };
      }
      stats.domainDifficultyCounts[jointKey].answered += 1;
      if (isCorrect) {
        stats.domainDifficultyCounts[jointKey].correct += 1;
      } else {
        stats.domainDifficultyCounts[jointKey].incorrect += 1;
      }
    }
  });

  return stats;
}

async function main() {
  console.log("🚀 Starting math question stats update...");

  // Load questions
  const questions = loadQuestionsData();

  // Calculate global statistics
  console.log("📊 Calculating global statistics...");
  const globalStats = calculateStats(questions);
  console.log("Global statistics calculated:");
  console.log("- Total questions:", globalStats.totalCount);
  console.log("- Domains:", Object.entries(globalStats.domainCounts));
  console.log("- Skills:", Object.entries(globalStats.skillCounts));
  console.log("- Difficulties:", Object.entries(globalStats.difficultyCounts));

  // Update global stats in Firebase
  console.log("✅ Updating global stats in Firebase...");
  await setDoc(doc(db, "questionStats", "summary-math"), globalStats);

  // Calculate user-specific statistics
  console.log("👥 Calculating user-specific statistics...");
  const userProgressCollection = collection(db, "userProgress");
  const userProgressSnapshot = await getDocs(userProgressCollection);
  console.log("Found", userProgressSnapshot.size, "users with progress");

  let processedCount = 0;
  for (const userDoc of userProgressSnapshot.docs) {
    const userId = userDoc.id;
    const userProgressData = userDoc.data();
    
    // Filter for math progress only
    const mathProgress = userProgressData.progress?.filter((p: any) => p.test === "Math") || [];
    
    if (mathProgress.length === 0) {
      console.log("Skipping user", userId, "- no math progress");
      continue;
    }

    const userStats = calculateUserStats(questions, mathProgress);
    await setDoc(doc(db, "userQuestionStats", `${userId}-math`), userStats);
    processedCount++;
    console.log("✅ Successfully updated math stats for", userId);
  }

  console.log("✨ Done!");
  console.log("Stats summary:", {
    total: globalStats.totalCount,
    domains: Object.keys(globalStats.domainCounts).length,
    skills: Object.keys(globalStats.skillCounts).length,
    difficulties: Object.keys(globalStats.difficultyCounts).length,
    usersProcessed: processedCount,
  });
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
