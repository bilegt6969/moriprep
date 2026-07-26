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

// Function to sanitize data by removing nested arrays
function sanitizeData(obj) {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    // If it's an array, check if elements are objects/arrays
    return obj.map(item => sanitizeData(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        // If value is an array of arrays, convert to array of strings or remove
        if (Array.isArray(value)) {
          const hasNestedArrays = value.some(item => Array.isArray(item));
          if (hasNestedArrays) {
            // Flatten nested arrays or convert to string representation
            sanitized[key] = value.map(item => 
              Array.isArray(item) ? JSON.stringify(item) : sanitizeData(item)
            );
          } else {
            sanitized[key] = sanitizeData(value);
          }
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = sanitizeData(value);
        } else {
          sanitized[key] = value;
        }
      }
    }
    return sanitized;
  }
  
  return obj;
}

async function importQuestions() {
  const questionsPath = path.join(process.cwd(), "questions.json");
  if (!fs.existsSync(questionsPath)) {
    console.error("questions.json not found. Please create it with your question data.");
    process.exit(1);
  }

  const questionsData = fs.readFileSync(questionsPath, "utf-8");
  const questions = JSON.parse(questionsData);
  console.log(`Found ${questions.length} questions to import`);

  const batchSize = 500;
  let imported = 0;
  let errors = 0;
  let skipped = 0;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = writeBatch(db);
    const batchQuestions = questions.slice(i, i + batchSize);
    
    batchQuestions.forEach((question) => {
      try {
        const sanitizedQuestion = sanitizeData(question);
        const docRef = doc(collection(db, "questions"), question.question_id);
        batch.set(docRef, {
          ...sanitizedQuestion,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Error sanitizing question ${question.question_id}:`, error.message);
        skipped++;
      }
    });

    if (batch._mutations.length === 0) {
      console.log(`Skipping batch ${i}-${i + batchSize} - no valid questions`);
      continue;
    }

    try {
      await batch.commit();
      imported += batch._mutations.length;
      console.log(`Imported ${imported}/${questions.length} questions`);
    } catch (error) {
      console.error(`Error importing batch ${i}-${i + batchSize}:`, error.message);
      errors += batchQuestions.length;
    }
  }

  console.log(`\nImport complete: ${imported} questions imported, ${errors} errors, ${skipped} skipped`);
}

importQuestions().catch(console.error);
