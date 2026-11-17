const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { SKILLS } = require("../lib/dsat/math-skills.js");

const root = path.resolve(__dirname, "..");
const rawDirectory = path.join(root, "raw-math");
const outputPath = path.join(root, "public", "data", "math_questions.json");
const difficultyLabels = ["Easy", "Medium", "Hard"];

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&#(\d+);/g, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function normalizeStem(stem) {
  return decodeEntities(
    stem
      .replace(
        /<math\b[^>]*\balttext=(["'])(.*?)\1[^>]*>[\s\S]*?<\/math>/gi,
        " $2 ",
      )
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getDeduplicationKey(question) {
  const externalId = question.externalId ?? question.external_id;
  if (typeof externalId === "string" && externalId.trim()) {
    return `external:${externalId}`;
  }
  if (Number.isSafeInteger(question.id)) {
    return `id:${question.id}`;
  }

  const stem = question.question ?? question.stem;
  const normalizedStem = typeof stem === "string" ? normalizeStem(stem) : "";
  return normalizedStem ? `stem:${normalizedStem}` : null;
}

function cleanAnswer(content) {
  return decodeEntities(content.replace(/<[^>]*>/g, "").trim()).trim();
}

function decodeQuestion(fileName, source) {
  const code = source.replace(/^;0x[0-9a-f]+;/i, "");
  const context = vm.createContext(
    {},
    { codeGeneration: { strings: false, wasm: false } },
  );
  context.self = context;
  context.$R = {};
  vm.runInContext(code, context, {
    filename: fileName,
    timeout: 1000,
  });
  return context.$R?.["server-fn:0"]?.[0];
}

function getServerError(decoded, source) {
  const notFound = source.match(/404\s*-\s*Question ID[^\r\n]*/i)?.[0];
  if (notFound) return notFound;

  const error =
    decoded?.name === "Error"
      ? decoded
      : decoded?.question?.name === "Error"
        ? decoded.question
        : null;
  return error ? error.message || error.name : null;
}

function toSATMathQuestion(fileName, decoded) {
  const question = decoded?.question;
  const answers = decoded?.answers;
  if (
    !question ||
    typeof question.stem !== "string" ||
    typeof question.rationale !== "string" ||
    !Array.isArray(answers) ||
    answers.length === 0
  ) {
    throw new Error("Missing question stem, rationale, or answers");
  }

  const mappedSkill = SKILLS[question.skill];
  if (!mappedSkill || !difficultyLabels[question.difficulty]) {
    throw new Error(
      `Unsupported skill/difficulty: ${question.skill}/${question.difficulty}`,
    );
  }

  const correctAnswers = answers.filter((answer) => answer.correct);
  if (correctAnswers.length === 0) {
    throw new Error("No correct answer provided");
  }
  if (typeof question.isLive !== "boolean") {
    throw new Error("Question is missing its isLive status");
  }
  if (
    typeof question.multiChoice !== "boolean" ||
    answers.some((answer) => typeof answer.content !== "string")
  ) {
    throw new Error("Question has invalid answer data");
  }

  const questionId = path.basename(fileName, ".txt").toLowerCase();
  const isMultipleChoice = question.multiChoice === true;
  if (isMultipleChoice && correctAnswers.length !== 1) {
    throw new Error(
      "Multiple-choice question must have exactly one correct answer",
    );
  }
  let choices = {};
  let correctAnswer;
  let correctAnswerText;
  let acceptedAnswers;

  if (isMultipleChoice) {
    choices = Object.fromEntries(
      answers.map((answer, index) => [
        String.fromCharCode(65 + index),
        answer.content,
      ]),
    );
    const correctIndex = answers.findIndex((answer) => answer.correct);
    correctAnswer = String.fromCharCode(65 + correctIndex);
    correctAnswerText = answers[correctIndex].content;
  } else {
    acceptedAnswers = correctAnswers
      .map((answer) => cleanAnswer(answer.content))
      .filter(Boolean);
    if (acceptedAnswers.length !== correctAnswers.length) {
      throw new Error("A correct free-response answer has no usable text");
    }
    correctAnswer = acceptedAnswers[0];
    correctAnswerText = correctAnswers[0].content;
  }

  const media = [
    question.stem,
    question.rationale,
    ...answers.map((answer) => answer.content),
  ].join(" ");
  const result = {
    question_id: questionId,
    id: Number.isSafeInteger(question.id) ? question.id : null,
    isLive: question.isLive,
    externalId: question.externalId ?? null,
    ibn: question.ibn ?? null,
    assessment: "SAT",
    test: "Math",
    domain: mappedSkill.domain,
    skill: mappedSkill.skill,
    difficulty: difficultyLabels[question.difficulty],
    question_type: isMultipleChoice ? "mcq" : "spr",
    question: question.stem,
    math_expressions: [],
    has_figure: /<(?:svg|img)\b/i.test(media),
    figures: [],
    choices,
    correct_answer: correctAnswer,
    correct_answer_text: correctAnswerText,
    rationale: question.rationale,
    parse_status: "strict",
    source_file: `raw-math/${fileName}`,
    raw_text: question.stem,
  };

  if (!isMultipleChoice) {
    result.accepted_answers = acceptedAnswers;
  }

  return { result, deduplicationKey: getDeduplicationKey(question) };
}

function main() {
  const knownKeys = new Set();
  const files = fs
    .readdirSync(rawDirectory)
    .filter((fileName) => fileName.endsWith(".txt"))
    .sort();
  const imported = [];
  let skipped = 0;
  let duplicates = 0;
  let failed = 0;

  for (const fileName of files) {
    let source = "";
    try {
      source = fs.readFileSync(path.join(rawDirectory, fileName), "utf8");
      const decoded = decodeQuestion(fileName, source);
      const serverError = getServerError(decoded, source);
      if (serverError) {
        skipped += 1;
        console.log(`[skip] ${fileName}: ${serverError}`);
        continue;
      }

      const { result, deduplicationKey } = toSATMathQuestion(fileName, decoded);
      if (deduplicationKey && knownKeys.has(deduplicationKey)) {
        duplicates += 1;
        continue;
      }

      imported.push(result);
      if (deduplicationKey) knownKeys.add(deduplicationKey);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/new Error\s*\(|404\s*-\s*Question ID/i.test(source)) {
        skipped += 1;
        console.log(`[skip] ${fileName}: ${message}`);
      } else {
        failed += 1;
        console.error(`[failed] ${fileName}: ${message}`);
      }
    }
  }

  fs.writeFileSync(outputPath, `${JSON.stringify(imported, null, 2)}\n`);

  console.log(`Raw files: ${files.length}`);
  console.log(
    `Import complete: ${imported.length} imported, ${skipped} skipped (server errors), ${failed} failed, ${duplicates} duplicates.`,
  );
  console.log(`Math question count: ${imported.length}`);

  const rawQuestions = imported;
  const sampleQuestions = [
    [
      "normal multiple-choice",
      rawQuestions.find(
        (question) =>
          question.question_type === "mcq" &&
          Object.keys(question.choices).length === 4 &&
          !Object.values(question.choices).some((choice) =>
            /<table\b/i.test(choice),
          ),
      ),
    ],
    [
      "fill-in with two accepted answers",
      rawQuestions.find(
        (question) =>
          question.question_type === "spr" &&
          question.accepted_answers?.length === 2,
      ),
    ],
    [
      "table answer",
      rawQuestions.find((question) =>
        Object.values(question.choices).some((choice) =>
          /<table\b/i.test(choice),
        ),
      ),
    ],
    [
      "base64 math image",
      rawQuestions.find((question) =>
        [
          question.question,
          question.rationale,
          ...Object.values(question.choices),
        ].some((html) =>
          /<img\b(?=[^>]*\bclass=["'][^"']*\bmath-img\b)(?=[^>]*\bsrc=["']data:image\/)[^>]*>/i.test(
            html,
          ),
        ),
      ),
    ],
  ];
  for (const [label, question] of sampleQuestions) {
    if (!question) {
      throw new Error(
        `Could not find an imported ${label} verification sample`,
      );
    }
    console.log(`Verified ${label}: ${question.question_id}`);
  }

  console.log("Imported questions by skill:");
  for (const { skill } of Object.values(SKILLS)) {
    const count = imported.filter(
      (question) => question.skill === skill,
    ).length;
    console.log(`  ${skill}: ${count}`);
  }
}

main();
