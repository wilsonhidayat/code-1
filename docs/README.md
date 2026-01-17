# 🏃‍♂️ TQ Stair Streak - Touch ID System

A professional Touch ID authentication system for tracking stair climbing sessions with real-time leaderboards.

## 🚀 **Ready for Netlify Deployment**

### 📁 **Project Structure**
```
/
├── index.html              # Main menu
├── start.html              # Start station
├── stop.html               # Stop station
├── leaderboard.html        # Leaderboard
├── firebase-config.js      # Firebase configuration
├── netlify.toml           # Netlify configuration
├── _redirects             # Netlify redirects
├── assets/
│   ├── css/
│   │   ├── index.css
│   │   ├── station.css
│   │   └── leaderboard.css
│   └── js/
│       ├── fingerprint-auth.js
│       ├── firebase.js
│       └── leaderboard.js
└── README.md
```

## 🎯 **Features**

- **Professional Face Recognition** - No API keys required
- **Auto-Registration** - New users automatically registered
- **Session Management** - Prevents duplicate sessions
- **Real-time Leaderboard** - Live updates and rankings
- **Mobile Compatible** - Works on all devices
- **Firebase Integration** - Real-time data storage

## 🔧 **Setup for Netlify**

### 1. **Configure Firebase**
Edit `firebase-config.js` with your Firebase project details:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 2. **Deploy to Netlify**

#### **Option A: Drag & Drop**
1. Zip all files in this directory
2. Go to [Netlify](https://netlify.com)
3. Drag and drop the zip file
4. Your site will be live!

#### **Option B: Git Repository**
1. Push this code to GitHub/GitLab
2. Connect repository to Netlify
3. Deploy automatically

#### **Option C: Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir .
```

## 🎮 **How It Works**

1. **Start Station**: Users look at camera → System recognizes/registers → Session starts
2. **Stop Station**: Users look at camera → System recognizes → Session stops with timing
3. **Leaderboard**: Shows all users with photos, rankings, and personal bests

## 🔒 **Security Features**

- Face embeddings stored securely in Firebase
- Session validation prevents cheating
- Real-time data validation
- Error handling for all edge cases

## 📱 **Device Support**

- ✅ Desktop computers
- ✅ Laptops with webcams
- ✅ Mobile phones (iOS/Android)
- ✅ Tablets
- ✅ All modern browsers

## 🛠️ **Technical Details**

- **Face Recognition**: Custom algorithm with 70% similarity threshold
- **Database**: Firebase Realtime Database
- **Frontend**: Vanilla JavaScript (no frameworks)
- **Styling**: Pure CSS with responsive design
- **Deployment**: Netlify (static hosting)

## 🚀 **Deployment Checklist**

- [ ] Firebase project configured
- [ ] Firebase config updated in `firebase-config.js`
- [ ] All files uploaded to Netlify
- [ ] Site tested on different devices
- [ ] Camera permissions working
- [ ] Face recognition working
- [ ] Leaderboard updating in real-time

## 📞 **Support**

If you encounter any issues:
1. Check browser console for errors
2. Ensure camera permissions are granted
3. Verify Firebase configuration
4. Test on different devices

**Ready for production deployment!** 🎉