import { getApp, getApps, initializeApp } from "firebase/app";
import type {
    Auth,
    GoogleAuthProvider as GoogleAuthProviderType,
} from "firebase/auth";
import {
    browserLocalPersistence,
    getAuth,
    GoogleAuthProvider,
    setPersistence,
} from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore,
    onSnapshot,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "bytecode-c55af.firebaseapp.com", // Use direct Firebase domain to avoid redirect loops
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once if credentials are available
let app = null;
let auth: Auth | null = null;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = typeof window !== "undefined" ? getAuth(app) : null;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

// Set auth persistence to LOCAL for longer sessions (up to 1 year)
if (auth) {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting auth persistence:", error);
  });
}

let googleProvider: GoogleAuthProviderType | null = null;
if (app) {
  googleProvider = new GoogleAuthProvider();

  // Add scopes for the permissions you want to request
  googleProvider.addScope("email");
  googleProvider.addScope("profile");

  // Set custom parameters for better UX
  googleProvider.setCustomParameters({
    prompt: "consent", // Always show consent screen
    display: "popup", // Use popup for better mobile experience
  });
}

const db: Firestore | null = app ? getFirestore(app, "(default)") : null;

export {
    addDoc,
    auth as auth,
    collection,
    db as db,
    doc,
    getDoc,
    googleProvider as googleProvider,
    onSnapshot,
    serverTimestamp,
    setDoc
};

