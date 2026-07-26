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

// Function to convert choices to Firestore-compatible format
function sanitizeChoices(choices) {
  if (!choices || typeof choices !== 'object') return {};
  
  const sanitized = {};
  for (const key in choices) {
    if (choices.hasOwnProperty(key)) {
      const value = choices[key];
      // Convert any value to string to avoid nested arrays
      sanitized[key] = String(value);
    }
  }
  return sanitized;
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

  const batchSize = 100;
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = writeBatch(db);
    const batchQuestions = questions.slice(i, i + batchSize);
    
    batchQuestions.forEach((question) => {
      try {
        const docRef = doc(collection(db, "questions"), question.question_id);
        
        const sanitizedData = {
          question_id: question.question_id,
          assessment: question.assessment,
          test: question.test,
          domain: question.domain,
          skill: question.skill,
          difficulty: question.difficulty,
          passage: question.passage || "",
          prompt: question.prompt || "",
          question: question.question || "",
          choices: sanitizeChoices(question.choices),
          correct_answer: String(question.correct_answer || ""),
          correct_answer_text: question.correct_answer_text || "",
          rationale: question.rationale || "",
          parse_status: question.parse_status || "",
          source_file: question.source_file || "",
          source_page: question.source_page || 0,
          has_graphic: Boolean(question.has_graphic),
          createdAt: new Date().toISOString(),
        };
        
        batch.set(docRef, sanitizedData);
      } catch (error) {
        console.error(`Error processing question ${question.question_id}:`, error.message);
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
      
      // Try one by one
      for (const question of batchQuestions) {
        try {
          const singleBatch = writeBatch(db);
          const docRef = doc(collection(db, "questions"), question.question_id);
          
          const sanitizedData = {
            question_id: question.question_id,
            assessment: question.assessment,
            test: question.test,
            domain: question.domain,
            skill: question.skill,
            difficulty: question.difficulty,
            passage: question.passage || "",
            prompt: question.prompt || "",
            question: question.question || "",
            choices: sanitizeChoices(question.choices),
            correct_answer: String(question.correct_answer || ""),
            correct_answer_text: question.correct_answer_text || "",
            rationale: question.rationale || "",
            parse_status: question.parse_status || "",
            source_file: question.source_file || "",
            source_page: question.source_page || 0,
            has_graphic: Boolean(question.has_graphic),
            createdAt: new Date().toISOString(),
          };
          
          singleBatch.set(docRef, sanitizedData);
          await singleBatch.commit();
          imported++;
          console.log(`Imported question ${question.question_id}`);
        } catch (singleError) {
          console.error(`Failed to import question ${question.question_id}:`, singleError.message);
          errors++;
        }
      }
    }
  }

  console.log(`\nImport complete: ${imported} questions imported, ${errors} errors`);
}

importQuestions().catch(console.error);
