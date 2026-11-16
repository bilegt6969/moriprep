export const READING_WRITING_DOMAINS = [
  "Craft and Structure",
  "Information and Ideas",
  "Standard English Convention",
  "Expression of Ideas",
] as const;

export const WARMUP_DURATION_SECONDS = 5 * 60;

const MAX_VALID_ANSWER_TIME_MS = 6 * 60 * 1000;
const DEFAULT_AVERAGE_TIME_MS = 70 * 1000;
const WARMUP_PACING_FACTOR = 0.82;
const MAX_WARMUP_QUESTIONS = 20;

export interface WarmupProgressRecord {
  questionId?: string;
  domain?: string;
  skill?: string;
  attempts?: {
    isCorrect?: boolean;
    timeSpent?: number;
  }[];
}

export interface WarmupAnswerRecord {
  domain?: string;
  category?: string;
  isCorrect: boolean;
}

interface PerformanceStats {
  total: number;
  missed: number;
}

export interface WarmupPlan {
  skills: string[];
  domains: string[];
  priorityQuestionIds: string[];
  averageTimeMs: number;
  questionCount: number;
}

function isReadingWritingDomain(domain: string | undefined): domain is string {
  return (
    !!domain &&
    READING_WRITING_DOMAINS.some(
      (readingWritingDomain) => readingWritingDomain === domain,
    )
  );
}

function rankPerformance(
  stats: Map<string, PerformanceStats>,
): [string, PerformanceStats][] {
  return [...stats.entries()].sort(
    ([, a], [, b]) =>
      b.missed - a.missed ||
      b.missed / b.total - a.missed / a.total ||
      b.total - a.total,
  );
}

export function getWarmupPlan(
  progress: WarmupProgressRecord[],
  answers: WarmupAnswerRecord[] = [],
): WarmupPlan {
  const skillStats = new Map<string, PerformanceStats>();
  const domainStats = new Map<string, PerformanceStats>();
  const skillDomains = new Map<string, string>();
  const missedQuestions = new Map<
    string,
    { count: number; skillKey: string }
  >();
  let totalTimeMs = 0;
  let timedAttempts = 0;
  let hasReadingWritingAttemptHistory = false;

  for (const record of progress) {
    if (!isReadingWritingDomain(record.domain)) continue;
    if (record.attempts && record.attempts.length > 0) {
      hasReadingWritingAttemptHistory = true;
    }

    for (const attempt of record.attempts ?? []) {
      const time = attempt.timeSpent;
      if (
        typeof time === "number" &&
        (!Number.isFinite(time) || time < 0 || time >= MAX_VALID_ANSWER_TIME_MS)
      ) {
        continue;
      }

      if (typeof time === "number" && time > 0) {
        totalTimeMs += time;
        timedAttempts += 1;
      }

      const domainStatsForItem = domainStats.get(record.domain) ?? {
        total: 0,
        missed: 0,
      };
      domainStatsForItem.total += 1;
      if (!attempt.isCorrect) domainStatsForItem.missed += 1;
      domainStats.set(record.domain, domainStatsForItem);

      if (!record.skill) continue;
      const skillKey = `${record.domain}\u0000${record.skill}`;
      const skillStatsForItem = skillStats.get(skillKey) ?? {
        total: 0,
        missed: 0,
      };
      skillStatsForItem.total += 1;
      if (!attempt.isCorrect) skillStatsForItem.missed += 1;
      skillStats.set(skillKey, skillStatsForItem);
      skillDomains.set(skillKey, record.domain);

      if (!attempt.isCorrect && record.questionId) {
        const missedQuestion = missedQuestions.get(record.questionId) ?? {
          count: 0,
          skillKey,
        };
        missedQuestion.count += 1;
        missedQuestions.set(record.questionId, missedQuestion);
      }
    }
  }

  if (!hasReadingWritingAttemptHistory) {
    for (const answer of answers) {
      const domain = isReadingWritingDomain(answer.domain)
        ? answer.domain
        : isReadingWritingDomain(answer.category)
          ? answer.category
          : null;
      if (!domain) continue;

      const stats = domainStats.get(domain) ?? { total: 0, missed: 0 };
      stats.total += 1;
      if (!answer.isCorrect) stats.missed += 1;
      domainStats.set(domain, stats);
    }
  }

  const rankedSkills = rankPerformance(skillStats);
  const missedSkillEntries = rankedSkills
    .filter(([, stats]) => stats.missed > 0)
    .slice(0, 3);
  const selectedSkillEntries =
    missedSkillEntries.length > 0
      ? missedSkillEntries
      : rankedSkills.slice(0, 3);
  const skills = selectedSkillEntries.map(([key]) => key.split("\u0000")[1]);
  const domains = Array.from(
    new Set(selectedSkillEntries.map(([key]) => skillDomains.get(key)!)),
  );

  if (domains.length === 0) {
    domains.push(
      ...rankPerformance(domainStats)
        .slice(0, 3)
        .map(([domain]) => domain),
    );
  }
  if (domains.length === 0) domains.push(...READING_WRITING_DOMAINS);

  const selectedSkillKeys = new Set(selectedSkillEntries.map(([key]) => key));
  const priorityQuestionIds = [...missedQuestions.entries()]
    .filter(([, details]) => selectedSkillKeys.has(details.skillKey))
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, MAX_WARMUP_QUESTIONS)
    .map(([questionId]) => questionId);

  const averageTimeMs =
    timedAttempts > 0 ? totalTimeMs / timedAttempts : DEFAULT_AVERAGE_TIME_MS;
  const questionCount = Math.max(
    1,
    Math.min(
      MAX_WARMUP_QUESTIONS,
      Math.floor(
        (WARMUP_DURATION_SECONDS * 1000 * WARMUP_PACING_FACTOR) / averageTimeMs,
      ),
    ),
  );

  return {
    skills,
    domains,
    priorityQuestionIds,
    averageTimeMs,
    questionCount,
  };
}
