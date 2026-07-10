// ============================================================
// Firebase Configuration — Study X
// ============================================================
// IMPORTANT: Replace ALL placeholder values below with your
// actual Firebase project credentials. You can find these in
// the Firebase Console → Project Settings → General → Your Apps
// → SDK setup and configuration → Config.
// ============================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // ⚠️ REPLACE with your Firebase API key
  apiKey: 'YOUR_FIREBASE_API_KEY',

  // ⚠️ REPLACE with your Firebase auth domain (e.g. "my-project.firebaseapp.com")
  authDomain: 'YOUR_PROJECT.firebaseapp.com',

  // ⚠️ REPLACE with your Firebase project ID (e.g. "my-project")
  projectId: 'YOUR_PROJECT_ID',

  // ⚠️ REPLACE with your Firebase storage bucket (e.g. "my-project.appspot.com")
  storageBucket: 'YOUR_PROJECT.appspot.com',

  // ⚠️ REPLACE with your Firebase messaging sender ID
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',

  // ⚠️ REPLACE with your Firebase app ID
  appId: 'YOUR_APP_ID',

  // ⚠️ REPLACE with your Firebase measurement ID (optional, for analytics)
  measurementId: 'YOUR_MEASUREMENT_ID',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Cloud Firestore
const db = getFirestore(app);

export { app, auth, db };
