const debug = require('debug')('valiu:screenshotWorker');
const workerFunctions = require('./workerFunctions');

module.exports = async (job) => {
  const { url, filename } = job.data;

  const path = `${process.env.IMAGE_FOLDER}/${filename}`;
  const error = await workerFunctions.takeScreenshot(url, path);

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
    screenshotURL: path,
    generated: !error,
  };
};
