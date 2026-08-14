"use client";

import { useEffect } from "react";

export function AnalyticsInit() {
  useEffect(() => {
    console.log("Analytics initialized");

    const onError = (event: ErrorEvent) => {
      console.error("Global error:", event.error);
      // You can send this to an external service like Sentry, LogRocket, etc.
      // Example: Sentry.captureException(event.error)
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      // You can send this to an external service
      // Example: Sentry.captureException(event.reason)
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
