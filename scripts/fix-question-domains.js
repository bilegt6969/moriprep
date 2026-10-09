const fs = require("fs");
const path = require("path");

const SKILL_TO_DOMAIN = {
  "Central Ideas and Details": "Information and Ideas",
  "Inferences": "Information and Ideas",
  "Command of Evidence — Textual": "Information and Ideas",
  "Command of Evidence — Quantitative": "Information and Ideas",
  "Rhetorical Synthesis": "Expression of Ideas",
  "Transitions": "Expression of Ideas",
  "Words in Context": "Craft and Structure",
  "Text Structure and Purpose": "Craft and Structure",
  "Cross-Text Connections": "Craft and Structure",
  "Boundaries": "Standard English Conventions",
  "Form, Structure, and Sense": "Standard English Conventions",
};

const filePath = path.join(process.cwd(), "questions.json");
const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));

let fixed = 0;
let stillMissing = 0;

for (const q of questions) {
  if (!q.domain) {
    const inferred = SKILL_TO_DOMAIN[q.skill];
    if (inferred) {
      q.domain = inferred;
      fixed++;
    } else {
      console.warn("No domain mapping for skill:", q.skill, "question_id:", q.question_id);
      stillMissing++;
    }
  }
}

fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
console.log(`Fixed ${fixed} questions. ${stillMissing} still missing a domain (check warnings above).`);
