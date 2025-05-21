// src/firebase/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe_zFSPGSBL04fLzCq4qunc2LOpF6xKw8",
  authDomain: "devghostwriters-7569e.firebaseapp.com",
  projectId: "devghostwriters-7569e",
  storageBucket: "devghostwriters-7569e.firebasestorage.app",
  messagingSenderId: "974036046779",
  appId: "1:974036046779:web:fd0971caf3ebc9862bea9e",
  measurementId: "G-8213SYT6JP",
};

// Initialize Firebase - only in client
let app;
let auth;
let analytics;

// Check if we're in a browser environment
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { auth };
