const admin = require('firebase-admin');
const fs = require('fs');

// Path to your service account key file
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const data = {};

  snapshot.forEach(doc => {
    data[doc.id] = doc.data();
  });

  fs.writeFileSync(`${collectionName}.json`, JSON.stringify(data, null, 2));
  console.log(`Successfully exported ${snapshot.size} documents to ${collectionName}.json`);
}

// Specify the collection you want to export
exportCollection('users');
