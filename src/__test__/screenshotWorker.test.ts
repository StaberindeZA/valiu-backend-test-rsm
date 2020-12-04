require('dotenv').config({ path: '.env' });
import screenshotWorker from '../queue/screenshotWorker';
import * as workerFunctions from '../queue/workerFunctions';
import { Job, JobId } from 'bull';

test('Successfully generate screenshot', async () => {
  const spy = jest.spyOn(workerFunctions, 'takeScreenshot');
  spy.mockResolvedValue(false);

  const input = <Job>{
    id: '1',
    data: { url: 'https://www.reinomuhl.com', filename: 'testfile.jpeg' },
  };

  const result = await screenshotWorker(input);

  expect(result).toEqual({
    url: 'https://www.reinomuhl.com',
    screenshotURL: `${process.env.IMAGE_FOLDER}/test/testfile.jpeg`,
    generated: true,
  });

  spy.mockRestore();
});

test('Failed generate screenshot', async () => {
  const spy = jest.spyOn(workerFunctions, 'takeScreenshot');
  spy.mockResolvedValue('Error message');

  // moveToFailed(errorInfo: { message: string; }, ignoreLock?: boolean): Promise<[any, JobId] | null>;
  const moveToFailed = (errorInfo: { message: string; }, ignoreLock?: boolean): Promise<[any, JobId] | null> => {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }

  const input = <Job>{
    id: '1',
    data: { url: 'http://www.localhost.com:4444', filename: 'failed.jpeg' },
    moveToFailed,
  };

  const result = await screenshotWorker(input);

  expect(result).toEqual({
    url: 'http://www.localhost.com:4444',
    screenshotURL: `${process.env.IMAGE_FOLDER}/test/failed.jpeg`,
    generated: false,
  });

  spy.mockRestore();
});
