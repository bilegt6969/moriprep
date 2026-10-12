import { handleAuthError, verifyAuthToken } from "@/lib/auth-verification";
import { db } from "@/lib/firebase";
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

function sanitizeFieldName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    // Verify Firebase Admin is configured
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    // Authenticate the request
    const authenticatedUserId = await verifyAuthToken(request);

    // Parse request body
    const body = await request.json();
    const { question, isCorrect, isFirstAttempt, testType } = body;

    // Validate required fields
    if (!question || isCorrect === undefined || isFirstAttempt === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const sanitizedDomain = question.domain
      ? sanitizeFieldName(question.domain)
      : null;
    const sanitizedSkill = question.skill
      ? sanitizeFieldName(question.skill)
      : null;
    const sanitizedDifficulty = question.difficulty
      ? sanitizeFieldName(question.difficulty)
      : null;

    // Determine document name based on test type
    const userStatsDocName =
      testType === "Math" ? `${authenticatedUserId}-math` : authenticatedUserId;
    const userStatsRef = doc(db, "userQuestionStats", userStatsDocName);
    const docSnap = await getDoc(userStatsRef);

    if (docSnap.exists()) {
      // Incrementally update existing stats
      const updateData: any = {
        updatedAt: new Date().toISOString(),
      };

      if (isFirstAttempt) {
        updateData.totalAnswered = increment(1);
      }
      if (isCorrect) {
        updateData.totalCorrect = increment(1);
      } else {
        updateData.totalIncorrect = increment(1);
      }

      // Update domain stats
      if (sanitizedDomain) {
        if (isFirstAttempt) {
          updateData[`domainCounts.${sanitizedDomain}.answered`] = increment(1);
        }
        if (isCorrect) {
          updateData[`domainCounts.${sanitizedDomain}.correct`] = increment(1);
        } else {
          updateData[`domainCounts.${sanitizedDomain}.incorrect`] =
            increment(1);
        }
      }

      // Update skill stats
      if (sanitizedSkill) {
        if (isFirstAttempt) {
          updateData[`skillCounts.${sanitizedSkill}.answered`] = increment(1);
        }
        if (isCorrect) {
          updateData[`skillCounts.${sanitizedSkill}.correct`] = increment(1);
        } else {
          updateData[`skillCounts.${sanitizedSkill}.incorrect`] = increment(1);
        }
      }

      // Update difficulty stats
      if (sanitizedDifficulty) {
        if (isFirstAttempt) {
          updateData[`difficultyCounts.${sanitizedDifficulty}.answered`] =
            increment(1);
        }
        if (isCorrect) {
          updateData[`difficultyCounts.${sanitizedDifficulty}.correct`] =
            increment(1);
        } else {
          updateData[`difficultyCounts.${sanitizedDifficulty}.incorrect`] =
            increment(1);
        }
      }

      // Joint counts for accurate filtering
      if (sanitizedSkill && sanitizedDifficulty) {
        const key = `${sanitizedSkill}__${sanitizedDifficulty}`;
        if (isFirstAttempt) {
          updateData[`skillDifficultyCounts.${key}.answered`] = increment(1);
        }
        if (isCorrect) {
          updateData[`skillDifficultyCounts.${key}.correct`] = increment(1);
        } else {
          updateData[`skillDifficultyCounts.${key}.incorrect`] = increment(1);
        }
      }
      if (sanitizedDomain && sanitizedDifficulty) {
        const key = `${sanitizedDomain}__${sanitizedDifficulty}`;
        if (isFirstAttempt) {
          updateData[`domainDifficultyCounts.${key}.answered`] = increment(1);
        }
        if (isCorrect) {
          updateData[`domainDifficultyCounts.${key}.correct`] = increment(1);
        } else {
          updateData[`domainDifficultyCounts.${key}.incorrect`] = increment(1);
        }
      }

      await updateDoc(userStatsRef, updateData);
    } else {
      // Create new user stats document
      const newStats: any = {
        totalAnswered: 1,
        totalCorrect: isCorrect ? 1 : 0,
        totalIncorrect: isCorrect ? 0 : 1,
        domainCounts: {},
        skillCounts: {},
        difficultyCounts: {},
        skillDifficultyCounts: {},
        domainDifficultyCounts: {},
        updatedAt: new Date().toISOString(),
      };

      if (sanitizedDomain) {
        newStats.domainCounts[sanitizedDomain] = {
          answered: 1,
          correct: isCorrect ? 1 : 0,
          incorrect: isCorrect ? 0 : 1,
        };
      }

      if (sanitizedSkill) {
        newStats.skillCounts[sanitizedSkill] = {
          answered: 1,
          correct: isCorrect ? 1 : 0,
          incorrect: isCorrect ? 0 : 1,
        };
      }

      if (sanitizedDifficulty) {
        newStats.difficultyCounts[sanitizedDifficulty] = {
          answered: 1,
          correct: isCorrect ? 1 : 0,
          incorrect: isCorrect ? 0 : 1,
        };
      }

      // Joint counts for new doc
      if (sanitizedSkill && sanitizedDifficulty) {
        newStats.skillDifficultyCounts[
          `${sanitizedSkill}__${sanitizedDifficulty}`
        ] = {
          answered: 1,
          correct: isCorrect ? 1 : 0,
          incorrect: isCorrect ? 0 : 1,
        };
      }
      if (sanitizedDomain && sanitizedDifficulty) {
        newStats.domainDifficultyCounts[
          `${sanitizedDomain}__${sanitizedDifficulty}`
        ] = {
          answered: 1,
          correct: isCorrect ? 1 : 0,
          incorrect: isCorrect ? 0 : 1,
        };
      }

      await setDoc(userStatsRef, newStats);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleAuthError(error);
    }
    console.error("Error updating user question stats:", error);
    return NextResponse.json(
      { error: "Failed to update question stats" },
      { status: 500 },
    );
  }
}
