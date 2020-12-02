const debug = require('debug')('valiu:screenshotWorker');
const path = require('path');
const { getImagePath } = require('./utility');
const workerFunctions = require('./workerFunctions');

module.exports = async (job) => {
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
