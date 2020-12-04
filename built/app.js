"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const screenshot_1 = require("./controllers/screenshot");
require('./queue/screenshotConsumer');
const app = express_1.default();
app.use(express_1.default.json());
app.get('/', (_, res) => res.status(200).json({ ok: true }));
app.post('/screenshot', screenshot_1.createScreenshot);
app.get('/screenshot/:screenshotId', screenshot_1.getScreenshot);
app.get('/screenshot/:screenshotId/status', screenshot_1.getScreenshotStatus);
exports.default = app;
