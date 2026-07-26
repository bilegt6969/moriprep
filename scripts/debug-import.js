const fs = require("fs");
const path = require("path");

async function debugImport() {
  const questionsPath = path.join(process.cwd(), "questions.json");
  
  if (!fs.existsSync(questionsPath)) {
    console.error("questions.json not found.");
    process.exit(1);
  }

  const questionsData = fs.readFileSync(questionsPath, "utf-8");
  const questions = JSON.parse(questionsData);

  console.log(`Found ${questions.length} questions to import`);
  
  // Find the exact question that is causing the initial failure
  const testQuestion = questions.find(q => q.question_id === 'f1bfbed3') || questions[0];

  console.log("--- EXACT DATA FIRESTORE IS REJECTING ---");
  console.log(JSON.stringify(testQuestion, null, 2));

  // We are intentionally NOT calling db.collection().set() here
  // so the script doesn't get stuck in the gRPC error loop.
}

debugImport();
