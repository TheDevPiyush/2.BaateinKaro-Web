import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCyqLm1RTpmFfKzJ9oq3bwWkTIBTLfkYG0",
  authDomain: "baatein-karoo.firebaseapp.com",
  projectId: "baatein-karoo",
  storageBucket: "baatein-karoo.appspot.com",
  messagingSenderId: "1075800300756",
  appId: "1:1075800300756:web:edc213322b9a772b23ef41",
  measurementId: "G-PNLCYK6NFX"
};
// eslint-disable-next-line 
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const provider = new GoogleAuthProvider();
export const db = getFirestore()
