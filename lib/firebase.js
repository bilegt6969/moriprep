import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = typeof window !== "undefined" ? getAuth(app) : null;
const googleProvider = new GoogleAuthProvider();

// Add scopes for the permissions you want to request
googleProvider.addScope("email");
googleProvider.addScope("profile");

// Set custom parameters for better UX
googleProvider.setCustomParameters({
  prompt: "consent", // Always show consent screen
  display: "popup", // Use popup for better mobile experience
});

const db = getFirestore(app, "(default)");

export { auth, db, doc, getDoc, googleProvider, setDoc };
