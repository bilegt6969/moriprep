require("dotenv").config({ path: ".env.local" });
const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(process.cwd(), "bytecode-c55af-firebase-adminsdk-fbsvc-f4e6aede65.json");
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function verifyQuestions() {
  try {
    const snapshot = await db.collection("questions").limit(5).get();
    console.log(`Questions in database: ${snapshot.size}`);
    
    if (snapshot.size > 0) {
      snapshot.forEach((doc) => {
        console.log(`Document ID: ${doc.id}, Data:`, doc.data());
      });
    } else {
      console.log("No questions found in database");
    }
  } catch (error) {
    console.error("Error verifying questions:", error);
  }
}

verifyQuestions();
