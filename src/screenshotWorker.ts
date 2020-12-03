import path from 'path';
import DebugLogger from 'debug';
import { getImagePath } from './utility';
import * as workerFunctions from './workerFunctions';
import { Job } from 'bull';

const debug = DebugLogger('valiu:screenshotWorker');

export default async (job: Job) => {
  const { url, filename } = job.data;

  const filePath = `${path.dirname(getImagePath(filename))}/${filename}`;
  const error = await workerFunctions.takeScreenshot(url, filePath);

  if (!error) {
    debug(`Success. Generated screenshot ${filename}`);
  } else {
    debug(error);
    await job.moveToFailed({
      message: error.message,
    });
    debug(`Requeue job with id: ${job.id}`);
  }

  return {
    url,
    screenshotURL: filePath,
    generated: !error,
  };
};
