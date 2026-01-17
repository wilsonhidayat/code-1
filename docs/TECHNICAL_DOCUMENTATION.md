# Technical Documentation - Stair Streak App

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [System Design](#system-design)
5. [Authentication System](#authentication-system)
6. [Database Schema](#database-schema)
7. [API Structure](#api-structure)
8. [Code Architecture](#code-architecture)
9. [Security Considerations](#security-considerations)
10. [Development Setup](#development-setup)
11. [Deployment](#deployment)
12. [Testing](#testing)

---

## Overview

The Stair Streak App is a web-based fitness tracking application that allows users to track stair climbing sessions using biometric authentication (fingerprint) with PIN backup. The application uses Firebase Firestore for data persistence and supports multi-device access without storing credentials in browser password managers.

### Key Features
- **Hybrid Authentication**: Fingerprint + PIN backup system
- **Multi-Device Support**: Access account from any device
- **Session Management**: Track start/stop times and durations
- **Real-time Leaderboard**: Display user statistics and rankings
- **Firebase Integration**: Centralized data storage
- **Responsive UI**: Works on desktop, tablet, and mobile devices

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Start   │  │   Stop   │  │Leaderboard│  │   Main   │   │
│  │ Station  │  │ Station  │  │    Page   │  │   Page   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              StartStation Module                      │   │
│  │  - UI Management                                      │   │
│  │  - Registration Modal                                 │   │
│  │  - Login Modal                                        │   │
│  │  - Session Timer                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          FingerprintAuth Module                       │   │
│  │  - Authentication Logic                               │   │
│  │  - User Registration                                  │   │
│  │  - Session Management                                 │   │
│  │  - Firebase Integration                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Leaderboard Module                          │   │
│  │  - Data Aggregation                                   │   │
│  │  - Ranking System                                     │   │
│  │  - Real-time Updates                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │ActiveSessions│  │     Taps     │      │
│  │  Collection  │  │  Collection  │  │  Collection  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Registration Flow**:
   ```
   User Input → Registration Modal → FingerprintAuth.registerUser()
   → Firebase Firestore (users collection) → LocalStorage (fingerprint mapping)
   ```

2. **Authentication Flow**:
   ```
   User Action → FingerprintAuth.authenticateUser()
   → Try Fingerprint → Fallback to PIN → Firebase Verification
   → Return User Object → Start/Stop Session
   ```

3. **Session Management Flow**:
   ```
   Start Station → Authenticate → Create ActiveSession in Firebase
   → Stop Station → Authenticate → Calculate Duration → Save to Taps
   → Remove ActiveSession
   ```

---

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Styling with animations and responsive design
- **JavaScript (ES6+)**: Modern JavaScript with modules
- **Web Authentication API**: Biometric authentication
- **Web Crypto API**: PIN hashing (SHA-256)

### Backend/Database
- **Firebase Firestore**: NoSQL document database
- **Firebase JavaScript SDK v12.2.1**: Client-side Firebase integration

### Build Tools
- **Node.js**: Build scripts (optional)
- **Python 3**: Local development server

### Deployment
- **Netlify**: Static site hosting
- **Firebase Hosting**: Alternative hosting option

---

## System Design

### Authentication System Design

#### Hybrid Authentication Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Layer                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Device-Level (Browser LocalStorage)          │    │
│  │  - Fingerprint Mappings (userId → deviceId)         │    │
│  │  - Last Login Info                                   │    │
│  │  - NOT synced across devices                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                         │                                     │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │        Cloud-Level (Firebase Firestore)              │    │
│  │  - User Accounts (name, hashed PIN)                 │    │
│  │  - Active Sessions                                  │    │
│  │  - Session History (taps collection)                │    │
│  │  - Synced across ALL devices                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### Authentication Flow Diagram

```
START: User wants to authenticate
    │
    ├─→ Has Fingerprint Set Up Locally?
    │   │
    │   YES → Use Fingerprint Authentication
    │   │       │
    │   │       ├─→ Success → Return User Object
    │   │       │
    │   │       └─→ Failure → Show Login Modal
    │   │
    │   NO → Show Login Modal
    │       │
    │       ├─→ Enter Name + PIN
    │       │
    │       ├─→ Verify against Firebase
    │       │
    │       ├─→ Success → Setup Fingerprint for Device
    │       │            → Return User Object
    │       │
    │       └─→ Failure → Show Error Message
    │
END: User Authenticated
```

### Session Management Design

#### State Machine

```
┌─────────────┐
│   IDLE      │ ← Initial State
└──────┬──────┘
       │
       │ User Authenticates at Start Station
       ▼
┌─────────────┐
│   ACTIVE    │ ← Session Running
│   SESSION   │
└──────┬──────┘
       │
       │ User Authenticates at Stop Station
       ▼
┌─────────────┐
│  COMPLETED  │ ← Session Ended
│   SESSION   │   Duration Calculated
└─────────────┘   Saved to History
```

---

## Authentication System

### Fingerprint Authentication Module

**File**: `src/js/modules/fingerprint-auth.js`

#### Key Components

1. **FingerprintAuth Class**
   - Manages all authentication operations
   - Handles user registration and authentication
   - Manages session lifecycle

2. **Methods**

```javascript
// User Registration
async registerUser(userName, userPin, setupFingerprint = true)
- Creates user account in Firebase
- Hashes PIN using SHA-256
- Optionally sets up fingerprint for local device
- Returns: User object

// User Authentication
async authenticateUser(userName = null, userPin = null, tryFingerprint = true)
- Tries fingerprint authentication first (if tryFingerprint = true)
- Falls back to PIN authentication if needed
- Updates lastSeen timestamp
- Returns: User object

// Session Management
async startActiveSession(userId, userName, startTime)
- Creates active session document in Firebase
- Stores session metadata

async stopActiveSession(userId)
- Removes active session from Firebase
- Calculates duration

// Data Persistence
async saveTapEvent(user, station, duration)
- Saves session data to 'taps' collection
- Includes timestamp, duration, user info
```

### PIN Security

#### Hashing Algorithm
- **Algorithm**: SHA-256
- **Input**: Plaintext PIN (4-6 digits)
- **Output**: 64-character hexadecimal hash
- **Salt**: None (Firebase handles security)

#### Implementation

```javascript
async hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

### Fingerprint Storage

#### Local Storage Structure

```javascript
// Key: 'stairStreak_fingerprints'
// Value: JSON object
{
  "fp_1696772400000_xyz789": {
    "userId": "firebase-user-id-123",
    "userName": "John Doe",
    "setupDate": "2025-10-08T12:00:00.000Z"
  }
}
```

**Note**: This data is NOT synced to password managers or cloud storage. It's device-specific.

---

## Database Schema

### Firebase Firestore Collections

#### 1. `users` Collection

**Document Structure**:
```javascript
{
  id: "auto-generated-document-id",
  name: "John Doe",                    // String, required
  pin: "e3b0c44298fc1c149afbf...",    // String, SHA-256 hash
  authMethod: "hybrid-fingerprint-pin", // String
  createdAt: "2025-10-08T12:00:00.000Z", // ISO timestamp
  lastSeen: "2025-10-08T14:30:00.000Z",  // ISO timestamp
  deviceInfo: {
    registeredFrom: "MacIntel",        // String
    userAgent: "Mozilla/5.0..."        // String
  }
}
```

**Indexes**: None required (querying by name)

**Security Rules** (Recommended):
```javascript
match /users/{userId} {
  allow read: if request.auth != null;
  allow create: if request.resource.data.keys().hasAll(['name', 'pin', 'authMethod']);
  allow update: if request.auth != null && request.auth.uid == userId;
}
```

#### 2. `activeSessions` Collection

**Document Structure**:
```javascript
{
  id: "auto-generated-document-id",
  userId: "firebase-user-id",          // String, required
  userName: "John Doe",                // String, required
  startTime: "2025-10-08T12:00:00.000Z", // ISO timestamp
  station: "start",                    // String: "start"
  createdAt: "2025-10-08T12:00:00.000Z"  // ISO timestamp
}
```

**Indexes**: 
- `userId` (single field, ascending)

**Security Rules**:
```javascript
match /activeSessions/{sessionId} {
  allow read: if true;
  allow create: if request.auth != null;
  allow delete: if request.auth != null;
}
```

#### 3. `taps` Collection

**Document Structure**:
```javascript
{
  id: "auto-generated-document-id",
  userId: "firebase-user-id",          // String, required
  userName: "John Doe",                // String, required
  station: "stop",                     // String: "start" | "stop"
  timestamp: "2025-10-08T14:30:00.000Z", // ISO timestamp
  duration: 9000,                      // Number (seconds)
  authMethod: "hybrid-fingerprint-pin", // String
  createdAt: "2025-10-08T14:30:00.000Z"  // ISO timestamp
}
```

**Indexes**:
- `userId` (single field, ascending)
- `timestamp` (single field, descending) - for leaderboard queries
- `station` (single field, ascending)

**Security Rules**:
```javascript
match /taps/{tapId} {
  allow read: if true;
  allow create: if request.auth != null;
}
```

### Query Patterns

#### Get User by Name
```javascript
const users = await getDocs(collection(db, 'users'));
const user = Array.from(users.values()).find(
  u => u.name.toLowerCase() === userName.toLowerCase()
);
```

#### Get Active Session by User ID
```javascript
const q = query(
  collection(db, 'activeSessions'),
  where('userId', '==', userId)
);
const snapshot = await getDocs(q);
```

#### Get User's Session History (for Leaderboard)
```javascript
const q = query(
  collection(db, 'taps'),
  where('userId', '==', userId),
  where('station', '==', 'stop'),
  orderBy('timestamp', 'desc'),
  limit(100)
);
const snapshot = await getDocs(q);
```

---

## API Structure

### Firebase SDK Usage

#### Initialization
```javascript
// File: src/js/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

#### Common Operations

**Create Document**:
```javascript
import { collection, addDoc } from 'firebase/firestore';
const docRef = await addDoc(collection(db, 'users'), userData);
```

**Read Documents**:
```javascript
import { collection, getDocs } from 'firebase/firestore';
const snapshot = await getDocs(collection(db, 'users'));
```

**Query Documents**:
```javascript
import { query, where, orderBy, limit } from 'firebase/firestore';
const q = query(
  collection(db, 'taps'),
  where('userId', '==', userId),
  orderBy('timestamp', 'desc'),
  limit(10)
);
const snapshot = await getDocs(q);
```

**Update Document**:
```javascript
import { doc, updateDoc } from 'firebase/firestore';
await updateDoc(doc(db, 'users', userId), { lastSeen: timestamp });
```

**Delete Document**:
```javascript
import { doc, deleteDoc } from 'firebase/firestore';
await deleteDoc(doc(db, 'activeSessions', sessionId));
```

---

## Code Architecture

### Module Structure

```
src/js/
├── app.js                          # Main application entry point
├── config/
│   ├── firebase-config.js          # Firebase configuration
│   └── firebase.js                 # Firebase initialization
└── modules/
    ├── fingerprint-auth.js         # Authentication module
    ├── start-station.js            # Start station UI/logic
    ├── leaderboard.js              # Leaderboard module
    └── utils/                      # Utility functions
```

### Key Classes

#### 1. FingerprintAuth Class

**Responsibilities**:
- User registration and authentication
- PIN hashing and verification
- Fingerprint device mapping
- Session management
- Firebase data operations

**Dependencies**:
- `firebase.js` (Firebase SDK)
- Web Crypto API
- Web Authentication API (optional)

#### 2. StartStation Class

**Responsibilities**:
- UI rendering and management
- Registration modal
- Login modal
- Session timer display
- User interaction handling

**Dependencies**:
- `FingerprintAuth` class
- DOM manipulation

#### 3. Leaderboard Class

**Responsibilities**:
- Data aggregation from Firebase
- User ranking calculation
- Real-time updates
- UI rendering

**Dependencies**:
- `firebase.js` (Firebase SDK)

### Code Patterns

#### Module Pattern
All modules use ES6 module pattern with named exports:
```javascript
export class FingerprintAuth { ... }
```

#### Import Pattern
Modules import dependencies at the top:
```javascript
import { db, collection, addDoc } from '../config/firebase.js';
```

#### Error Handling
Try-catch blocks with user-friendly error messages:
```javascript
try {
  const user = await this.authenticateUser(name, pin);
  // Success handling
} catch (error) {
  console.error('Error:', error);
  // User-friendly error display
}
```

---

## Security Considerations

### Authentication Security

#### PIN Security
- **Hashing**: All PINs are hashed using SHA-256 before storage
- **No Plaintext Storage**: PINs never stored in plaintext
- **Verification**: PINs verified by comparing hashes

#### Fingerprint Security
- **Device-Local Only**: Fingerprint mappings stored in localStorage only
- **No Cloud Sync**: Fingerprint data never synced to cloud
- **One-Way Operation**: Fingerprint used only for local device verification

### Data Security

#### Firebase Security Rules
**Recommended Firestore Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.resource.data.keys().hasAll(['name', 'pin', 'authMethod']);
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false; // Prevent deletion
    }
    
    // Active sessions
    match /activeSessions/{sessionId} {
      allow read: if true; // Public read for checking sessions
      allow create: if request.auth != null;
      allow update: if false;
      allow delete: if request.auth != null;
    }
    
    // Taps (session history)
    match /taps/{tapId} {
      allow read: if true; // Public for leaderboard
      allow create: if request.auth != null;
      allow update: if false;
      allow delete: if false; // Immutable history
    }
  }
}
```

#### Client-Side Security
- **Input Validation**: All user inputs validated before processing
- **XSS Prevention**: Content sanitization for user-generated content
- **CORS Configuration**: Appropriate CORS headers for API access

### Privacy Considerations

#### Data Minimization
- Only necessary data collected
- No sensitive biometric data stored
- Device information anonymized

#### Data Retention
- Session history preserved for leaderboard
- User accounts persist until deletion
- Active sessions auto-cleanup on stop

---

## Development Setup

### Prerequisites

1. **Node.js** (v14+)
   ```bash
   node --version
   ```

2. **Python 3** (for local server)
   ```bash
   python3 --version
   ```

3. **Firebase Account** (for database)

### Local Development

#### 1. Clone Repository
```bash
git clone https://github.com/wilsonhidayat/code-1.git
cd code-1
```

#### 2. Install Dependencies
```bash
npm install  # If using npm
# Or use build.py directly
```

#### 3. Configure Firebase

1. Create Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Copy config to `src/js/config/firebase-config.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ... other config
};
```

#### 4. Run Local Server

**Option A: Python HTTP Server**
```bash
python3 -m http.server 8080
```

**Option B: Node.js HTTP Server**
```bash
npx http-server -p 8080
```

**Option C: Live Server (VS Code Extension)**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

#### 5. Access Application
```
http://localhost:8080
```

### Build Process

#### Development Build
```bash
npm run build
# Or
node build.js
```

This copies files from `src/` to `dist/` with proper path adjustments.

#### Production Build
1. Run build script
2. Optimize assets (minify CSS/JS if needed)
3. Test `dist/` folder
4. Deploy to hosting service

---

## Deployment

### Netlify Deployment

#### Method 1: Drag & Drop
1. Run build: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag `dist/` folder to deploy

#### Method 2: Git Integration
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

#### Method 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --dir=dist --prod
```

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not done)
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Environment Variables

If needed, set environment variables in hosting platform:
- `FIREBASE_API_KEY`
- `FIREBASE_PROJECT_ID`
- etc.

---

## Testing

### Manual Testing Checklist

#### Authentication
- [ ] Register new user
- [ ] Login with fingerprint (if supported)
- [ ] Login with PIN
- [ ] Invalid PIN rejection
- [ ] Duplicate username rejection

#### Sessions
- [ ] Start session at start station
- [ ] Stop session at stop station
- [ ] Cannot start without stopping previous session
- [ ] Cannot stop without active session
- [ ] Session duration calculation correct

#### Multi-Device
- [ ] Register on device A
- [ ] Login on device B with PIN
- [ ] Fingerprint setup on device B
- [ ] Sessions sync across devices

#### Leaderboard
- [ ] Display user rankings
- [ ] Sort by duration correctly
- [ ] Show correct statistics
- [ ] Real-time updates

### Automated Testing (Future Enhancement)

#### Unit Tests
```javascript
// Example test structure
describe('FingerprintAuth', () => {
  test('registerUser creates user in Firebase', async () => {
    // Test implementation
  });
  
  test('authenticateUser verifies PIN correctly', async () => {
    // Test implementation
  });
});
```

#### Integration Tests
- Test full authentication flow
- Test session lifecycle
- Test Firebase operations

---

## Performance Optimization

### Code Optimization

1. **Lazy Loading**: Load modules only when needed
2. **Debouncing**: Debounce frequent operations (e.g., search)
3. **Caching**: Cache Firebase queries where appropriate

### Firebase Optimization

1. **Indexes**: Create composite indexes for complex queries
2. **Pagination**: Limit query results for large datasets
3. **Real-time Listeners**: Use `onSnapshot` for live updates

### Asset Optimization

1. **Minification**: Minify CSS and JavaScript for production
2. **Compression**: Enable gzip compression on server
3. **Image Optimization**: Optimize images if added

---

## Troubleshooting

### Common Issues

#### Firebase Connection Errors
**Problem**: Cannot connect to Firebase
**Solution**: 
- Check Firebase config
- Verify API keys
- Check Firestore rules
- Verify network connectivity

#### Fingerprint Not Working
**Problem**: Fingerprint authentication fails
**Solution**:
- Check browser support (Chrome/Safari/Edge)
- Verify Web Authentication API support
- Check device has fingerprint sensor
- Use PIN as fallback

#### Session Not Starting
**Problem**: Cannot start session
**Solution**:
- Check user authentication
- Verify Firebase connection
- Check active session doesn't exist
- Review browser console for errors

---

## Future Enhancements

### Potential Improvements

1. **Real-time Sync**: Use Firestore real-time listeners
2. **Offline Support**: Implement service worker for offline access
3. **Push Notifications**: Remind users about sessions
4. **Analytics**: Track user engagement
5. **Mobile App**: Native mobile app with React Native
6. **Social Features**: Share achievements, challenges
7. **Export Data**: Allow users to export their data

---

## License

MIT License - See LICENSE file for details

---

## Contributors

- Wilson Hidayat
- Development Team

---

**Last Updated**: October 8, 2025  
**Version**: 4.0 (Hybrid Fingerprint + Multi-Device)  
**Documentation Version**: 1.0
