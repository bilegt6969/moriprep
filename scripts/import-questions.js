"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = !(0, app_1.getApps)().length ? (0, app_1.initializeApp)(firebaseConfig) : (0, app_1.getApp)();
const db = (0, firestore_1.getFirestore)(app);
async function importQuestions() {
    const questionsPath = path.join(process.cwd(), "questions.json");
    if (!fs.existsSync(questionsPath)) {
        console.error("questions.json not found. Please create it with your question data.");
        process.exit(1);
    }
    const questionsData = fs.readFileSync(questionsPath, "utf-8");
    const questions = JSON.parse(questionsData);
    console.log(`Found ${questions.length} questions to import`);
    const batchSize = 500;
    let imported = 0;
    let errors = 0;
    for (let i = 0; i < questions.length; i += batchSize) {
        const batch = (0, firestore_1.writeBatch)(db);
        const batchQuestions = questions.slice(i, i + batchSize);
        batchQuestions.forEach((question) => {
            const docRef = (0, firestore_1.doc)((0, firestore_1.collection)(db, "questions"), question.question_id);
            batch.set(docRef, {
                ...question,
                createdAt: new Date().toISOString(),
            });
        });
        try {
            await batch.commit();
            imported += batchQuestions.length;
            console.log(`Imported ${imported}/${questions.length} questions`);
        }
        catch (error) {
            console.error(`Error importing batch ${i}-${i + batchSize}:`, error);
            errors += batchQuestions.length;
        }
    }
    console.log(`\nImport complete: ${imported} questions imported, ${errors} errors`);
}
importQuestions().catch(console.error);
