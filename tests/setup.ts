import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// Custom matchers
import "@testing-library/jest-dom";

// Mock localStorage for Node environment
beforeEach(() => {
  if (typeof window === "undefined") {
    // @ts-ignore
    global.window = {
      localStorage: {
        store: {} as Record<string, string>,
        get length() {
          return Object.keys(this.store).length;
        },
        getItem: function (key: string) {
          return this.store[key] || null;
        },
        setItem: function (key: string, value: string) {
          this.store[key] = value.toString();
        },
        removeItem: function (key: string) {
          delete this.store[key];
        },
        clear: function () {
          this.store = {};
        },
        key: function (index: number) {
          const keys = Object.keys(this.store);
          return keys[index] || null;
        },
      },
    };
  }

  // Mock process.cwd for API routes
  vi.stubEnv("NODE_ENV", "test");
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  if (typeof window !== "undefined" && "localStorage" in window) {
    // @ts-ignore
    window.localStorage.clear();
  }
  vi.unstubAllEnvs();
});
