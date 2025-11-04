// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmV6e4zxPaeKbetvaCd1po02T3KIkvUYA",
  authDomain: "scenicshare-c3d7c.firebaseapp.com",
  projectId: "scenicshare-c3d7c",
  storageBucket: "scenicshare-c3d7c.firebasestorage.app",
  messagingSenderId: "237481754710",
  appId: "1:237481754710:web:07fabb47ec376cd72f7bf7",
  measurementId: "G-G4HY18M9FN",
};

// Initialize Firebase
// This is a check for seeing if the app has already been initialized
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
//Google Auth Provider
const googleAuthProvider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, googleAuthProvider, auth, db };
