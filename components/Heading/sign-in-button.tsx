"use client";

import { auth } from "@/lib/firebase"; // Adjust this import path to match your project setup
import type { Auth } from "firebase/auth";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { cn } from "lib/cn";
import { ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SignInButton({
  className,
  onClickAction,
}: {
  className?: string;
  onClickAction?: () => void;
}) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // If auth is not available, set loading to false to show the default button
      setLoading(false);
      return;
    }
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth as Auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. Loading State: Prevents the button from flashing "Sign In"
  // while Firebase checks if the user is logged in.
  if (loading) {
    return (
      <div
        className={cn(
          "h-9 w-9 animate-pulse rounded-full bg-neutral-200",
          className,
        )}
      />
    );
  }

  // 2. Authenticated State: Show profile picture or fallback avatar icon
  if (user) {
    return (
      <Link
        href="/account" // Redirects to an account/profile page
        onClick={onClickAction}
        className={cn(
          "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white overflow-hidden transition-opacity hover:opacity-90 active:scale-[0.98]",
          className,
        )}
      >
        {user.photoURL ? (
          <div className="relative h-full w-full">
            <img
              src={user.photoURL}
              alt={user.displayName || "User profile"}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 60%" }}
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <User className="h-4 w-4 text-black" strokeWidth={2} />
        )}
      </Link>
    );
  }

  // 3. Unauthenticated State: Show original "Sign in" button
  return (
    <Link
      href="/sign-in"
      onClick={onClickAction}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-neutral-900 px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 active:scale-[0.98]",
        className,
      )}
    >
      Sign in
      <ArrowRight className="h-4 w-4" strokeWidth={2} />
    </Link>
  );
}
