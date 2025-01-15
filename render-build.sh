#!/usr/bin/env bash

echo "Step 1: Unsetting PUPPETEER_SKIP_DOWNLOAD to ensure browser download..."
export PUPPETEER_SKIP_DOWNLOAD=false

echo "Step 2: Installing Puppeteer and downloading bundled browser..."
PUPPETEER_CACHE_DIR=$(pwd)/.cache/puppeteer npm install puppeteer --save --force || {
  echo "Failed to install Puppeteer or download browser" >&2
  exit 1
}

echo "Step 3: Verifying Puppeteer's bundled browser path..."
node -e "console.log('Puppeteer browser path:', require('puppeteer').executablePath())" || {
  echo "Failed to verify Puppeteer's browser path" >&2
  exit 1
}

echo "Build script completed successfully."