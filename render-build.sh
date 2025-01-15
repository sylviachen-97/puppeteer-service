#!/usr/bin/env bash

echo "Step 1: Installing Puppeteer and downloading bundled browser..."
# Install Puppeteer and force browser download
PUPPETEER_CACHE_DIR=$(pwd)/.cache/puppeteer npm install puppeteer --save --force || {
  echo "Failed to install Puppeteer or download browser" >&2
  exit 1
}

echo "Step 2: Installing necessary dependencies for Chrome..."
# Install required dependencies
apt-get update && apt-get install -y \
  libatk1.0-0 libcairo2 libgdk-pixbuf2.0-0 libxcomposite1 libxrandr2 libxdamage1 libnss3 libnspr4 libxss1 \
  libx11-xcb1 libxext6 libxfixes3 libxtst6 libxcb1 libasound2 fonts-liberation libpango1.0-0 libcups2 \
  --no-install-recommends || {
  echo "Failed to install Chrome dependencies" >&2
  exit 1
}

echo "Step 3: Verifying Puppeteer's browser executable path..."
# Verify the browser executable path
node -e "console.log('Puppeteer browser path:', require('puppeteer').executablePath())" || {
  echo "Failed to verify Puppeteer's browser path" >&2
  exit 1
}

echo "Build script completed successfully."