import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  YOUR_API_KEY
  YOUR_APP_DETAILS_FROM_FIREBASE_CONSOLE.
};
// eslint-disable-next-line 
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const provider = new GoogleAuthProvider();
export const db = getFirestore()
