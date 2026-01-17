# 🚀 Netlify Deployment Guide

## Quick Deployment

### Option 1: Drag & Drop (Easiest)
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Log in or create an account
3. Drag and drop the `stair-streak-netlify.zip` file onto the deployment area
4. Your site will be deployed automatically!

### Option 2: Manual Upload
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "New site from ZIP"
3. Upload `stair-streak-netlify.zip`
4. Click "Deploy site"

## 🔧 Firebase Configuration

### 1. Firebase Project Setup
- Go to [https://console.firebase.google.com](https://console.firebase.google.com)
- Create a new project or use existing: `stair-streak-app`
- Enable Firestore Database
- Set up security rules (see below)

### 2. Security Rules
In Firebase Console > Firestore Database > Rules, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents (for testing)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Security Note:** For production, implement proper authentication rules.

### 3. Web App Configuration
- In Firebase Console, go to Project Settings
- Add a web app with the configuration from `firebase-config.js`
- The configuration is already set up in the code

## 📱 Features Included

### ✅ Touch ID Authentication
- Automatic fingerprint detection
- User registration and authentication
- Session management

### ✅ Start Station (`/start`)
- Auto-detect Touch ID
- Start stair climbing sessions
- Real-time timer

### ✅ Stop Station (`/stop`)
- Auto-detect Touch ID
- Stop active sessions
- Session summary display

### ✅ Leaderboard (`/leaderboard`)
- Real-time leaderboard
- Personal best times
- Session statistics

## 🌐 Custom Domain (Optional)

1. In Netlify dashboard, go to your site
2. Click "Domain settings"
3. Add your custom domain
4. Configure DNS settings as instructed

## 🔍 Testing Your Deployment

1. **Test Touch ID**: Visit your deployed site and test fingerprint authentication
2. **Test Start Station**: Start a session and verify it's saved to Firebase
3. **Test Stop Station**: Stop the session and check the summary
4. **Test Leaderboard**: Verify data appears correctly

## 📊 Monitoring

- Check Netlify dashboard for deployment status
- Monitor Firebase Console for data
- Check browser console for any errors

## 🚨 Troubleshooting

### Common Issues:

1. **Touch ID not working**: Ensure you're using HTTPS (required for WebAuthn)
2. **Firebase errors**: Check security rules and configuration
3. **Module import errors**: Ensure all files are uploaded correctly

### Debug Steps:
1. Open browser developer tools
2. Check console for errors
3. Verify Firebase connection in Network tab
4. Test Touch ID support in console

## 📁 File Structure

```
stair-streak-netlify.zip
├── index.html              # Main menu
├── start.html              # Start station
├── stop.html               # Stop station
├── leaderboard.html        # Leaderboard
├── netlify.toml           # Netlify configuration
├── _redirects             # URL redirects
├── firebase-config.js     # Firebase configuration
└── assets/
    ├── css/               # Stylesheets
    └── js/                # JavaScript modules
        ├── firebase.js    # Firebase functions
        ├── fingerprint-auth.js  # Touch ID system
        └── leaderboard.js # Leaderboard logic
```

## 🎉 Success!

Once deployed, your Stair Streak app will be live and accessible via the Netlify URL. Users can:

- Register with Touch ID
- Start and stop sessions
- View real-time leaderboard
- Track their stair climbing progress

**Live URL**: Your site will be available at `https://[random-name].netlify.app`
