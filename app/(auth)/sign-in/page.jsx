"use client";

import { auth, googleProvider } from "@/lib/firebase";
import { OnboardingFlow } from "components/auth/onboarding-flow";
import LiteNavbar from "components/LiteNavbar";
import {
    getRedirectResult,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
} from "firebase/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * @type {import("firebase/auth").Auth | null}
 */
const typedAuth = auth;

function SignInContent({
  email,
  setEmail,
  password,
  setPassword,
  error,
  setError,
  loading,
  setLoading,
  resetEmail,
  setResetEmail,
  resetSent,
  setResetSent,
  resetError,
  setResetError,
  showReset,
  setShowReset,
  showOnboarding,
  setShowOnboarding,
}) {
  const router = useRouter();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!typedAuth) {
        throw new Error("Firebase authentication is not available");
      }
      await signInWithEmailAndPassword(typedAuth, email, password);
      setShowOnboarding(true);
    } catch (err) {
      console.error("Email sign-in error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to sign in. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      if (!typedAuth || !googleProvider) {
        throw new Error("Firebase authentication is not available");
      }
      await signInWithPopup(typedAuth, googleProvider);
      setShowOnboarding(true);
    } catch (err) {
      console.error("Google sign-in error:", err);
      // If popup is blocked, try redirect instead
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/popup-blocked"
      ) {
        try {
          await signInWithRedirect(typedAuth, googleProvider);
        } catch (redirectErr) {
          console.error("Google redirect sign-in error:", redirectErr);
          setError(
            redirectErr instanceof Error
              ? redirectErr.message
              : "Failed to sign in with Google.",
          );
        }
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to sign in with Google.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetError("");
    try {
      if (!typedAuth) {
        throw new Error("Firebase authentication is not available");
      }
      await sendPasswordResetEmail(typedAuth, resetEmail);
      setResetSent(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setResetError(
        err instanceof Error ? err.message : "Failed to send reset email.",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center px-4 py-16"
    >
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Welcome back. Please enter your details.
      </p>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100"
        >
          {error}
        </motion.p>
      )}

      <form onSubmit={handleEmailSignIn} className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-neutral-900"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-neutral-900"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => {
              setShowReset(true);
              setResetEmail(email);
            }}
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors self-end"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? (
            <svg
              className="h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="relative mt-8 flex items-center justify-center">
        <span className="absolute bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          OR
        </span>
        <div className="w-full border-t border-neutral-200"></div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition-all hover:bg-neutral-50 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </button>

      <p className="mt-8 text-center text-sm text-neutral-500">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-neutral-900 transition-colors hover:underline"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();

  // Handle redirect result from Google OAuth
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        if (!typedAuth) return;
        const result = await getRedirectResult(typedAuth);
        if (result) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error("Redirect result error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to complete sign in.",
        );
      }
    };
    handleRedirectResult();
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetError("");
    try {
      if (!typedAuth) {
        throw new Error("Firebase authentication is not available");
      }
      await sendPasswordResetEmail(typedAuth, resetEmail);
      setResetSent(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setResetError(
        err instanceof Error ? err.message : "Failed to send reset email.",
      );
    }
  };

  const handleOnboardingComplete = () => {
    router.push("/home");
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <LiteNavbar />
      <SignInContent
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        setError={setError}
        loading={loading}
        setLoading={setLoading}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        resetSent={resetSent}
        setResetSent={setResetSent}
        resetError={resetError}
        setResetError={setResetError}
        showReset={showReset}
        setShowReset={setShowReset}
        showOnboarding={showOnboarding}
        setShowOnboarding={setShowOnboarding}
      />

      {/* Password Reset Modal */}
      {showReset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowReset(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Reset your password
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            {resetSent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4"
              >
                <p className="text-sm text-green-700">
                  Password reset email sent! Check your inbox.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handlePasswordReset}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="reset-email"
                    className="text-sm font-medium text-neutral-900"
                  >
                    Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    placeholder="you@example.com"
                  />
                </div>

                {resetError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-600"
                  >
                    {resetError}
                  </motion.p>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReset(false);
                      setResetSent(false);
                      setResetError("");
                    }}
                    className="flex-1 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
