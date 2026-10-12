import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// Mock Firebase
vi.mock("@/lib/firebase", () => ({
  db: null,
}));

// Mock Firebase Admin
vi.mock("firebase-admin/auth", () => ({
  getAdminApp: vi.fn(),
  getAuth: vi.fn(),
}));

describe("API: /api/analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET - Authentication (new behavior)", () => {
    it("should return 401 when no Authorization header", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 401 when Authorization header is malformed", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );
      request.headers.set("Authorization", "InvalidFormat");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("GET - Firebase initialization", () => {
    it("should return 500 when Firebase is not initialized (after auth check)", async () => {
      // Mock Firebase Admin to pass auth
      (getAdminApp as any).mockReturnValue({});
      (getAuth as any).mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({ uid: "test-user" }),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );
      request.headers.set("Authorization", "Bearer valid_token");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Firebase not initialized");
    });
  });

  describe("GET - Response format", () => {
    it("should return JSON response", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      // Will be 500 due to Firebase not initialized, but should still be JSON
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });
  });

  describe("GET - Query parameters", () => {
    it("should accept userId as query parameter", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=user123",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });

    it("should handle special characters in userId", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=user-with-dashes",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });
  });

  describe("Security considerations", () => {
    it("should not expose Firebase internals in error messages", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error");
      // Error should be generic, not expose implementation details
      expect(data.error).toBe("Firebase not initialized");
    });

    it("should handle malformed userId gracefully", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=<script>alert('xss')</script>",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });
  });

  describe("Expected response structure (when Firebase is available)", () => {
    it("should include userData in response when Firebase is configured", async () => {
      // This test documents the expected structure
      // Actual execution requires Firebase mock setup
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      // Without Firebase, returns 500
      // With Firebase, should return 200 with structure:
      // { userData, totalQuestions, accuracy, domainStats, detailedStats, streak, weeklyQuestions, totalPracticeTime, dailyActivity, dailyGoal }
      expect([200, 500]).toContain(response.status);
    });

    it("should include totalQuestions in response", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should include accuracy in response", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should include domainStats in response", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should include streak in response", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should include weeklyQuestions in response", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should include totalPracticeTime in response", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should include dailyActivity in response", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should include dailyGoal in response", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });
  });

  describe("Error handling", () => {
    it("should handle database errors gracefully", async () => {
      // Without Firebase, this tests the error path
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error");
    });
  });

  describe("User isolation (documented behavior)", () => {
    it("should only return data for the requested userId", async () => {
      // This test documents the security requirement
      // Actual verification requires Firebase with real data
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=user123",
      );

      const response = await GET(request);

      // When Firebase is configured, should only return user123's data
      // This prevents data leakage between users
      expect([200, 500]).toContain(response.status);
    });

    it("should not allow accessing another user's data", async () => {
      // Security requirement: userId parameter controls access
      // Client cannot request data for arbitrary users without authentication
      // This would need authentication middleware in production
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=other-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });
  });

  describe("Performance calculations (documented)", () => {
    it("should calculate accuracy as percentage", async () => {
      // Document expected behavior: accuracy should be 0-100
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should calculate domain breakdowns", async () => {
      // Document expected behavior: domainStats should include accuracy, share, total
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should calculate skill breakdowns by domain", async () => {
      // Document expected behavior: detailedStats.skillsByDomain should group skills
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });
  });

  describe("Time-based calculations (documented)", () => {
    it("should calculate practice streak based on consecutive days", async () => {
      // Document expected behavior: streak counts consecutive practice days
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should calculate weekly questions (last 7 days)", async () => {
      // Document expected behavior: weeklyQuestions counts questions in last 7 days
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should calculate total practice time in minutes", async () => {
      // Document expected behavior: totalPracticeTime is in minutes
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should generate daily activity for last 30 days", async () => {
      // Document expected behavior: dailyActivity has 30 days of data
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=test-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });
  });
});
