import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Firebase Config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

async function testClientFetch() {
  console.log("Testing client Firebase fetch...");

  try {
    const q = query(collection(db, "questions"));
    const querySnapshot = await getDocs(q);

    console.log(`Fetched ${querySnapshot.docs.length} documents`);

    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0];
      if (!doc) {
        console.log("No document found");
        return;
      }
      const data = doc.data();

      console.log("Document ID:", doc.id);
      console.log("Field names:", Object.keys(data));
      console.log("Has passage:", "passage" in data);
      console.log("Has prompt:", "prompt" in data);
      console.log("Passage length:", data.passage?.length || 0);
      console.log("Prompt length:", data.prompt?.length || 0);
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    console.error("Error code:", error.code);
  }
}

testClientFetch().then(() => process.exit(0));
