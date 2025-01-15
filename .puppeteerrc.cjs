const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Set the cache directory for Puppeteer's browser binaries
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
