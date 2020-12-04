"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const screenshotWorker_1 = __importDefault(require("./screenshotWorker"));
const screenshotQueue = new bull_1.default('screenshot-queue', 'redis://127.0.0.1:6379');
screenshotQueue.process(3, screenshotWorker_1.default);
module.exports = screenshotQueue;
