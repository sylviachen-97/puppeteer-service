// 1) REQUIRE EXPRESS & PUPPETEER
const express = require('express');
const puppeteer = require('puppeteer');

// 2) CREATE THE EXPRESS APP
const app = express();
app.use(express.json()); // parse JSON if needed

// 3) DEFINE YOUR ROUTE /resolve
app.get('/resolve', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({
      error: 'Missing "url" query parameter. Example: /resolve?url=https://example.com',
    });
  }

  let browser;
  try {
    console.log('Launching Puppeteer...');
    browser = await puppeteer.launch({
      headless: 'new', // Use 'new' or 'true' if not supported
      executablePath: '/usr/bin/google-chrome-stable', // Path to Chrome
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for headless Chrome
    });
    console.log('Puppeteer launched successfully.');

    // 3B) CREATE NEW PAGE & GOTO
    const page = await browser.newPage();
    console.log(`Navigating to URL: ${url}`);
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
    console.log(`Navigation to ${url} completed.`);

    // 3C) HANDLE CONSENT PAGES (if any)
    if (page.url().includes('consent.google.com')) {
      console.log('Consent page detected. Searching for an "agree/accept" button...');
      // Your consent handling logic here
    }

    // 3D) GET FINAL URL
    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);

    // 3E) RESPOND WITH FINAL URL
    res.json({ finalUrl });

  } catch (err) {
    console.error('Error during Puppeteer navigation:', err);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  } finally {
    if (browser) {
      await browser.close();
      console.log('Puppeteer browser closed.');
    }
  }
});

// 4) START THE EXPRESS SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Puppeteer service running on port ${PORT}`);
});