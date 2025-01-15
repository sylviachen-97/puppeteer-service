const express = require('express');
const puppeteer = require('puppeteer'); // v18.2.1 (pinned in package.json)

const app = express();
app.use(express.json());

// Example route: GET /resolve?url=https://news.google.com/rss/articles/CBMi...
app.get('/resolve', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  let browser;
  try {
    // 1) Launch Puppeteer with the older Chromium
    //    No "executablePath", no "headless: 'new'", etc.
    browser = await puppeteer.launch({
      headless: true, // or false if you want a UI (not typical in Render)
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // 2) (Optional) Handle Google consent if needed:
    if (page.url().includes('consent.google.com')) {
      console.log('Consent page detected; searching for "agree/accept" button...');
      await page.waitForSelector('button, input[type="button"], input[type="submit"]', { timeout: 5000 })
        .catch(() => console.warn('No clickable elements found on consent page'));

      const buttons = await page.$$('button, input[type="button"], input[type="submit"]');
      let clicked = false;
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.innerText || el.value || '', btn);
        if (text.toLowerCase().includes('agree') || text.toLowerCase().includes('accept')) {
          console.log('Clicking consent button:', text);
          await Promise.all([
            btn.click(),
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
          ]);
          clicked = true;
          break;
        }
      }
      if (!clicked) console.warn("Couldn't find an 'agree'/'accept' button.");
    }

    // 3) Return the final URL
    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);
    res.json({ finalUrl });
  } catch (err) {
    console.error('Error during Puppeteer navigation:', err);
    res.status(500).json({ error: err.toString() });
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Puppeteer service running on port ${PORT}`);
});