import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaeNO4DFaPKjE_qmSoHZWNTokCxELxWfs",
  authDomain: "tinderzoo-3dfd2.firebaseapp.com",
  projectId: "tinderzoo-3dfd2",
  storageBucket: "tinderzoo-3dfd2.firebasestorage.app",
  messagingSenderId: "112249650900",
  appId: "1:112249650900:web:88528af57accecf706c541",
  measurementId: "G-QBS14QT04Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
