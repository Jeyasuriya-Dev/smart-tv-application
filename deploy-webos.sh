#!/bin/bash

# === Configuration ===
APP_ID="com.smarttv.launchapp"
BUILD_DIR="dist-webos"
IPK_NAME="$BUILD_DIR.ipk"

# Ensure CLI tools are accessible
export PATH=$PATH:/home/user/.nvm/versions/node/v18.20.8/bin

echo "🔁 Cleaning previous build..."
rm -rf $BUILD_DIR $IPK_NAME

echo "🧱 Building app for webOS..."
BUILD_TARGET=webos npm run build

echo "📁 Copying appinfo.json..."
cp appinfo.json $BUILD_DIR/

echo "📦 Packaging app..."
ares-package $BUILD_DIR

echo "❌ Uninstalling previous app (if any)..."
ares-uninstall --device emulator $APP_ID

echo "⬆️ Installing new package..."
ares-install --device emulator $IPK_NAME

echo "🚀 Launching app..."
ares-launch --device emulator $APP_ID

echo "✅ Done!"

