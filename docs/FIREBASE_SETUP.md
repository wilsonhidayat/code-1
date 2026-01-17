# 🔥 Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `stair-streak-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to you
5. Click "Done"

## Step 3: Get Firebase Configuration

1. Click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Enter app nickname: `stair-streak-web`
5. Click "Register app"
6. Copy the `firebaseConfig` object

## Step 4: Update Your App

Replace the placeholder config in these files:
- `public/start.html` (line 64-71)
- `public/stop.html` (line 64-71) 
- `public/leaderboard.html` (line 47-54)

Replace this:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

With your actual config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Your actual API key
  authDomain: "stair-streak-app.firebaseapp.com",
  projectId: "stair-streak-app",
  storageBucket: "stair-streak-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

## Step 5: Test the Setup

1. Open `public/index.html` in your browser
2. Go to Start Station and register a user
3. Go to Stop Station - you should see the same user!
4. Check the Leaderboard - it should show real-time updates

## 🎯 How It Works Now

- **Device 1 (Start):** Registers users and logs start taps → Firebase
- **Device 2 (Stop):** Sees same users and logs stop taps → Firebase  
- **Leaderboard:** Shows live updates from both devices
- **Real-time sync:** Changes appear instantly on all devices

## 🔒 Security Rules (Optional)

For production, update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Allow all for now
    }
  }
}
```

## ✅ You're Done!

Your two-device setup now works perfectly:
- Users register once on either device
- Start/stop taps sync in real-time
- Leaderboard updates live across all devices
- No server setup required!

## 🆘 Troubleshooting

**"Error loading users" message:**
- Check your Firebase config is correct
- Make sure Firestore is enabled
- Check browser console for detailed errors

**Camera not working:**
- Use HTTPS or localhost
- Check browser permissions

**Data not syncing:**
- Verify both devices have the same Firebase config
- Check internet connection
- Look for errors in browser console
