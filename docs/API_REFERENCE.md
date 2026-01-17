# API Reference - Stair Streak App

## FingerprintAuth Class

### Constructor
```javascript
const fingerprintAuth = new FingerprintAuth();
```

Creates a new instance of the FingerprintAuth class.

### Properties

#### `isBiometricSupported`
- **Type**: `Boolean`
- **Description**: Indicates if biometric authentication (fingerprint) is supported on the device
- **Read-only**: Yes

#### `users`
- **Type**: `Map<string, Object>`
- **Description**: In-memory cache of users loaded from Firebase
- **Format**: `Map<userId, userObject>`

#### `activeSessions`
- **Type**: `Map<string, Object>`
- **Description**: In-memory cache of active sessions
- **Format**: `Map<userId, sessionObject>`

### Methods

#### `async initialize()`
Initializes the authentication system and loads users from Firebase.

**Returns**: `Promise<Boolean>`

**Example**:
```javascript
await fingerprintAuth.initialize();
```

---

#### `async registerUser(userName, userPin, setupFingerprint = true)`
Registers a new user in the system.

**Parameters**:
- `userName` (String, required): User's display name
- `userPin` (String, required): 4-6 digit PIN
- `setupFingerprint` (Boolean, optional): Whether to set up fingerprint for this device (default: true)

**Returns**: `Promise<Object>` - User object with `id`, `name`, `createdAt`, etc.

**Throws**: 
- `Error`: If username is taken, PIN too short, or registration fails

**Example**:
```javascript
const user = await fingerprintAuth.registerUser("John Doe", "1234", true);
console.log(user.id); // Firebase document ID
```

---

#### `async authenticateUser(userName = null, userPin = null, tryFingerprint = true)`
Authenticates a user using fingerprint or PIN.

**Parameters**:
- `userName` (String, optional): User's name (required if `tryFingerprint = false`)
- `userPin` (String, optional): User's PIN (required if `tryFingerprint = false`)
- `tryFingerprint` (Boolean, optional): Whether to try fingerprint first (default: true)

**Returns**: `Promise<Object>` - Authenticated user object

**Throws**: 
- `Error`: "CREDENTIALS_NEEDED" if credentials required
- `Error`: "Invalid username or PIN" if authentication fails

**Example**:
```javascript
// Try fingerprint first, fallback to credentials
const user = await fingerprintAuth.authenticateUser();

// Or authenticate with credentials directly
const user = await fingerprintAuth.authenticateUser("John", "1234", false);
```

---

#### `async setupFingerprintForDevice(userId, userName)`
Sets up fingerprint authentication for the current device.

**Parameters**:
- `userId` (String, required): Firebase user ID
- `userName` (String, required): User's display name

**Returns**: `Promise<Boolean>`

**Throws**: 
- `Error`: If biometric not supported

**Example**:
```javascript
await fingerprintAuth.setupFingerprintForDevice(user.id, user.name);
```

---

#### `hasFingerprintOnDevice()`
Checks if fingerprint is set up on the current device.

**Returns**: `Boolean`

**Example**:
```javascript
if (fingerprintAuth.hasFingerprintOnDevice()) {
  console.log("Fingerprint available");
}
```

---

#### `getDeviceFingerprintInfo()`
Gets fingerprint information for the current device.

**Returns**: `Object | null` - `{ userId, userName, setupDate }` or `null`

**Example**:
```javascript
const fpInfo = fingerprintAuth.getDeviceFingerprintInfo();
if (fpInfo) {
  console.log(`Fingerprint set up for: ${fpInfo.userName}`);
}
```

---

#### `async startActiveSession(userId, userName, startTime)`
Starts an active session for a user.

**Parameters**:
- `userId` (String, required): Firebase user ID
- `userName` (String, required): User's display name
- `startTime` (Date, required): Session start timestamp

**Returns**: `Promise<void>`

**Example**:
```javascript
const startTime = new Date();
await fingerprintAuth.startActiveSession(user.id, user.name, startTime);
```

---

#### `async stopActiveSession(userId)`
Stops an active session for a user.

**Parameters**:
- `userId` (String, required): Firebase user ID

**Returns**: `Promise<void>`

**Example**:
```javascript
await fingerprintAuth.stopActiveSession(user.id);
```

---

#### `async getActiveSession(userId)`
Gets the active session for a user.

**Parameters**:
- `userId` (String, required): Firebase user ID

**Returns**: `Promise<Object | null>` - Session object or `null` if no active session

**Example**:
```javascript
const session = await fingerprintAuth.getActiveSession(user.id);
if (session) {
  console.log(`Session started at: ${session.startTime}`);
}
```

---

#### `async saveTapEvent(user, station, duration)`
Saves a tap event (session start/stop) to Firebase.

**Parameters**:
- `user` (Object, required): User object with `id` and `name`
- `station` (String, required): "start" or "stop"
- `duration` (Number, required): Session duration in seconds (0 for start events)

**Returns**: `Promise<String>` - Firebase document ID

**Example**:
```javascript
await fingerprintAuth.saveTapEvent(user, "stop", 900);
```

---

#### `getAllUsers()`
Gets all users from the in-memory cache.

**Returns**: `Array<Object>` - Array of user objects

**Example**:
```javascript
const users = fingerprintAuth.getAllUsers();
console.log(`Total users: ${users.length}`);
```

---

#### `getUserById(userId)`
Gets a user by ID from the in-memory cache.

**Parameters**:
- `userId` (String, required): Firebase user ID

**Returns**: `Object | undefined` - User object or `undefined`

**Example**:
```javascript
const user = fingerprintAuth.getUserById("abc123");
```

---

## StartStation Class

### Constructor
```javascript
const startStation = new StartStation();
```

### Methods

#### `async initialize()`
Initializes the start station and sets up the UI.

**Returns**: `Promise<void>`

**Example**:
```javascript
const startStation = new StartStation();
await startStation.initialize();
```

---

#### `showRegistrationModal()`
Displays the registration modal.

**Example**:
```javascript
startStation.showRegistrationModal();
```

---

#### `showLoginModal()`
Displays the login modal.

**Example**:
```javascript
startStation.showLoginModal();
```

---

#### `async authenticateWithTouchId()`
Attempts authentication using fingerprint or shows login modal.

**Returns**: `Promise<void>`

**Example**:
```javascript
await startStation.authenticateWithTouchId();
```

---

#### `async registerNewUser(name, pin, statusMessage, modalOverlay)`
Registers a new user (called internally by registration modal).

**Parameters**:
- `name` (String, required): User's name
- `pin` (String, required): User's PIN
- `statusMessage` (HTMLElement, required): Status message element
- `modalOverlay` (HTMLElement, required): Modal overlay element

**Returns**: `Promise<void>`

---

#### `async processLogin(name, pin, statusMessage, modalOverlay)`
Processes user login (called internally by login modal).

**Parameters**:
- `name` (String, required): User's name
- `pin` (String, required): User's PIN
- `statusMessage` (HTMLElement, required): Status message element
- `modalOverlay` (HTMLElement, required): Modal overlay element

**Returns**: `Promise<void>`

---

#### `async handleUserAuthentication(user)`
Handles successful user authentication and starts a session.

**Parameters**:
- `user` (Object, required): Authenticated user object

**Returns**: `Promise<void>`

---

#### `startSessionTimer()`
Starts the session timer display.

**Example**:
```javascript
startStation.startSessionTimer();
```

---

## Firebase Collections Reference

### users Collection

**Path**: `/users/{userId}`

**Document Structure**:
```javascript
{
  name: String,              // User's display name
  pin: String,               // SHA-256 hash of PIN
  authMethod: String,        // "hybrid-fingerprint-pin"
  createdAt: String,         // ISO timestamp
  lastSeen: String,          // ISO timestamp
  deviceInfo: {
    registeredFrom: String,  // Device platform
    userAgent: String        // Browser user agent
  }
}
```

**Queries**:
```javascript
// Get all users
const snapshot = await getDocs(collection(db, 'users'));

// Find user by name (client-side)
const users = [];
snapshot.forEach(doc => {
  users.push({ id: doc.id, ...doc.data() });
});
const user = users.find(u => u.name.toLowerCase() === name.toLowerCase());
```

---

### activeSessions Collection

**Path**: `/activeSessions/{sessionId}`

**Document Structure**:
```javascript
{
  userId: String,            // User's Firebase ID
  userName: String,          // User's display name
  startTime: String,         // ISO timestamp
  station: String,           // "start"
  createdAt: String          // ISO timestamp
}
```

**Queries**:
```javascript
// Get active session for user
const q = query(
  collection(db, 'activeSessions'),
  where('userId', '==', userId)
);
const snapshot = await getDocs(q);

// Get all active sessions
const snapshot = await getDocs(collection(db, 'activeSessions'));
```

---

### taps Collection

**Path**: `/taps/{tapId}`

**Document Structure**:
```javascript
{
  userId: String,            // User's Firebase ID
  userName: String,          // User's display name
  station: String,           // "start" | "stop"
  timestamp: String,         // ISO timestamp
  duration: Number,          // Seconds (0 for start events)
  authMethod: String,        // "hybrid-fingerprint-pin"
  createdAt: String          // ISO timestamp
}
```

**Queries**:
```javascript
// Get user's session history
const q = query(
  collection(db, 'taps'),
  where('userId', '==', userId),
  where('station', '==', 'stop'),
  orderBy('timestamp', 'desc'),
  limit(100)
);
const snapshot = await getDocs(q);

// Get all completed sessions for leaderboard
const q = query(
  collection(db, 'taps'),
  where('station', '==', 'stop'),
  orderBy('duration', 'desc'),
  limit(50)
);
const snapshot = await getDocs(q);
```

---

## Utility Functions

### `formatTime(seconds)`
Formats seconds into HH:MM:SS or MM:SS format.

**Parameters**:
- `seconds` (Number, required): Number of seconds

**Returns**: `String` - Formatted time string

**Example**:
```javascript
formatTime(3661); // "01:01:01"
formatTime(125);  // "02:05"
```

---

### `formatDate(timestamp)`
Formats ISO timestamp into readable date/time string.

**Parameters**:
- `timestamp` (String, required): ISO timestamp string

**Returns**: `String` - Formatted date/time string

**Example**:
```javascript
formatDate("2025-10-08T12:00:00.000Z"); // "12:00:00 PM"
```

---

## Error Handling

### Common Error Messages

#### Authentication Errors
- `"CREDENTIALS_NEEDED"`: User must provide name and PIN
- `"Invalid username or PIN"`: Authentication failed
- `"No users registered. Please register first."`: No users in database
- `"Touch ID not supported on this device"`: Biometric not available

#### Registration Errors
- `"Please wait before registering again"`: Registration cooldown active
- `"This username is already taken. Please choose another name."`: Username conflict
- `"PIN must be at least 4 digits"`: Invalid PIN length

#### Session Errors
- `"You already have an active session running"`: Cannot start new session
- `"You need to start a session first!"`: Cannot stop without active session

### Error Handling Pattern

```javascript
try {
  const user = await fingerprintAuth.authenticateUser(name, pin);
  // Success handling
} catch (error) {
  if (error.message === "CREDENTIALS_NEEDED") {
    // Show login modal
  } else if (error.message.includes("Invalid")) {
    // Show error message
  } else {
    // Generic error handling
    console.error("Error:", error);
  }
}
```

---

## Browser Compatibility

### Web Authentication API
- ✅ Chrome 67+
- ✅ Safari 14+ (macOS)
- ✅ Edge 18+
- ⚠️ Firefox (partial support)
- ❌ Internet Explorer (not supported)

### Firebase SDK
- ✅ Chrome (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Firefox (latest)

---

## Performance Considerations

### Firebase Query Optimization

**Good Practice**: Limit query results
```javascript
const q = query(
  collection(db, 'taps'),
  where('station', '==', 'stop'),
  orderBy('timestamp', 'desc'),
  limit(50) // Limit results
);
```

**Good Practice**: Use indexes for complex queries
- Create composite indexes in Firebase Console
- Index on frequently queried fields

### Memory Management

**User Cache**: Loaded once on initialization
- Cleared and reloaded on page refresh
- Updated on user operations

**Session Cache**: Updated on start/stop
- Cleared on page refresh
- Syncs with Firebase on operations

---

## Security Best Practices

### PIN Security
- Always hash PINs before storage
- Never log or display PINs
- Validate PIN length (4-6 digits)

### Firebase Rules
- Implement proper security rules
- Validate data structure on create/update
- Prevent unauthorized access

### Client-Side Validation
- Validate all user inputs
- Sanitize user-generated content
- Handle errors gracefully

---

**Last Updated**: October 8, 2025  
**API Version**: 4.0
