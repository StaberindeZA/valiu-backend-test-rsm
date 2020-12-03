var Queue = require('bull');
var screenshotWorker = require('./screenshotWorker');
var screenshotQueue = new Queue('screenshot-queue', 'redis://127.0.0.1:6379');
screenshotQueue.process(3, screenshotWorker);
module.exports = screenshotQueue;
