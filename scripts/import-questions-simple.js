require('dotenv').config({ path: '.env.local' });
const { initializeApp, getApps, getApp } = require("firebase/app");
const { getFirestore, doc, setDoc, collection } = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

// Use client-side Firebase SDK with existing environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set in environment variables");
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('FIREBASE')));
  process.exit(1);
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

async function importQuestions() {
  const questionsPath = path.join(process.cwd(), "questions.json");
  
  if (!fs.existsSync(questionsPath)) {
    console.error("questions.json not found. Please create it with your question data.");
    process.exit(1);
  }

  const questionsData = fs.readFileSync(questionsPath, "utf-8");
  const questions = JSON.parse(questionsData);

  console.log(`Found ${questions.length} questions to import`);

  // Validate question_id values
  const invalidIds = questions.filter(q => !q.question_id || /[\/\\]/.test(q.question_id));
  if (invalidIds.length > 0) {
    console.error("Found invalid question_id values:", invalidIds.map(q => q.question_id));
    process.exit(1);
  }

  let imported = 0;
  let errors = 0;

  for (const question of questions) {
    try {
      // Clean data by removing undefined values
      const cleanData = JSON.parse(JSON.stringify(question));
      
      // Add timestamp
      cleanData.createdAt = new Date().toISOString();
      
      // Use client SDK with proper document reference
      const docRef = doc(collection(db, "questions"), question.question_id);
      await setDoc(docRef, cleanData);
      
      imported++;
      if (imported % 100 === 0) {
        console.log(`Imported ${imported}/${questions.length} questions`);
      }
    } catch (error) {
      console.error(`Failed at ID: ${question.question_id}`);
      console.error("Error:", error.message);
      errors++;
      // Continue with next question instead of stopping
    }
  }

  console.log(`\nImport complete: ${imported} questions imported, ${errors} errors`);
}

importQuestions().catch(console.error);
