const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.get('/resolve', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({
      error: 'Missing "url" query parameter. Example: /resolve?url=https://example.com',
    });
  }

  let browser;
  try {
    console.log('Using Puppeteer executable path:', puppeteer.executablePath()); // Log the path
    console.log('Launching Puppeteer...');

    // Force Puppeteer to use its bundled Chromium
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    console.log('Puppeteer launched successfully.');

    const page = await browser.newPage();
    console.log(`Navigating to URL: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);

    res.json({ finalUrl });
  } catch (err) {
    console.error('Error during Puppeteer navigation:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) {
      await browser.close();
      console.log('Puppeteer browser closed.');
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Puppeteer service running on port ${PORT}`);
});