// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
