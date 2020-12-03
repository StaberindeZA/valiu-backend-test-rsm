"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = require("bull");
var screenshotWorker_1 = require("./screenshotWorker");
var screenshotQueue = new Queue('screenshot-queue', 'redis://127.0.0.1:6379');
screenshotQueue.process(3, screenshotWorker_1.default);
module.exports = screenshotQueue;
