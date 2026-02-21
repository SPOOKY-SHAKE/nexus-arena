import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// Production configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "avirbhaav-nusrl",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-YOUR_MEASUREMENT_ID"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get references to the Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

// Analytics initialization with SSR check
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Local development emulator connection
if (typeof window !== 'undefined' && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
  console.log("Connecting to Firebase Emulators for local development...");
  connectFirestoreEmulator(db, "localhost", 8081);
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { app, db, auth, analytics };
