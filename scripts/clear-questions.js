require("dotenv").config({ path: ".env.local" });
const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(process.cwd(), "bytecode-c55af-firebase-adminsdk-fbsvc-f4e6aede65.json");
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function clearQuestions() {
  try {
    const snapshot = await db.collection("questions").get();
    console.log(`Found ${snapshot.size} questions to delete`);
    
    const batchSize = 500;
    let deleted = 0;
    
    for (let i = 0; i < snapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const docs = snapshot.docs.slice(i, i + batchSize);
      
      docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      deleted += docs.length;
      console.log(`Deleted ${deleted}/${snapshot.size} questions`);
    }
    
    console.log(`Successfully deleted all ${deleted} questions`);
  } catch (error) {
    console.error("Error clearing questions:", error);
  }
}

clearQuestions();
