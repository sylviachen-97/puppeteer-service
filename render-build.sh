#!/usr/bin/env bash

echo "Step 1: Updating apt and installing dependencies (wget, gnupg)..."
apt-get update && apt-get install -y wget gnupg || {
  echo "Failed to update apt or install dependencies" >&2
  exit 1
}

echo "Step 2: Adding Google Chrome signing key..."
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - || {
  echo "Failed to add Google Chrome signing key" >&2
  exit 1
}

echo "Step 3: Adding Google Chrome repository..."
sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list' || {
  echo "Failed to add Google Chrome repository" >&2
  exit 1
}

echo "Step 4: Installing Google Chrome Stable..."
apt-get update && apt-get install -y google-chrome-stable || {
  echo "Failed to install Google Chrome Stable" >&2
  exit 1
}

echo "Step 5: Verifying Chrome installation..."
if which google-chrome-stable > /dev/null 2>&1; then
  echo "Google Chrome executable found at: $(which google-chrome-stable)"
else
  echo "Google Chrome executable not found!" >&2
  exit 1
fi

echo "Step 6: Checking Google Chrome version..."
google-chrome-stable --version || {
  echo "Failed to retrieve Google Chrome version!" >&2
  exit 1
}

echo "Google Chrome installation completed successfully."