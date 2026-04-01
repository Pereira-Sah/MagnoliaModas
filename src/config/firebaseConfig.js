import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAy_81hf5KziESaqSbErZrNuWG9CclukgI",
  authDomain: "magnoliamodas-a4c0c.firebaseapp.com",
  projectId: "magnoliamodas-a4c0c",
  storageBucket: "magnoliamodas-a4c0c.firebasestorage.app",
  messagingSenderId: "433888088238",
  appId: "1:433888088238:web:a3f0e29e7e2b9315ecdd3f",
  measurementId: "G-FENLYKYMCH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
