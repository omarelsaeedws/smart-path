import { initializeApp } from "firebase/app";

import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

import { getAuth, connectAuthEmulator } from "firebase/auth";

import { getStorage, connectStorageEmulator } from "firebase/storage"; 

import { getFunctions, connectFunctionsEmulator } from "firebase/functions"; 

const firebaseConfig = {
  apiKey: "AIzaSyBt9cmhX2zGQifkWW7REnp-kFjtSARcd-Q",
  authDomain: "smart-path-b8649.firebaseapp.com",
  projectId: "smart-path-b8649",
  storageBucket: "smart-path-b8649.firebasestorage.app",
  messagingSenderId: "256572128968",
  appId: "1:256572128968:web:b3d13c5ad212441443affd",
  measurementId: "G-64B041PP4M"
};

const app = initializeApp(firebaseConfig);

// Initialize individual Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app, "us-central1");

// Connect to local Emulators
if (
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);

  console.log("🚀 Connected to Firebase Emulators");
}

export { db, auth, storage, functions };
