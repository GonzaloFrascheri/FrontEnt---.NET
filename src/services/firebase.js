// Inicializa Firebase con Firebase Console: https://console.firebase.google.com/u/0/?_gl=1*1k2zajf*_ga*MTY2NjY2OTc0My4xNzQ2NjY0OTIx*_ga_CW55HF8NVT*czE3NDY2NjQ5MjAkbzEkZzAkdDE3NDY2NjQ5MjAkajYwJGwwJGgw&pli=1
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();