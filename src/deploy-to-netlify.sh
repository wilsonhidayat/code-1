#!/bin/bash

# Netlify Deployment Script for Stair Streak App
echo "🚀 Creating Netlify deployment package..."

# Create deployment directory
mkdir -p netlify-deploy

# Copy all necessary files
echo "📁 Copying files..."
cp index.html netlify-deploy/
cp start.html netlify-deploy/
cp stop.html netlify-deploy/
cp leaderboard.html netlify-deploy/
cp netlify.toml netlify-deploy/
cp _redirects netlify-deploy/
cp firebase-config.js netlify-deploy/

# Copy assets directory
cp -r assets netlify-deploy/

# Copy documentation
cp README.md netlify-deploy/
cp DEPLOYMENT_READY.md netlify-deploy/
cp FIREBASE_SETUP.md netlify-deploy/
cp NETLIFY_DEPLOYMENT.md netlify-deploy/

# Create zip file
echo "📦 Creating deployment package..."
cd netlify-deploy
zip -r ../stair-streak-netlify.zip .
cd ..

echo "✅ Deployment package created: stair-streak-netlify.zip"
echo ""
echo "🌐 To deploy to Netlify:"
echo "1. Go to https://app.netlify.com"
echo "2. Click 'New site from ZIP'"
echo "3. Upload 'stair-streak-netlify.zip'"
echo "4. Your site will be deployed automatically!"
echo ""
echo "📋 Make sure your Firebase project is configured with:"
echo "   - Firestore Database enabled"
echo "   - Web app added with the correct configuration"
echo "   - Security rules set to allow read/write (for testing)"