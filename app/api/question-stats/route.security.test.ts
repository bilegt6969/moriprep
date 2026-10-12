import { getAdminApp, getAuth } from "firebase-admin/auth";
import { NextRequest } from "next/server";
import { vi } from "vitest";
import { GET } from "./route";

// Mock Firebase Admin
vi.mock("firebase-admin/auth", () => ({
  getAdminApp: vi.fn(),
  getAuth: vi.fn(),
}));

// Mock Firebase client
vi.mock("@/lib/firebase", () => ({
  db: {},
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

describe("API: /api/question-stats - Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Global stats (no userId) - Public", () => {
    it("should allow public access to global stats without authentication", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?test=Reading%20and%20Writing",
      );

      const response = await GET(request);
      // Global stats should work without auth
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe("User-specific stats - Authentication Required", () => {
    it("should return 401 when requesting user stats without Authorization header", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123",
      );

      const response = await GET(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 401 when Authorization header is malformed", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123",
      );
      request.headers.set("Authorization", "InvalidFormat token123");

      const response = await GET(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 401 when token is invalid", async () => {
      (getAdminApp as any).mockReturnValue({});
      (getAuth as any).mockReturnValue({
        verifyIdToken: vi.fn().mockRejectedValue({
          code: "auth/invalid-id-token",
        }),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123",
      );
      request.headers.set("Authorization", "Bearer invalid_token");

      const response = await GET(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 401 when token is expired", async () => {
      (getAdminApp as any).mockReturnValue({});
      (getAuth as any).mockReturnValue({
        verifyIdToken: vi.fn().mockRejectedValue({
          code: "auth/id-token-expired",
        }),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=user123",
      );
      request.headers.set("Authorization", "Bearer expired_token");

      const response = await GET(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("User-specific stats - Authorization", () => {
    it("should return 403 when authenticated user requests another user's stats", async () => {
      (getAdminApp as any).mockReturnValue({});
      (getAuth as any).mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: "userA",
        }),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=userB",
      );
      request.headers.set("Authorization", "Bearer valid_token_for_userA");

      const response = await GET(request);
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe("Forbidden");
    });

    it("should allow authenticated user to request their own stats", async () => {
      (getAdminApp as any).mockReturnValue({});
      (getAuth as any).mockReturnValue({
        verifyIdToken: vi.fn().mockResolvedValue({
          uid: "userA",
        }),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/question-stats?userId=userA",
      );
      request.headers.set("Authorization", "Bearer valid_token_for_userA");

      const response = await GET(request);
      // Should not be 401 or 403
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });
});
