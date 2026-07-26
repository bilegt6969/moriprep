const { initializeApp, getApps, getApp } = require("firebase/app");
const { getFirestore, writeBatch, doc, collection } = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

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

  let imported = 0;
  let errors = 0;

  // Import one by one with minimal data
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    try {
      const singleBatch = writeBatch(db);
      const docRef = doc(collection(db, "questions"), question.question_id);
      
      // Minimal fields only
      const minimalData = {
        id: String(question.question_id),
        domain: String(question.domain || ""),
        difficulty: String(question.difficulty || ""),
        skill: String(question.skill || ""),
        createdAt: new Date().toISOString(),
      };
      
      singleBatch.set(docRef, minimalData);
      await singleBatch.commit();
      imported++;
      
      if (imported % 100 === 0) {
        console.log(`Imported ${imported}/${questions.length} questions`);
      }
    } catch (error) {
      console.error(`Failed to import question ${question.question_id}:`, error.message);
      errors++;
      
      // If we get too many errors, stop
      if (errors > 10) {
        console.log("Too many errors, stopping import");
        break;
      }
    }
  }

  console.log(`\nImport complete: ${imported} questions imported, ${errors} errors`);
}

importQuestions().catch(console.error);
