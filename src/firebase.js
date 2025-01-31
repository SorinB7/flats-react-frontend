import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

console.log(import.meta.env)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "flatfinder-533bc",
  storageBucket: "flatfinder-533bc.firebasestorage.app",
  messagingSenderId: "787807954945",
  appId: "1:787807954945:web:c75d42a1578e0e7433f800"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
