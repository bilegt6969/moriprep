const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const serviceAccount = require("./serviceAccountKey.json"); // download from Firebase console → Project Settings → Service Accounts

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const SKILL_TO_DOMAIN = {
  "Central Ideas and Details": "Information and Ideas",
  Inferences: "Information and Ideas",
  "Command of Evidence — Textual": "Information and Ideas",
  "Command of Evidence — Quantitative": "Information and Ideas",
  "Command of Evidence": "Information and Ideas", // Alternative naming
  "Rhetorical Synthesis": "Expression of Ideas",
  Transitions: "Expression of Ideas",
  "Words in Context": "Craft and Structure",
  "Text Structure and Purpose": "Craft and Structure",
  "Cross-Text Connections": "Craft and Structure",
  Boundaries: "Standard English Conventions",
  "Form, Structure, and Sense": "Standard English Conventions",
  "Form Structure and Sense": "Standard English Conventions", // Alternative naming
};

// Load questions.json to look up skills by questionId
const questionsPath = path.join(process.cwd(), "questions.json");
const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
const questionMap = new Map();
for (const q of questions) {
  questionMap.set(q.question_id, q);
}

function resolveDomain(skill) {
  if (!skill) return null;
  return SKILL_TO_DOMAIN[skill] || null;
}

async function backfill() {
  const snapshot = await db.collection("userProgress").get();
  console.log(`Scanning ${snapshot.size} userProgress docs...`);

  let updated = 0;
  let skippedAlreadyHasDomain = 0;
  let skippedNoQuestion = 0;
  let skippedNoSkill = 0;
  const batchSize = 400; // stay under Firestore's 500-op batch limit
  let batch = db.batch();
  let opsInBatch = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.domain) {
      skippedAlreadyHasDomain++;
      continue;
    }

    // Try to get skill from existing data first
    let skill = data.skill;
    let domain = null;

    // If no skill in doc, look it up from questions.json
    if (!skill) {
      const question = questionMap.get(data.questionId);
      if (!question) {
        skippedNoQuestion++;
        console.warn("Question not found in questions.json:", data.questionId);
        continue;
      }
      skill = question.skill;
    }

    // Now try to resolve domain from skill
    domain = resolveDomain(skill);
    if (!domain) {
      skippedNoSkill++;
      console.warn("Cannot infer domain for doc", doc.id, "skill:", skill);
      continue;
    }

    // Update both domain and skill if they were missing
    const updateData = { domain };
    if (!data.skill) {
      updateData.skill = skill;
    }

    batch.update(doc.ref, updateData);
    opsInBatch++;
    updated++;

    if (opsInBatch >= batchSize) {
      await batch.commit();
      batch = db.batch();
      opsInBatch = 0;
    }
  }

  if (opsInBatch > 0) {
    await batch.commit();
  }

  console.log(
    `Done. Updated: ${updated}, already had domain: ${skippedAlreadyHasDomain}, question not found: ${skippedNoQuestion}, unresolvable: ${skippedNoSkill}`,
  );
}

backfill().catch(console.error);
