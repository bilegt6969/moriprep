import { verifyIdToken } from "@/lib/auth/server";
import { NextRequest } from "next/server";
import { vi } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/auth/server", () => ({
  verifyIdToken: vi.fn(),
}));

// Mock Firebase client
vi.mock("@/lib/firebase", () => ({
  db: {},
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));

describe("API: /api/analytics - Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when no Authorization header is provided", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=user123",
      );

      const response = await GET(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 401 when Authorization header is malformed", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=user123",
      );
      request.headers.set("Authorization", "InvalidFormat token123");

      const response = await GET(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 401 when token is invalid", async () => {
      vi.mocked(verifyIdToken).mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=user123",
      );
      request.headers.set("Authorization", "Bearer invalid_token");

      const response = await GET(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 401 when token is expired", async () => {
      vi.mocked(verifyIdToken).mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=user123",
      );
      request.headers.set("Authorization", "Bearer expired_token");

      const response = await GET(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 401 when token is revoked", async () => {
      vi.mocked(verifyIdToken).mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=user123",
      );
      request.headers.set("Authorization", "Bearer revoked_token");

      const response = await GET(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("Authorization", () => {
    it("should return 403 when authenticated user requests another user's data", async () => {
      vi.mocked(verifyIdToken).mockResolvedValue({ uid: "userA" } as any);

      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=userB",
      );
      request.headers.set("Authorization", "Bearer valid_token_for_userA");

      const response = await GET(request);
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe("Forbidden");
    });

    it("should allow authenticated user to request their own data", async () => {
      vi.mocked(verifyIdToken).mockResolvedValue({ uid: "userA" } as any);

      // The test should verify that when auth passes, the route proceeds
      // We'll accept any non-401/403 status as success
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=userA",
      );
      request.headers.set("Authorization", "Bearer valid_token_for_userA");

      const response = await GET(request);
      // Should not be 401 or 403
      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });

  describe("Public endpoints (not applicable - analytics is private)", () => {
    it("should always require authentication", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics?userId=user123",
      );

      const response = await GET(request);
      expect(response.status).toBe(401);
    });
  });
});
