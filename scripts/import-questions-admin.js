require("dotenv").config({ path: ".env.local" });
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Initialize Firebase Admin with service account JSON file
const serviceAccountPath = path.join(
  process.cwd(),
  "bytecode-c55af-firebase-adminsdk-fbsvc-f4e6aede65.json",
);
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to sanitize document ID (remove invalid characters)
function sanitizeDocumentId(id) {
  // Firestore doesn't allow these characters in document IDs: / \ . # $ [ ]
  return id.replace(/[\/\\.#$\[\]]/g, "_");
}

// Function to sanitize graphics data to remove nested arrays
function sanitizeGraphics(graphics) {
  if (!Array.isArray(graphics)) return [];

  return graphics.map((graphic) => {
    const sanitized = {};
    for (const key in graphic) {
      if (graphic.hasOwnProperty(key)) {
        const value = graphic[key];
        if (Array.isArray(value)) {
          // Convert nested arrays to strings
          sanitized[key] = JSON.stringify(value);
        } else if (typeof value === "object" && value !== null) {
          sanitized[key] = JSON.stringify(value);
        } else {
          sanitized[key] = value;
        }
      }
    }
    return sanitized;
  });
}

async function importQuestions() {
  const questionsPath = path.join(process.cwd(), "questions.json");
  if (!fs.existsSync(questionsPath)) {
    console.error(
      "questions.json not found. Please create it with your question data.",
    );
    process.exit(1);
  }

  const questionsData = fs.readFileSync(questionsPath, "utf-8");
  const questions = JSON.parse(questionsData);
  console.log(`Found ${questions.length} questions to import`);

  const batchSize = 100;
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = db.batch();
    const batchQuestions = questions.slice(i, i + batchSize);

    batchQuestions.forEach((question) => {
      try {
        const sanitizedId = sanitizeDocumentId(question.question_id);
        const docRef = db.collection("questions").doc(sanitizedId);

        const minimalData = {
          id: String(question.question_id),
          question_id: String(question.question_id),
          assessment: String(question.assessment || ""),
          test: String(question.test || ""),
          domain: String(question.domain || ""),
          skill: String(question.skill || ""),
          difficulty: String(question.difficulty || ""),
          passage: String(question.passage || ""),
          prompt: String(question.prompt || ""),
          question: String(question.question || ""),
          choices: question.choices || {},
          correct_answer: String(question.correct_answer || ""),
          correct_answer_text: String(question.correct_answer_text || ""),
          rationale: String(question.rationale || ""),
          parse_status: String(question.parse_status || ""),
          source_file: String(question.source_file || ""),
          source_page: Number(question.source_page) || 0,
          has_graphic: Boolean(question.has_graphic),
          graphics: sanitizeGraphics(question.graphics),
          createdAt: new Date().toISOString(),
        };

        batch.set(docRef, minimalData);
      } catch (error) {
        console.error(
          `Error processing question ${question.question_id}:`,
          error.message,
        );
      }
    });

    if (batch._ops.length === 0) {
      console.log(`Skipping batch ${i}-${i + batchSize} - no valid questions`);
      continue;
    }

    try {
      await batch.commit();
      imported += batch._ops.length;
      console.log(`Imported ${imported}/${questions.length} questions`);
    } catch (error) {
      console.error(
        `Error importing batch ${i}-${i + batchSize}:`,
        error.message,
      );
      errors += batchQuestions.length;
    }
  }

  console.log(
    `\nImport complete: ${imported} questions imported, ${errors} errors`,
  );
}

importQuestions().catch(console.error);
