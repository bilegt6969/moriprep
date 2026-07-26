"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "lib/firebase";
import { useEffect } from "react";

export function AuthSessionSync() {
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Auth state changes are handled by Firebase directly
      // No server-side session sync needed for Byte education platform
    });

    return () => unsubscribe();
  }, []);

  return null;
}
