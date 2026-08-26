import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only in the browser to avoid build-time errors on the server.
let app: FirebaseApp | null = null;
function initFirebase(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (getApps().length === 0) {
    try {
      return initializeApp(firebaseConfig);
    } catch (err) {
      // If initialization fails (invalid/missing env), skip to avoid breaking the SSR build.
      // The client runtime should still initialize correctly when the correct env vars are present.
      // eslint-disable-next-line no-console
      console.warn("Firebase init skipped:", err);
      return null;
    }
  }
  return getApps()[0];
}

app = initFirebase();

export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
