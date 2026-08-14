import { getApp, getApps, initializeApp } from "firebase/app";
import {
    browserLocalPersistence,
    getAuth,
    GoogleAuthProvider,
    setPersistence,
} from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore,
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

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = typeof window !== "undefined" ? getAuth(app) : null;

// Set auth persistence to LOCAL for longer sessions (up to 1 year)
if (auth) {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting auth persistence:", error);
  });
}

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

export {
    addDoc,
    auth,
    collection,
    db,
    doc,
    getDoc,
    googleProvider,
    onSnapshot,
    serverTimestamp,
    setDoc
};
