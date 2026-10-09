import { db, doc, getDoc } from "@/lib/firebase";
import type { User } from "firebase/auth";

export async function hasCompletedOnboarding(user: User): Promise<boolean> {
  if (!db) return false;
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    return snap.exists() && snap.data()?.onboardingCompleted === true;
  } catch (err) {
    console.error("Failed to read onboarding status:", err);
    return false;
  }
}
