require('dotenv').config({ path: '.env' });
const screenshotWorker = require('../screenshotWorker');
const workerFunctions = require('../workerFunctions');

test('Successfully generate screenshot', async () => {
  const spy = jest.spyOn(workerFunctions, 'takeScreenshot');
  spy.mockResolvedValue(false);

  const result = await screenshotWorker({
    id: '1',
    data: { url: 'https://www.reinomuhl.com', filename: 'testfile.jpeg' },
  });

  expect(result).toEqual({
    url: 'https://www.reinomuhl.com',
    screenshotURL: `${process.env.IMAGE_FOLDER}/testfile.jpeg`,
    generated: true,
  });

  spy.mockRestore();
});

test('Failed generate screenshot', async () => {
  const spy = jest.spyOn(workerFunctions, 'takeScreenshot');
  spy.mockResolvedValue('Error message');

  const result = await screenshotWorker({
    id: '2',
    data: { url: 'http://www.localhost.com:4444', filename: 'failed.jpeg' },
    moveToFailed: () => true,
  });

  expect(result).toEqual({
    url: 'http://www.localhost.com:4444',
    screenshotURL: `${process.env.IMAGE_FOLDER}/failed.jpeg`,
    generated: false,
  });

  spy.mockRestore();
});
