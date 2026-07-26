import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// Initialize Firebase Admin with service account
const serviceAccountPath = path.join(
  process.cwd(),
  "bytecode-c55af-firebase-adminsdk-fbsvc-f4e6aede65.json",
);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

async function checkFirebaseData() {
  console.log("Checking Firebase data...");

  try {
    const snapshot = await db.collection("questions").limit(1).get();

    if (snapshot.empty) {
      console.log("No questions found in Firebase");
      return;
    }

    const doc = snapshot.docs[0];
    if (!doc) {
      console.log("No document found");
      return;
    }
    const data = doc.data();

    console.log("Document ID:", doc.id);
    console.log("Field names:", Object.keys(data));
    console.log("Has passage:", "passage" in data);
    console.log("Has prompt:", "prompt" in data);
    console.log("Passage value:", data.passage?.substring(0, 100) || "empty");
    console.log("Prompt value:", data.prompt?.substring(0, 100) || "empty");
    console.log("Passage length:", data.passage?.length || 0);
    console.log("Prompt length:", data.prompt?.length || 0);

    // Show full structure
    console.log("\nFull data structure:");
    console.log(JSON.stringify(data, null, 2).substring(0, 1000));
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

checkFirebaseData().then(() => process.exit(0));
