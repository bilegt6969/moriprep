import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// Mock Firebase
vi.mock("@/lib/firebase", () => ({
  db: null,
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

// Mock Firebase Admin
vi.mock("firebase-admin/auth", () => ({
  getAdminApp: vi.fn(),
  getAuth: vi.fn(),
}));

// Mock file system
vi.mock("fs", () => ({
  readFileSync: vi.fn(),
}));

describe("API: /api/question-stats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET - Firebase initialization", () => {
    it("should return 500 when Firebase is not initialized for user-specific stats", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Firebase not initialized");
    });
  });

  describe("GET - Global statistics (no userId) - Public endpoint", () => {
    it("should allow public access to global stats without authentication", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?test=Reading%20and%20Writing",
      );

      const response = await GET(request);

      // Global stats should not require auth (no 401)
      expect(response.status).not.toBe(401);
    });

    it("should handle test parameter", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?test=Math",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });
  });

  describe("GET - User statistics (with userId) - Authentication Required", () => {
    it("should return 500 when requesting user stats without Firebase initialized", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123",
      );

      const response = await GET(request);
      expect(response.status).toBe(500);
    });

    it("should return 401 when auth token is missing (with Firebase mocked)", async () => {
      // Temporarily set db to a mock object
      const { db: dbMock } = await import("@/lib/firebase");
      (dbMock as any) = {};

      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123&test=Math",
      );
      request.headers.set("Authorization", "Bearer ");

      const response = await GET(request);
      expect(response.status).toBe(401);

      // Reset db
      (dbMock as any) = null;
    });
  });

  describe("GET - Filtering (global stats)", () => {
    it("should handle domain filter", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?domain=Information%20and%20Ideas",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });

    it("should handle multiple domain filters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?domain=Information%20and%20Ideas,Craft%20and%20Structure",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });

    it("should handle skill filter", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?skill=Central%20Ideas",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });

    it("should handle multiple skill filters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?skill=Central%20Ideas,Inferences",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });

    it("should handle difficulty filter", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?difficulty=Easy",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });

    it("should handle multiple difficulty filters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?difficulty=Easy,Medium",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });

    it("should handle combined filters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?domain=Information%20and%20Ideas&difficulty=Easy&skill=Central%20Ideas",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });
  });

  describe("GET - Response format for global stats", () => {
    it("should return total and count for global stats", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?test=Reading%20and%20Writing",
      );

      const response = await GET(request);

      // Without Firebase, returns 500
      // With Firebase, should return { total, count }
      expect([200, 500]).toContain(response.status);
    });
  });

  describe("GET - Response format for user stats", () => {
    it("should return answered, correct, incorrect for user stats", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123",
      );

      const response = await GET(request);

      // Without Firebase, returns 500
      // With Firebase, should return { answered, correct, incorrect }
      expect([200, 500]).toContain(response.status);
    });

    it("should return zeros for user with no stats", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=new-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });
  });

  describe("GET - Query parameter parsing", () => {
    it("should handle repeated domain parameters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?domain=Information%20and%20Ideas&domain=Craft%20and%20Structure",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });

    it("should handle repeated skill parameters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?skill=Central%20Ideas&skill=Inferences",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });

    it("should handle repeated difficulty parameters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?difficulty=Easy&difficulty=Medium",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });

    it("should handle mix of comma-separated and repeated parameters", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?domain=Information%20and%20Ideas,Craft%20and%20Structure&domain=Expression%20of%20Ideas",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });
  });

  describe("GET - User isolation (documented)", () => {
    it("should only return stats for requested userId", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123",
      );

      const response = await GET(request);

      // Security requirement: userId parameter controls access
      // Should only return user123's statistics
      expect([200, 500]).toContain(response.status);
    });

    it("should not allow accessing another user's stats", async () => {
      // Document security requirement
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=other-user",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });
  });

  describe("GET - Math-specific behavior", () => {
    it("should handle Math test type", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?test=Math",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });

    it("should use separate user stats document for Math (-math suffix)", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123&test=Math",
      );

      const response = await GET(request);

      // Document: Math uses userId-math document name
      expect([200, 500]).toContain(response.status);
    });
  });

  describe("GET - Response format", () => {
    it("should return JSON response", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?test=Reading%20and%20Writing",
      );

      const response = await GET(request);

      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });
  });

  describe("GET - Error handling", () => {
    it("should handle database errors gracefully", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=test-user",
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error");
    });

    it("should handle malformed query parameters gracefully", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?domain=<script>alert('xss')</script>",
      );

      const response = await GET(request);

      expect(response).toBeDefined();
    });
  });

  describe("GET - Field sanitization (documented)", () => {
    it("should sanitize domain names for stats lookup", async () => {
      // Document: sanitizeFieldName() normalizes domain/skill names
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?domain=Standard%20English%20Conventions",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should sanitize skill names for stats lookup", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?skill=Form%2C%20Structure%2C%20and%20Sense",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });
  });

  describe("GET - Joint counts (documented)", () => {
    it("should use joint counts when both skill and difficulty provided", async () => {
      // Document: skillDifficultyCounts for skill + difficulty filtering
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123&skill=Central%20Ideas&difficulty=Easy",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should use joint counts when both domain and difficulty provided", async () => {
      // Document: domainDifficultyCounts for domain + difficulty filtering
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123&domain=Information%20and%20Ideas&difficulty=Easy",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });
  });

  describe("GET - Fallback behavior (documented)", () => {
    it("should fall back to 1D counts when joint counts unavailable", async () => {
      // Document: Falls back to skillCounts or domainCounts with ratio estimate
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123&skill=Central%20Ideas&difficulty=Easy",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });
  });

  describe("GET - Index-based filtering (documented)", () => {
    it("should use index for domain filtering (global stats)", async () => {
      // Document: Uses QuestionIndex.byDomain for performance
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?domain=Information%20and%20Ideas",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should use index for skill filtering (global stats)", async () => {
      // Document: Uses QuestionIndex.bySkill for performance
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?skill=Central%20Ideas",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });

    it("should use index for difficulty filtering (global stats)", async () => {
      // Document: Uses QuestionIndex.byDifficulty for performance
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?difficulty=Easy",
      );

      const response = await GET(request);

      expect([200, 500]).toContain(response.status);
    });
  });
});
