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
    console.log('Using Puppeteer executable path:', puppeteer.executablePath());

    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: puppeteer.executablePath(), // Explicitly use bundled browser
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'], // Required for Render
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    res.json({ finalUrl: page.url() });
  } catch (err) {
    console.error('Error during Puppeteer navigation:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Puppeteer service running on port ${PORT}`);
});