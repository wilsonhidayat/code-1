// Firebase configuration
// Replace these values with your Firebase project settings
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy, limit, doc, updateDoc, where, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export Firebase functions for ES6 modules
export { app, db, collection, addDoc, getDocs, onSnapshot, query, orderBy, limit, doc, updateDoc, where, deleteDoc };
