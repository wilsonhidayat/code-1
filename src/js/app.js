// Main Application JavaScript
// This file handles all imports and initialization

// Import Firebase configuration
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
} from './config/firebase.js';

// Import Fingerprint Authentication
export { FingerprintAuth } from './modules/fingerprint-auth.js';

// Import Leaderboard functionality
export { 
  loadLeaderboard, 
  computeLeaderboard, 
  renderLeaderboard, 
  formatTime, 
  formatDate 
} from './modules/leaderboard.js';

// Utility functions
export const utils = {
  // Format time in seconds to MM:SS or HH:MM:SS
  formatTime: (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  },
  
  // Format date to readable string
  formatDate: (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  },
  
  // Show loading state
  showLoading: (element, message = 'Loading...') => {
    if (element) {
      element.innerHTML = `<div class="loading">${message}</div>`;
    }
  },
  
  // Show error state
  showError: (element, message) => {
    if (element) {
      element.innerHTML = `<div class="error">❌ ${message}</div>`;
    }
  },
  
  // Show success state
  showSuccess: (element, message) => {
    if (element) {
      element.innerHTML = `<div class="success">✅ ${message}</div>`;
    }
  }
};

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('📦 App.js loaded successfully');
