import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  //apiKey: import.meta.env.VITE_FBASE_API_KEY,
  apiKey: "secret",
  authDomain: "e-codes-system.firebaseapp.com",
  projectId: "e-codes-system",
  storageBucket: "e-codes-system.firebasestorage.app",
  messagingSenderId: "656459966284",
  appId: "1:656459966284:web:85f4e1188f4e5b6f4a11e9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;