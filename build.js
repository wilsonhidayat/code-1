#!/usr/bin/env node

// Build script for Stair Streak App
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Stair Streak App...');

// Create dist directory
const distDir = 'dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Files to copy
const filesToCopy = [
  'src/index.html',
  'src/start.html', 
  'src/stop.html',
  'src/leaderboard.html',
  'src/netlify.toml',
  'src/_redirects'
];

// Copy HTML files and config
filesToCopy.forEach(file => {
  const dest = path.join(distDir, path.basename(file));
  fs.copyFileSync(file, dest);
  console.log(`📄 Copied ${file} -> ${dest}`);
});

// Create assets directory structure
const assetsDir = path.join(distDir, 'assets');
const cssDir = path.join(assetsDir, 'css');
const jsDir = path.join(assetsDir, 'js');
const imagesDir = path.join(assetsDir, 'images');

[assetsDir, cssDir, jsDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy CSS files
const cssFiles = fs.readdirSync('src/css');
cssFiles.forEach(file => {
  const src = path.join('src/css', file);
  const dest = path.join(cssDir, file);
  fs.copyFileSync(src, dest);
  console.log(`🎨 Copied ${src} -> ${dest}`);
});

// Copy JS files
const jsFiles = fs.readdirSync('src/js');
jsFiles.forEach(file => {
  const src = path.join('src/js', file);
  const dest = path.join(jsDir, file);
  fs.copyFileSync(src, dest);
  console.log(`📜 Copied ${src} -> ${dest}`);
});

// Copy images
if (fs.existsSync('src/images')) {
  const imageFiles = fs.readdirSync('src/images');
  imageFiles.forEach(file => {
    const src = path.join('src/images', file);
    const dest = path.join(imagesDir, file);
    fs.copyFileSync(src, dest);
    console.log(`🖼️  Copied ${src} -> ${dest}`);
  });
}

// Update import paths in HTML files
const htmlFiles = ['index.html', 'start.html', 'stop.html', 'leaderboard.html'];
htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update CSS paths
  content = content.replace(/assets\/css\//g, 'assets/css/');
  // Update JS paths  
  content = content.replace(/assets\/js\//g, 'assets/js/');
  // Update image paths
  content = content.replace(/assets\/images\//g, 'assets/images/');
  
  fs.writeFileSync(filePath, content);
  console.log(`🔧 Updated paths in ${file}`);
});

console.log('✅ Build complete! Ready for deployment.');
console.log(`📦 Output directory: ${distDir}`);
console.log('🌐 To deploy: Upload the dist/ folder to Netlify');
