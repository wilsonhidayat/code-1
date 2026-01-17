#!/usr/bin/env python3

# Build script for Stair Streak App
import os
import shutil
import glob

print('🚀 Building Stair Streak App...')

# Create dist directory
dist_dir = 'dist'
if not os.path.exists(dist_dir):
    os.makedirs(dist_dir)

# Files to copy
files_to_copy = [
    'src/index.html',
    'src/start.html', 
    'src/stop.html',
    'src/leaderboard.html',
    'src/netlify.toml',
    'src/_redirects'
]

# Copy HTML files and config
for file in files_to_copy:
    if os.path.exists(file):
        dest = os.path.join(dist_dir, os.path.basename(file))
        shutil.copy2(file, dest)
        print(f'📄 Copied {file} -> {dest}')

# Create assets directory structure
assets_dir = os.path.join(dist_dir, 'assets')
css_dir = os.path.join(assets_dir, 'css')
js_dir = os.path.join(assets_dir, 'js')
images_dir = os.path.join(assets_dir, 'images')

for dir_path in [assets_dir, css_dir, js_dir, images_dir]:
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)

# Copy CSS files
css_files = glob.glob('src/css/*')
for file in css_files:
    dest = os.path.join(css_dir, os.path.basename(file))
    shutil.copy2(file, dest)
    print(f'🎨 Copied {file} -> {dest}')

# Copy JS files recursively
def copy_js_files(src_dir, dest_dir):
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.js'):
                src_path = os.path.join(root, file)
                rel_path = os.path.relpath(src_path, src_dir)
                dest_path = os.path.join(dest_dir, rel_path)
                
                # Create subdirectories if needed
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                
                shutil.copy2(src_path, dest_path)
                print(f'📜 Copied {src_path} -> {dest_path}')

copy_js_files('src/js', js_dir)

# Copy images
if os.path.exists('src/images'):
    image_files = glob.glob('src/images/*')
    for file in image_files:
        dest = os.path.join(images_dir, os.path.basename(file))
        shutil.copy2(file, dest)
        print(f'🖼️  Copied {file} -> {dest}')

# Update import paths in HTML files
html_files = ['index.html', 'start.html', 'stop.html', 'leaderboard.html']
for file in html_files:
    file_path = os.path.join(dist_dir, file)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update CSS paths
        content = content.replace('css/', 'assets/css/')
        # Update JS paths  
        content = content.replace('js/', 'assets/js/')
        # Update image paths
        content = content.replace('images/', 'assets/images/')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'🔧 Updated paths in {file}')

print('✅ Build complete! Ready for deployment.')
print(f'📦 Output directory: {dist_dir}')
print('🌐 To deploy: Upload the dist/ folder to Netlify')
