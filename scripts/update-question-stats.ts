import fs from "fs";
import path from "path";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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
      stats.difficulties[q.difficulty] = (stats.difficulties[q.difficulty] || 0) + 1;
    }
  });

  return stats;
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

// Main function
async function main() {
  console.log("🚀 Starting question stats update...");
  
  try {
    // Load questions
    const questions = loadQuestionsData();
    
    // Calculate stats
    console.log("📊 Calculating statistics...");
    const stats = calculateStats(questions);
    
    console.log("Statistics calculated:");
    console.log("- Total questions:", stats.total);
    console.log("- Domains:", Object.entries(stats.domains));
    console.log("- Skills:", Object.entries(stats.skills));
    console.log("- Difficulties:", Object.entries(stats.difficulties));
    
    // Update Firebase
    await updateStatsInFirebase(stats);
    
    console.log("✨ Done!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
