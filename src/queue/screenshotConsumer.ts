import Queue from 'bull';
import screenshotWorker from './screenshotWorker';

const screenshotQueue = new Queue('screenshot-queue', 'redis://127.0.0.1:6379');

screenshotQueue.process(3, screenshotWorker);

module.exports = screenshotQueue;
