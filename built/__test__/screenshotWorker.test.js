"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require('dotenv').config({ path: '.env' });
const screenshotWorker_1 = __importDefault(require("../screenshotWorker"));
const workerFunctions = __importStar(require("../workerFunctions"));
test('Successfully generate screenshot', () => __awaiter(void 0, void 0, void 0, function* () {
    const spy = jest.spyOn(workerFunctions, 'takeScreenshot');
    spy.mockResolvedValue(false);
    const input = {
        id: '1',
        data: { url: 'https://www.reinomuhl.com', filename: 'testfile.jpeg' },
    };
    const result = yield screenshotWorker_1.default(input);
    expect(result).toEqual({
        url: 'https://www.reinomuhl.com',
        screenshotURL: `${process.env.IMAGE_FOLDER}/test/testfile.jpeg`,
        generated: true,
    });
    spy.mockRestore();
}));
test('Failed generate screenshot', () => __awaiter(void 0, void 0, void 0, function* () {
    const spy = jest.spyOn(workerFunctions, 'takeScreenshot');
    spy.mockResolvedValue('Error message');
    // moveToFailed(errorInfo: { message: string; }, ignoreLock?: boolean): Promise<[any, JobId] | null>;
    const moveToFailed = (errorInfo, ignoreLock) => {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    };
    const input = {
        id: '1',
        data: { url: 'http://www.localhost.com:4444', filename: 'failed.jpeg' },
        moveToFailed,
    };
    const result = yield screenshotWorker_1.default(input);
    expect(result).toEqual({
        url: 'http://www.localhost.com:4444',
        screenshotURL: `${process.env.IMAGE_FOLDER}/test/failed.jpeg`,
        generated: false,
    });
    spy.mockRestore();
}));
