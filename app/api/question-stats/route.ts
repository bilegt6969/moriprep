import { db, doc, getDoc } from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";

const isDev = process.env.NODE_ENV !== "production";
const log = (...args: unknown[]) => {
  if (isDev) console.log(...args);
};

// Sanitize field names to match the offline stats-generation script.
function sanitizeFieldName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function parseListParam(searchParams: URLSearchParams, key: string): string[] {
  const comma = searchParams.get(key);
  const fromComma = comma ? comma.split(",").map((v) => v.trim()) : [];
  const repeated = searchParams.getAll(key).map((v) => v.trim());
  return [...new Set([...fromComma, ...repeated])].filter(Boolean);
}

/**
 * Ratio of "answered" volume that falls within the selected difficulties.
 * Used to approximate a domain/skill count when a difficulty filter is
 * layered on top, since we don't store a joint domain+skill x difficulty
 * breakdown. Handles both the global shape (`{ [difficulty]: number }`) and
 * the per-user shape (`{ [difficulty]: { answered, correct, incorrect } }`).
 * Returns 1 (no-op) when there's no difficulty filter or nothing to compare
 * against.
 */
function getDifficultyRatio(
  difficultyCounts: Record<string, unknown> | undefined,
  difficulties: string[],
): number {
  if (difficulties.length === 0) return 1;
  const counts = difficultyCounts || {};
  const valueOf = (entry: unknown) =>
    toNumber(typeof entry === "number" ? entry : (entry as any)?.answered);

  const matched = difficulties.reduce(
    (sum, diff) => sum + valueOf(counts[sanitizeFieldName(diff)]),
    0,
  );
  const total = Object.values(counts).reduce(
    (sum: number, entry) => sum + valueOf(entry),
    0,
  );

  return total > 0 ? matched / total : 1;
}

function sumGlobalCounts(
  source: Record<string, unknown> | undefined,
  keys: string[],
): number {
  return keys.reduce(
    (sum, key) => sum + toNumber(source?.[sanitizeFieldName(key)]),
    0,
  );
}

type UserBucket = { answered: number; correct: number; incorrect: number };

function sumUserCounts(
  source:
    | Record<
        string,
        { answered?: unknown; correct?: unknown; incorrect?: unknown }
      >
    | undefined,
  keys: string[],
): UserBucket {
  return keys.reduce<UserBucket>(
    (acc, key) => {
      const entry = source?.[sanitizeFieldName(key)];
      acc.answered += toNumber(entry?.answered);
      acc.correct += toNumber(entry?.correct);
      acc.incorrect += toNumber(entry?.incorrect);
      return acc;
    },
    { answered: 0, correct: 0, incorrect: 0 },
  );
}

function sumJointUserCounts(
  jointCounts:
    | Record<
        string,
        { answered?: unknown; correct?: unknown; incorrect?: unknown } | number
      >
    | undefined,
  primaryKeys: string[], // sanitized skills or domains
  difficulties: string[], // sanitized
): UserBucket | null {
  if (!jointCounts) return null;
  let sawAnyKey = false;
  const bucket: UserBucket = { answered: 0, correct: 0, incorrect: 0 };
  const valueOf = (entry: unknown) =>
    toNumber(typeof entry === "number" ? entry : (entry as any)?.answered);

  for (const p of primaryKeys) {
    for (const d of difficulties) {
      const key = `${p}__${d}`;
      const entry = jointCounts[key];
      if (entry !== undefined) sawAnyKey = true;
      bucket.answered += valueOf(entry);
      // global shape has no correct/incorrect breakdown per key — only
      // populate those when the entry is the richer per-user object shape
      if (typeof entry === "object" && entry !== null) {
        bucket.correct += toNumber(entry.correct);
        bucket.incorrect += toNumber(entry.incorrect);
      }
    }
  }
  return sawAnyKey ? bucket : null;
}

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      console.error("Firebase db is not initialized");
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const test = searchParams.get("test") || "Reading and Writing";
    const combinedDomains = parseListParam(searchParams, "domain");
    const combinedSkills = parseListParam(searchParams, "skill");
    const difficulties = parseListParam(searchParams, "difficulty");
    const hasFilters =
      combinedDomains.length > 0 ||
      combinedSkills.length > 0 ||
      difficulties.length > 0;

    log("=== question-stats API called ===", {
      userId,
      test,
      combinedDomains,
      combinedSkills,
      difficulties,
    });

    // ---- Per-user stats ----
    if (userId) {
      const userStatsDocName = test === "Math" ? `${userId}-math` : userId;
      const userStatsDoc = await getDoc(
        doc(db, "userQuestionStats", userStatsDocName),
      );

      if (!userStatsDoc.exists()) {
        log("User stats not found in Firebase for user:", userId);
        return NextResponse.json({ answered: 0, correct: 0, incorrect: 0 });
      }

      const userStats = userStatsDoc.data();

      if (!hasFilters) {
        return NextResponse.json({
          answered: toNumber(userStats.totalAnswered),
          correct: toNumber(userStats.totalCorrect),
          incorrect: toNumber(userStats.totalIncorrect),
        });
      }

      // Skill-level stats are the most specific and are used whenever skills
      // are selected — the client always keeps `skill` in sync with the
      // selected `domain`, so this also covers the "domain + skill" case.
      let bucket: UserBucket | null = null;

      // Exact path: skill/domain AND difficulty both selected — use joint counts.
      if (difficulties.length > 0 && combinedSkills.length > 0) {
        bucket = sumJointUserCounts(
          userStats?.skillDifficultyCounts,
          combinedSkills.map(sanitizeFieldName),
          difficulties.map(sanitizeFieldName),
        );
      } else if (difficulties.length > 0 && combinedDomains.length > 0) {
        bucket = sumJointUserCounts(
          userStats?.domainDifficultyCounts,
          combinedDomains.map(sanitizeFieldName),
          difficulties.map(sanitizeFieldName),
        );
      }

      if (bucket === null) {
        // No filters combined that need a join, OR pre-migration data with no
        // joint buckets yet — fall back to the existing 1D + ratio estimate.
        if (combinedSkills.length > 0) {
          bucket = sumUserCounts(userStats?.skillCounts, combinedSkills);
        } else if (combinedDomains.length > 0) {
          bucket = sumUserCounts(userStats?.domainCounts, combinedDomains);
        } else {
          bucket = sumUserCounts(userStats?.difficultyCounts, difficulties);
        }
        if (
          difficulties.length > 0 &&
          (combinedDomains.length > 0 || combinedSkills.length > 0)
        ) {
          const ratio = getDifficultyRatio(
            userStats?.difficultyCounts,
            difficulties,
          );
          bucket = {
            answered: Math.round(bucket.answered * ratio),
            correct: Math.round(bucket.correct * ratio),
            incorrect: Math.round(bucket.incorrect * ratio),
          };
        }
      }

      console.log(
        "joint bucket answered:",
        bucket?.answered,
        "vs distinct client count: 29 (from rw page log)",
      );
      log("Filtered user stats:", bucket);
      return NextResponse.json(bucket);
    }

    // ---- Global stats ----
    const statsDocName = test === "Math" ? "summary-math" : "summary";
    const statsDoc = await getDoc(doc(db, "questionStats", statsDocName));

    if (!statsDoc.exists()) {
      log("Question stats not found in Firebase");
      return NextResponse.json(
        { error: "Question stats not found" },
        { status: 404 },
      );
    }

    const stats = statsDoc.data();

    if (!hasFilters) {
      // Always include a `count` field so the response shape is consistent
      // whether or not filters are active. Adjust the field name below if
      // your `questionStats/summary` document uses something other than
      // totalCount/total/count for its grand total.
      const total = toNumber(stats.totalCount ?? stats.total ?? stats.count);
      return NextResponse.json({ count: total, ...stats });
    }

    let count: number | null = null;

    // Exact path: skill/domain AND difficulty both selected — use joint counts.
    if (difficulties.length > 0 && combinedSkills.length > 0) {
      count =
        sumJointUserCounts(
          stats?.skillDifficultyCounts,
          combinedSkills.map(sanitizeFieldName),
          difficulties.map(sanitizeFieldName),
        )?.answered ?? null;
    } else if (difficulties.length > 0 && combinedDomains.length > 0) {
      count =
        sumJointUserCounts(
          stats?.domainDifficultyCounts,
          combinedDomains.map(sanitizeFieldName),
          difficulties.map(sanitizeFieldName),
        )?.answered ?? null;
    }

    if (count === null) {
      // No joint counts available or pre-migration data — fall back to 1D + ratio estimate.
      // Skill is more specific than domain, so prioritize skill when both are present
      if (combinedSkills.length > 0) {
        count = sumGlobalCounts(stats?.skillCounts, combinedSkills);
      } else if (combinedDomains.length > 0) {
        count = sumGlobalCounts(stats?.domainCounts, combinedDomains);
      } else {
        count = sumGlobalCounts(stats?.difficultyCounts, difficulties);
      }

      if (
        difficulties.length > 0 &&
        (combinedDomains.length > 0 || combinedSkills.length > 0)
      ) {
        const ratio = getDifficultyRatio(stats?.difficultyCounts, difficulties);
        if (ratio > 0) {
          count = Math.round(count * ratio);
        }
        // If ratio is 0, leave count unadjusted rather than zeroing out a real result
      }
    }

    log("Filtered global count:", count);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching question stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch question stats" },
      { status: 500 },
    );
  }
}
