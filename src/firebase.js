// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWLmBmyUpHsOOeg_gyrTtD7qTFvFaFPQU",
  authDomain: "gravitycalculadora.firebaseapp.com",
  projectId: "gravitycalculadora",
  storageBucket: "gravitycalculadora.firebasestorage.app",
  messagingSenderId: "504662366626",
  appId: "1:504662366626:web:cde04334202c95d50c3afb",
  measurementId: "G-33TVKDZYG0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Safely initialize analytics (supported in browser environments)
export const analyticsPromise = isSupported().then(supported => supported ? getAnalytics(app) : null);
