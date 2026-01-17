# 🏃‍♂️ Stair Streak App

A professional Touch ID authentication system for tracking stair climbing sessions with real-time leaderboards.

## 📁 Project Structure

```
stair-streak-app/
├── src/                          # Source files
│   ├── js/                       # JavaScript modules
│   │   ├── modules/              # Feature modules
│   │   │   ├── fingerprint-auth.js
│   │   │   ├── leaderboard.js
│   │   │   └── start-station.js
│   │   ├── config/               # Configuration
│   │   │   └── firebase.js
│   │   └── app.js               # Main app file
│   ├── css/                     # Stylesheets
│   │   ├── index.css
│   │   ├── station.css
│   │   └── leaderboard.css
│   ├── images/                  # Images and assets
│   ├── index.html               # Main menu
│   ├── start.html               # Start station
│   ├── stop.html                # Stop station
│   ├── leaderboard.html         # Leaderboard
│   ├── firebase-config.js       # Firebase configuration
│   ├── netlify.toml            # Netlify configuration
│   └── _redirects              # URL redirects
├── docs/                        # Documentation
│   ├── DEPLOYMENT_READY.md
│   ├── FIREBASE_SETUP.md
│   └── NETLIFY_DEPLOYMENT_GUIDE.md
├── dist/                        # Built files (generated)
├── build.js                     # Build script
├── package.json                 # Project configuration
└── README.md                    # This file
```

## 🚀 Quick Start

### Development
```bash
# Install dependencies (if any)
npm install

# Start development server
npm run dev

# Open http://localhost:8080
```

### Build for Production
```bash
# Build the project
npm run build

# The dist/ folder will contain all files ready for deployment
```

### Deploy to Netlify
```bash
# Build and prepare for deployment
npm run deploy

# Then upload the dist/ folder to Netlify
```

## 🎯 Features

- **Touch ID Authentication** - Secure biometric authentication
- **Auto-Detection** - Automatic fingerprint scanning
- **Session Management** - Start/stop tracking with timers
- **Real-time Leaderboard** - Live rankings and statistics
- **Firebase Integration** - Cloud data storage
- **Responsive Design** - Works on all devices

## 🔧 Configuration

### Firebase Setup
1. Edit `src/js/config/firebase.js` with your Firebase credentials
2. Enable Firestore Database in Firebase Console
3. Set up security rules (see docs/FIREBASE_SETUP.md)

### Touch ID Requirements
- HTTPS connection (required for WebAuthn)
- Modern browser with WebAuthn support
- Device with fingerprint sensor

## 📱 Usage

1. **Start Station**: Touch fingerprint sensor to start a session
2. **Stop Station**: Touch fingerprint sensor to end a session
3. **Leaderboard**: View real-time rankings and statistics

## 🛠️ Development

### File Organization
- `src/js/modules/` - Feature-specific JavaScript modules
- `src/js/config/` - Configuration files
- `src/css/` - Stylesheets
- `src/` - HTML files and static assets

### Adding New Features
1. Create new module in `src/js/modules/`
2. Import and use in `src/js/app.js`
3. Update HTML files as needed
4. Run `npm run build` to test

## 📦 Deployment

The project is optimized for Netlify deployment:

1. Run `npm run build`
2. Upload the `dist/` folder to Netlify
3. Configure custom domain (optional)
4. Set up Firebase (see docs/)

## 🔍 Troubleshooting

- **Touch ID not working**: Ensure HTTPS connection
- **Firebase errors**: Check configuration and security rules
- **Build issues**: Run `npm run clean && npm run build`

## 📄 License

MIT License - see LICENSE file for details