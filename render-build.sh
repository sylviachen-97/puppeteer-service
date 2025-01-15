#!/usr/bin/env bash

echo "Step 1: Ensuring Puppeteer downloads its bundled browser..."
export PUPPETEER_SKIP_DOWNLOAD=false
PUPPETEER_CACHE_DIR=$(pwd)/.cache/puppeteer npm install puppeteer --save --force || {
  echo "Failed to install Puppeteer or download browser" >&2
  exit 1
}

echo "Step 2: Verifying Puppeteer's bundled browser path..."
# Log the browser executable path for debugging
node -e "console.log('Puppeteer browser path:', require('puppeteer').executablePath())" || {
  echo "Failed to verify Puppeteer's browser path" >&2
  exit 1
}

echo "Build script completed successfully."