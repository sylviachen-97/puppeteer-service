#!/usr/bin/env bash

echo "Step 1: Installing Puppeteer and downloading Chromium..."
# Install Puppeteer and download its bundled Chromium
npm install puppeteer --save --ignore-scripts || {
  echo "Failed to install Puppeteer or download Chromium" >&2
  exit 1
}

echo "Step 2: Verifying Puppeteer's Chromium executable path..."
# Log Puppeteer's bundled Chromium executable path
node -e "console.log('Puppeteer Chromium executable path:', require('puppeteer').executablePath())" || {
  echo "Failed to verify Puppeteer's Chromium path" >&2
  exit 1
}

echo "Puppeteer's bundled Chromium setup completed successfully."