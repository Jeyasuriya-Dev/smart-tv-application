#!/bin/bash

TARGET="dist-webos/index.html"

echo "🔧 Patching $TARGET..."

# Remove type="module" and crossorigin attributes from script tag
sed -i 's/type="module" crossorigin//g' "$TARGET"
sed -i 's/crossorigin//g' "$TARGET"

echo "✅ Patch complete."
