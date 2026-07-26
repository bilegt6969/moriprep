// lib/mongodb.ts
// TODO: Install mongodb package: npm install mongodb
// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI!;
// if (!uri) throw new Error("Please define the MONGODB_URI environment variable");

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// if (process.env.NODE_ENV === "development") {
//   let globalWithMongo = global as typeof globalThis & {
//     _mongoClientPromise?: Promise<MongoClient>;
//   };
//   if (!globalWithMongo._mongoClientPromise) {
//     const client = new MongoClient(uri);
//     globalWithMongo._mongoClientPromise = client.connect();
//   }
//   clientPromise = globalWithMongo._mongoClientPromise;
// } else {
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// export default clientPromise;

export default Promise.resolve(null);
