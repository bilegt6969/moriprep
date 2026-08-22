import { getApp, getApps, initializeApp } from "firebase/app";
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    query,
    setDoc
} from "firebase/firestore";
import fs from "fs";
import path from "path";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "bytecode-c55af.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

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

// Calculate question statistics
function calculateStats(questions: any[]) {
  const stats = {
    total: questions.length,
    domains: {} as Record<string, number>,
    skills: {} as Record<string, number>,
    difficulties: {} as Record<string, number>,
    domainSkills: {} as Record<string, Record<string, number>>,
  };

  questions.forEach((q) => {
    // Count by domain
    if (q.domain) {
      stats.domains[q.domain] = (stats.domains[q.domain] || 0) + 1;

      // Initialize domain skills if needed
      if (!stats.domainSkills[q.domain]) {
        stats.domainSkills[q.domain] = {};
      }

      // Count by skill within domain
      if (q.skill) {
        stats.domainSkills[q.domain][q.skill] =
          (stats.domainSkills[q.domain][q.skill] || 0) + 1;
      }
    }

    // Count by skill (global)
    if (q.skill) {
      stats.skills[q.skill] = (stats.skills[q.skill] || 0) + 1;
    }

    // Count by difficulty
    if (q.difficulty) {
      stats.difficulties[q.difficulty] =
        (stats.difficulties[q.difficulty] || 0) + 1;
    }
  });

  return stats;
}

// Calculate user-specific statistics
function calculateUserStats(questions: any[], userProgress: Map<string, any>) {
  const userStats = {
    totalAnswered: userProgress.size,
    totalCorrect: 0,
    totalIncorrect: 0,
    domains: {} as Record<
      string,
      { answered: number; correct: number; incorrect: number }
    >,
    skills: {} as Record<
      string,
      { answered: number; correct: number; incorrect: number }
    >,
    difficulties: {} as Record<
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
      if (!userStats.domains[question.domain]) {
        userStats.domains[question.domain] = {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
      }
      userStats.domains[question.domain].answered++;
      if (isCorrect) {
        userStats.domains[question.domain].correct++;
      } else {
        userStats.domains[question.domain].incorrect++;
      }
    }

    // Update skill stats
    if (question.skill) {
      if (!userStats.skills[question.skill]) {
        userStats.skills[question.skill] = {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
      }
      userStats.skills[question.skill].answered++;
      if (isCorrect) {
        userStats.skills[question.skill].correct++;
      } else {
        userStats.skills[question.skill].incorrect++;
      }
    }

    // Update difficulty stats
    if (question.difficulty) {
      if (!userStats.difficulties[question.difficulty]) {
        userStats.difficulties[question.difficulty] = {
          answered: 0,
          correct: 0,
          incorrect: 0,
        };
      }
      userStats.difficulties[question.difficulty].answered++;
      if (isCorrect) {
        userStats.difficulties[question.difficulty].correct++;
      } else {
        userStats.difficulties[question.difficulty].incorrect++;
      }
    }
  });

  return userStats;
}

// Update stats in Firebase
async function updateStatsInFirebase(stats: any) {
  try {
    const statsRef = doc(db, "questionStats", "summary");
    await setDoc(statsRef, {
      ...stats,
      updatedAt: new Date().toISOString(),
    });
    console.log("✅ Successfully updated question stats in Firebase");
    console.log("Stats summary:", {
      total: stats.total,
      domains: Object.keys(stats.domains).length,
      skills: Object.keys(stats.skills).length,
      difficulties: Object.keys(stats.difficulties).length,
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
    console.log("- Domains:", Object.entries(stats.domains));
    console.log("- Skills:", Object.entries(stats.skills));
    console.log("- Difficulties:", Object.entries(stats.difficulties));

    // Update Firebase with global stats
    await updateStatsInFirebase(stats);

    // Calculate and update user-specific stats for all users
    console.log("👥 Calculating user-specific statistics...");
    const userProgressQuery = query(collection(db, "userProgress"));
    const userProgressSnapshot = await getDocs(userProgressQuery);

    console.log(`Found ${userProgressSnapshot.size} users with progress`);

    // Group user progress by userId
    const userProgressMap = new Map<string, Map<string, any>>();
    userProgressSnapshot.forEach((doc) => {
      const data = doc.data();
      const userId = data.userId;
      if (!userProgressMap.has(userId)) {
        userProgressMap.set(userId, new Map());
      }
      const questionId = data.questionId || data.question_id;
      userProgressMap.get(userId)!.set(questionId, data);
    });

    // Calculate and update stats for each user
    for (const [userId, progressMap] of userProgressMap.entries()) {
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
