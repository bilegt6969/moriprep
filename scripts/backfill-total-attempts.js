const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function backfillTotalAttempts() {
  console.log("Starting backfill of totalAttempts field...");

  // Get all userStats documents
  const statsSnapshot = await db.collection("userStats").get();
  console.log(`Found ${statsSnapshot.size} userStats documents`);

  let updated = 0;
  let skipped = 0;
  const batchSize = 400;
  let batch = db.batch();
  let opsInBatch = 0;

  for (const doc of statsSnapshot.docs) {
    const data = doc.data();

    // Skip if already has totalAttempts
    if (data.totalAttempts !== undefined) {
      skipped++;
      continue;
    }

    // For existing docs, set totalAttempts = totalQuestions
    // (assuming they only tracked unique questions before)
    const totalAttempts = data.totalQuestions || 0;

    batch.update(doc.ref, { totalAttempts });
    opsInBatch++;
    updated++;

    if (opsInBatch >= batchSize) {
      await batch.commit();
      batch = db.batch();
      opsInBatch = 0;
    }
  }

  if (opsInBatch > 0) {
    await batch.commit();
  }

  console.log(`Done. Updated: ${updated}, Skipped (already had field): ${skipped}`);
}

backfillTotalAttempts().catch(console.error);
