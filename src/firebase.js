// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjWkJKATmAQPhqoRLOjinlCS8cvh9gbM8",
  authDomain: "cashtrail-ce1d4.firebaseapp.com",
  projectId: "cashtrail-ce1d4",
  storageBucket: "cashtrail-ce1d4.firebasestorage.app",
  messagingSenderId: "780200607400",
  appId: "1:780200607400:web:502e27cfa21b3421cc4c9d",
  measurementId: "G-0J2VJEV08Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
