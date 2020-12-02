const puppeteer = require('puppeteer');
const debug = require('debug')('valiu:workerFunctions');

const screenshot = (page, url, path) =>
  new Promise((resolve, reject) => {
    page.on('error', (err) => {
      reject(err);
    });
    page.on('load', () => debug('Page loaded Successfully'));
    page.on('pageerror', (err) => {
      reject(err);
    });

    page
      .goto(url, { waitUntil: 'load', timeout: 20000 })
      .then(() =>
        page.screenshot({
          path,
          type: `${process.env.IMAGE_EXTENSION}`,
        })
      )
      .then(() => resolve(false))
      .catch((err) => {
        reject(err.message);
      });
  });

exports.takeScreenshot = async (url, path) => {
  const browser = await puppeteer.launch({
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--lang=en-US',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });
  const page = await browser.newPage();

  try {
    await screenshot(page, url, path);
    return false;
  } catch (err) {
    debug(`Caught error and escallating`);
    return err;
  } finally {
    await page.close();
    await browser.close();
  }
};
