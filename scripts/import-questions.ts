import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// Initialize Firebase Admin with service account
const serviceAccountPath = path.join(
  process.cwd(),
  "bytecode-c55af-firebase-adminsdk-fbsvc-f4e6aede65.json",
);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Ensure project ID matches client config
serviceAccount.project_id = "bytecode-c55af";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

interface DSATQuestion {
  question_id: string;
  assessment: string;
  test: string;
  domain: string;
  skill: string;
  difficulty: string;
  passage: string;
  prompt: string;
  question: string;
  choices: {
    [key: string]: string;
  };
  correct_answer: string;
  correct_answer_text: string;
  rationale: string;
  parse_status: string;
  source_file: string;
  source_page?: number;
  has_graphic: boolean;
  graphics: any[];
  raw_text: string;
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
  const questions: any[] = JSON.parse(questionsData);

  console.log(`Found ${questions.length} questions to import`);

  // Validate question_id values
  const invalidIds = questions.filter(
    (q: any) => !q.question_id || /[\/\\]/.test(q.question_id),
  );
  if (invalidIds.length > 0) {
    console.error(
      "Found invalid question_id values:",
      invalidIds.map((q: any) => q.question_id),
    );
    process.exit(1);
  }

  let imported = 0;
  let errors = 0;

  for (const question of questions) {
    try {
      // Validate document ID more thoroughly
      if (!question.question_id || typeof question.question_id !== "string") {
        throw new Error(`Invalid question_id: ${question.question_id}`);
      }

      // Check for invalid characters in document ID
      if (/[\/\\]/.test(question.question_id)) {
        throw new Error(
          `question_id contains invalid characters: ${question.question_id}`,
        );
      }

      // Check for reserved field names starting with __
      const cleanData = JSON.parse(JSON.stringify(question));
      const hasReservedFields = Object.keys(cleanData).some((key) =>
        key.startsWith("__"),
      );
      if (hasReservedFields) {
        throw new Error(`Contains reserved fields starting with __`);
      }

      // Convert nested arrays in graphics to strings to avoid Firestore array nesting issues
      if (cleanData.graphics && Array.isArray(cleanData.graphics)) {
        cleanData.graphics = cleanData.graphics.map((graphic: any) => {
          const cleanGraphic = { ...graphic };
          // Convert nested arrays to JSON strings
          if (cleanGraphic.headers && Array.isArray(cleanGraphic.headers)) {
            cleanGraphic.headers = JSON.stringify(cleanGraphic.headers);
          }
          if (cleanGraphic.rows && Array.isArray(cleanGraphic.rows)) {
            cleanGraphic.rows = JSON.stringify(cleanGraphic.rows);
          }
          return cleanGraphic;
        });
      }

      // Add timestamp
      cleanData.createdAt = new Date().toISOString();

      // Use individual write with specific document ID
      await db.collection("questions").doc(question.question_id).set(cleanData);

      imported++;
      if (imported % 100 === 0) {
        console.log(`Imported ${imported}/${questions.length} questions`);
      }
    } catch (error: any) {
      console.error(`\n=== FAILED ===`);
      console.error(`Question ID: ${question.question_id}`);
      console.error(`Error: ${error.message}`);
      console.error(
        `First 300 chars of data:`,
        JSON.stringify(question).substring(0, 300),
      );
      errors++;

      // Stop after first 5 errors to avoid spam
      if (errors >= 5) {
        console.error(
          "\nStopping import due to multiple errors. Please fix the issues above.",
        );
        break;
      }
    }
  }

  console.log(
    `\nImport complete: ${imported} questions imported, ${errors} errors`,
  );
}

importQuestions().catch(console.error);
