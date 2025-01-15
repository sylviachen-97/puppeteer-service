#!/usr/bin/env bash

echo "Step 1: Installing Puppeteer and ensuring bundled browser is downloaded..."
# Install Puppeteer and download its bundled browser
PUPPETEER_CACHE_DIR=$(pwd)/.cache/puppeteer npm install puppeteer --save --force || {
  echo "Failed to install Puppeteer or download browser" >&2
  exit 1
}

echo "Step 2: Verifying Puppeteer's bundled browser path..."
# Log the path of Puppeteer's bundled browser
node -e "console.log('Puppeteer browser path:', require('puppeteer').executablePath())" || {
  echo "Failed to verify Puppeteer's browser path" >&2
  exit 1
}

echo "Build script completed successfully."