"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FirebaseAuthHandler() {
  const router = useRouter();

  useEffect(() => {
    // Firebase Auth will handle the callback via popup/redirect
    // This page exists to prevent 404 errors
    // The actual auth handling is done by Firebase SDK
    router.push("/sign-in");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 mx-auto" />
        <p className="text-sm text-neutral-500">Completing sign in...</p>
      </div>
    </div>
  );
}
