"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScreenshotStatus = exports.getScreenshot = exports.createScreenshot = void 0;
const bull_1 = __importDefault(require("bull"));
const fs_1 = __importDefault(require("fs"));
const debug_1 = __importDefault(require("debug"));
const utility_1 = require("../utility");
const debug = debug_1.default('valiu:screenshotController');
const screenshotQueue = new bull_1.default('screenshot-queue', 'redis://127.0.0.1:6379');
const createScreenshot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    if (!url)
        return res
            .status(400)
            .json({ ok: false, message: 'Please provide a URL.' });
    if (!utility_1.isValidUrl(url))
        return res
            .status(400)
            .json({ ok: false, message: 'Please provide a valid URL.' });
    const uniqueId = utility_1.getUniqueId();
    const filename = utility_1.getImageFilename(uniqueId);
    const screenshotURL = utility_1.createImageUrl(uniqueId);
    // Screenshot Queue - Producer
    // Add incoming URL to Bull Queue for the Consumer to pick it up
    const job = yield screenshotQueue.add({
        url,
        filename,
    }, {
        attempts: 3,
        backoff: 5000,
    });
    debug('This is the job id', job.id);
    return res.json({
        ok: true,
        screenshotGenerated: false,
        url,
        screenshotURL,
    });
});
exports.createScreenshot = createScreenshot;
const getScreenshot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imagePath = utility_1.getImagePath(req.params.screenshotId);
    try {
        const data = yield fs_1.default.promises.readFile(imagePath);
        res.writeHead(200, { 'Content-Type': process.env.IMAGE_MIMETYPE });
        res.end(data);
    }
    catch (err) {
        res.status(404).json({ ok: false });
    }
});
exports.getScreenshot = getScreenshot;
const getScreenshotStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { screenshotId } = req.params;
    const status = yield utility_1.screenshotExists(screenshotId);
    return res.json({
        ok: true,
        screenshotGenerated: status,
        screenshotURL: utility_1.createImageUrl(screenshotId),
    });
});
exports.getScreenshotStatus = getScreenshotStatus;
