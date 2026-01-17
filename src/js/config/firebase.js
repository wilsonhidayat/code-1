// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDt46c_I6tO-6V24wqLtDgqEqnR0riGu8w",
  authDomain: "stair-streak-app.firebaseapp.com",
  projectId: "stair-streak-app",
  storageBucket: "stair-streak-app.firebasestorage.app",
  messagingSenderId: "255358461881",
  appId: "1:255358461881:web:3cb4eae470e9d9eea57868",
  measurementId: "G-LFMWWWKPQC"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  deleteDoc,
  doc,
  updateDoc,
  where,
  writeBatch,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export Firebase functions
export { 
  app, 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  deleteDoc, 
  doc, 
  updateDoc, 
  where,
  writeBatch,
  serverTimestamp
};
