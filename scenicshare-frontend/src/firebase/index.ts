// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
