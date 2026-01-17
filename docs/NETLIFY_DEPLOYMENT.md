# 🚀 Netlify Deployment Guide - TQ Stair Streak

This guide will help you deploy the TQ Stair Streak application to Netlify with 100% functionality.

## 📋 Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **GitHub Account**: For continuous deployment
3. **Firebase Project**: Already configured in the code

## 🎯 Quick Deployment (5 minutes)

### Method 1: Drag & Drop (Fastest)

1. **Zip the project files**:
   ```bash
   # In the project directory
   zip -r stair-streak-netlify.zip . -x "*.DS_Store" "node_modules/*" ".git/*"
   ```

2. **Deploy to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag and drop the `stair-streak-netlify.zip` file
   - Wait for deployment to complete
   - Your site will be live at `https://random-name.netlify.app`

### Method 2: Git Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - TQ Stair Streak"
   git branch -M main
   git remote add origin https://github.com/yourusername/stair-streak.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Deploy settings:
     - Build command: `echo "No build required"`
     - Publish directory: `.`
   - Click "Deploy site"

## ⚙️ Configuration

### Environment Variables (Optional)
No environment variables needed - Firebase config is hardcoded.

### Custom Domain (Optional)
1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS as instructed

## 🔧 Post-Deployment Setup

### 1. Test the Application
- Visit your Netlify URL
- Test camera access (HTTPS required)
- Test face recognition
- Test Firebase connectivity

### 2. Firebase Security Rules
Update your Firebase security rules:

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development
    }
  }
}
```

**⚠️ Security Note**: For production, implement proper authentication rules.

### 3. Enable HTTPS
Netlify automatically provides HTTPS, which is required for camera access.

## 📱 Testing Checklist

- [ ] **Camera Access**: Works on desktop and mobile
- [ ] **Face Detection**: Detects faces in camera feed
- [ ] **User Registration**: Auto-registers new users
- [ ] **Session Management**: Start/stop sessions work
- [ ] **Firebase Sync**: Data syncs across devices
- [ ] **Leaderboard**: Real-time updates work
- [ ] **Mobile Responsive**: Works on all screen sizes

## 🐛 Troubleshooting

### Camera Not Working
- **Issue**: Camera access denied
- **Solution**: Ensure HTTPS is enabled (Netlify provides this automatically)

### Firebase Connection Failed
- **Issue**: CORS errors or connection timeout
- **Solution**: Check Firebase project settings and security rules

### Face Recognition Not Working
- **Issue**: No faces detected
- **Solution**: Ensure good lighting and camera positioning

### Mobile Issues
- **Issue**: Touch events not working
- **Solution**: Test on different mobile browsers

## 🚀 Performance Optimization

### 1. Enable Netlify Features
- **Form Handling**: For contact forms (if added)
- **Functions**: For serverless functions (if needed)
- **Edge Functions**: For global performance

### 2. CDN Optimization
- Static assets are automatically cached
- Images are optimized
- CSS/JS are minified

### 3. Monitoring
- Enable Netlify Analytics
- Set up error tracking
- Monitor performance metrics

## 📊 Analytics & Monitoring

### Netlify Analytics
1. Go to Site settings → Analytics
2. Enable Netlify Analytics
3. View visitor statistics and performance

### Firebase Analytics (Optional)
Add Firebase Analytics to track user behavior:

```javascript
// Add to your HTML
<script type="module">
  import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js';
  const analytics = getAnalytics(app);
</script>
```

## 🔄 Continuous Deployment

### Automatic Deployments
- Every push to main branch triggers deployment
- Preview deployments for pull requests
- Rollback to previous versions if needed

### Branch Deployments
- `main` → Production site
- `develop` → Staging site
- `feature/*` → Preview deployments

## 🎉 Success!

Your TQ Stair Streak application is now live on Netlify with:
- ✅ HTTPS enabled
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Form handling
- ✅ Redirects configured
- ✅ Security headers
- ✅ Performance optimization

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Test on different devices/browsers
4. Check Netlify deployment logs

## 🔗 Useful Links

- [Netlify Documentation](https://docs.netlify.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [WebRTC Camera API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Project Repository](https://github.com/yourusername/stair-streak)

---

**🎯 Your TQ Stair Streak app is now 100% functional and deployed on Netlify!**
