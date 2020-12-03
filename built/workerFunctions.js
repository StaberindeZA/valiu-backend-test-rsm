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
exports.takeScreenshot = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('valiu:workerFunctions');
const screenshot = (page, url, path) => {
    const type = process.env.IMAGE_EXTENSION;
    return new Promise((resolve, reject) => {
        page.on('error', (err) => {
            reject(err);
        });
        page.on('load', () => debug('Page loaded Successfully'));
        page.on('pageerror', (err) => {
            reject(err);
        });
        page
            .goto(url, { waitUntil: 'load', timeout: 20000 })
            .then(() => page.screenshot({
            path,
            type,
        }))
            .then(() => resolve(false))
            .catch((err) => {
            reject(err.message);
        });
    });
};
const takeScreenshot = (url, path) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        args: [
            '--disable-gpu',
            '--no-sandbox',
            '--lang=en-US',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
        ],
    });
    const page = yield browser.newPage();
    try {
        yield screenshot(page, url, path);
        return false;
    }
    catch (err) {
        debug(`Caught error and escallating`);
        return err;
    }
    finally {
        yield page.close();
        yield browser.close();
    }
});
exports.takeScreenshot = takeScreenshot;
