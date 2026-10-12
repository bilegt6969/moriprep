/**
 * Client-side API functions for user profile and settings
 * These replace direct Firestore access with secure API calls
 */

/**
 * Get user profile from the server
 */
export async function getUserProfile(): Promise<any> {
  const token = await getIdToken();
  if (!token) {
    return null;
  }

  const response = await fetch("/api/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch profile");
  }

  return response.json();
}

/**
 * Update user profile on the server
 */
export async function updateUserProfile(
  updates: Record<string, any>,
): Promise<void> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch("/api/user/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update profile");
  }
}

/**
 * Get user answers from the server
 */
export async function getUserAnswers(): Promise<any[]> {
  const token = await getIdToken();
  if (!token) {
    return [];
  }

  const response = await fetch("/api/user/answers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch answers");
  }

  return response.json();
}

/**
 * Helper function to get the current Firebase ID token
 */
async function getIdToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const { auth } = await import("@/lib/firebase");
    if (!auth || !auth.currentUser) return null;

    const token = await auth.currentUser.getIdToken();
    return token;
  } catch (error) {
    console.error("Error getting ID token:", error);
    return null;
  }
}

/**
 * Save a user study session
 */
export async function saveUserSession(
  startTime: Date,
  endTime: Date,
  duration: number,
  questionsAttempted: number,
  domainsStudied: string[],
): Promise<void> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch("/api/user/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      questionsAttempted,
      domainsStudied,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save session");
  }
}

/**
 * Get user sessions
 */
export async function getUserSessions(): Promise<any[]> {
  const token = await getIdToken();
  if (!token) {
    return [];
  }

  const response = await fetch("/api/user/sessions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch sessions");
  }

  return response.json();
}

/**
 * Bookmark a question
 */
export async function bookmarkQuestion(
  questionId: string,
  note?: string,
  tags?: string[],
): Promise<void> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch("/api/user/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      questionId,
      note,
      tags,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to bookmark question");
  }
}

/**
 * Remove a bookmark
 */
export async function removeBookmark(questionId: string): Promise<void> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/user/bookmarks?questionId=${questionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove bookmark");
  }
}

/**
 * Get user bookmarks
 */
export async function getBookmarks(): Promise<any> {
  const token = await getIdToken();
  if (!token) {
    return { bookmarks: [] };
  }

  const response = await fetch("/api/user/bookmarks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch bookmarks");
  }

  return response.json();
}

/**
 * Update user streak
 */
export async function updateStreak(): Promise<{
  currentStreak: number;
  longestStreak: number;
}> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch("/api/user/streak", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update streak");
  }

  return response.json();
}

/**
 * Get user streak
 */
export async function getStreak(): Promise<{
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}> {
  const token = await getIdToken();
  if (!token) {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
  }

  const response = await fetch("/api/user/streak", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch streak");
  }

  return response.json();
}

/**
 * Get domain analytics
 */
export async function getDomainAnalytics(): Promise<any[]> {
  const token = await getIdToken();
  if (!token) {
    return [];
  }

  const response = await fetch("/api/user/domain-analytics", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch domain analytics");
  }

  return response.json();
}

/**
 * Save a test score
 */
export async function saveTestScore(
  testType: string,
  score: number,
  date: Date,
  sectionScores?: any,
  notes?: string,
): Promise<void> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch("/api/user/test-scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      testType,
      score,
      date: date.toISOString(),
      sectionScores,
      notes,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save test score");
  }
}

/**
 * Delete a test score
 */
export async function deleteTestScore(scoreId: string): Promise<void> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/user/test-scores?scoreId=${scoreId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete test score");
  }
}
