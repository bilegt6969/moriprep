import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

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

async function testImport() {
  console.log("Testing Firebase connection with minimal data...");

  // Test 1: Simple document with different collection
  try {
    const docRef = doc(collection(db, "test"), "connection");
    await setDoc(docRef, {
      test: true,
      timestamp: new Date().toISOString(),
    });
    console.log("✓ Firebase connection works!");
  } catch (error: any) {
    console.error("✗ Firebase connection failed:", error.message);
    console.error("This suggests a Firebase configuration issue.");
    console.error(
      "Please check your .env.local file has valid Firebase credentials.",
    );
    return;
  }

  const questionsPath = path.join(process.cwd(), "questions.json");
  const questionsData = fs.readFileSync(questionsPath, "utf-8");
  const questions: any[] = JSON.parse(questionsData);

  console.log(`Found ${questions.length} questions`);
  console.log(`Testing first question...`);

  const firstQuestion = questions[0];
  console.log(`Question ID: ${firstQuestion.question_id}`);
  console.log(`Field names:`, Object.keys(firstQuestion));

  // Try to import just the first question
  try {
    const cleanData = JSON.parse(JSON.stringify(firstQuestion));
    cleanData.createdAt = new Date().toISOString();

    const docRef = doc(collection(db, "questions"), firstQuestion.question_id);
    await setDoc(docRef, cleanData);
    console.log("✓ First question imported successfully!");
  } catch (error: any) {
    console.error("✗ Failed to import first question:");
    console.error("Error:", error.message);
    console.error("Error code:", error.code);

    // Try field by field to isolate the issue
    console.log("\nTesting field by field...");
    const fields = Object.keys(firstQuestion);
    let testData: any = {};

    for (const field of fields) {
      testData[field] = firstQuestion[field];
      try {
        const docRef = doc(
          collection(db, "questions"),
          firstQuestion.question_id + "_test_" + field,
        );
        await setDoc(docRef, testData);
        console.log(`✓ Field '${field}' OK`);
      } catch (fieldError: any) {
        console.error(`✗ Field '${field}' FAILED:`, fieldError.message);
        console.log(`   Field value type:`, typeof firstQuestion[field]);
        console.log(
          `   Field value length:`,
          JSON.stringify(firstQuestion[field]).length,
        );
      }
    }
  }
}

testImport().catch(console.error);
