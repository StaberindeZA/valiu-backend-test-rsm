import puppeteer, { Page, ScreenshotOptions } from 'puppeteer';
import DebugLogger from 'debug';

const debug = DebugLogger('valiu:workerFunctions');

const screenshot = (page: Page, url: string, path: string) => {
  const type: ScreenshotOptions["type"] = process.env.IMAGE_EXTENSION;
  
  return new Promise((resolve, reject) => {
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
          type,
        })
      )
      .then(() => resolve(false))
      .catch((err) => {
        reject(err.message);
      });
  });
}
  

export const takeScreenshot = async (url: string, path: string) => {
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
