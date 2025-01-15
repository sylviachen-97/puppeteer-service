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
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    console.log(`Navigating to URL: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Detect and handle consent pages
    if (page.url().includes('consent.google.com')) {
      console.log('Consent page detected. Searching for an "agree/accept" button...');

      try {
        // Wait for any button or input to appear
        await page.waitForSelector('button, input[type="button"], input[type="submit"]', { timeout: 5000 });

        // Collect all button-like elements
        const allButtons = await page.$$('button, input[type="button"], input[type="submit"]');
        let clicked = false;

        for (const btn of allButtons) {
          const text = await page.evaluate(el => el.innerText || el.value || '', btn);
          const lowerText = text.trim().toLowerCase();
          console.log('Found button/input with text:', lowerText);

          if (lowerText.includes('agree') || lowerText.includes('accept')) {
            console.log('Clicking button:', text);

            await Promise.all([
              btn.click(),
              page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
            ]);

            clicked = true;
            break;
          }
        }

        if (!clicked) {
          console.warn("No 'agree'/'accept' button found. Might need custom logic for your region.");
        }
      } catch (e) {
        console.warn('Consent handling failed or timeout occurred.');
      }
    }

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