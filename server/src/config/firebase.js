import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

let isFirebaseConfigured = false;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : null;

if (projectId && clientEmail && privateKey) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
    isFirebaseConfigured = true;
    console.log('✅ Firebase Admin SDK initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Firebase Admin SDK initialization error:', err.message);
  }
} else {
  console.log('ℹ️ Firebase service account not specified in .env - local admin token authentication active.');
}

export { admin, isFirebaseConfigured };
