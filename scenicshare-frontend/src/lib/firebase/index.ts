// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "scenicshare-c3d7c.firebaseapp.com",
  projectId: "scenicshare-c3d7c",
  storageBucket: "scenicshare-c3d7c.firebasestorage.app",
  messagingSenderId: "237481754710",
  appId: "1:237481754710:web:07fabb47ec376cd72f7bf7",
  measurementId: "G-G4HY18M9FN",
};

// Initialize Firebaseeee
// This is a check for seeing if the app has already been initialized
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
//Google Auth Provider
const googleAuthProvider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);

export { firebaseApp, googleAuthProvider, auth };
