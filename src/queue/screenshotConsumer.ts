import Queue from 'bull';
import screenshotWorker from './screenshotWorker';

const redisServerURL = process.env.REDIS_SERVER_URL || 'redis://127.0.0.1:6379';

const screenshotQueue = new Queue('screenshot-queue', redisServerURL);

screenshotQueue.process(3, screenshotWorker);

module.exports = screenshotQueue;
