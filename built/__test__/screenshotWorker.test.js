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
require('dotenv').config({ path: '.env' });
const fs = require('fs');
const path = require('path');
const screenshotWorker = require('../screenshotWorker');
const workerFunctions = require('../workerFunctions');
test('Successfully generate screenshot', () => __awaiter(void 0, void 0, void 0, function* () {
    const spy = jest.spyOn(workerFunctions, 'takeScreenshot');
    spy.mockResolvedValue(false);
    const result = yield screenshotWorker({
        id: '1',
        data: { url: 'https://www.reinomuhl.com', filename: 'testfile.jpeg' },
    });
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
    const result = yield screenshotWorker({
        id: '2',
        data: { url: 'http://www.localhost.com:4444', filename: 'failed.jpeg' },
        moveToFailed: () => true,
    });
    expect(result).toEqual({
        url: 'http://www.localhost.com:4444',
        screenshotURL: `${process.env.IMAGE_FOLDER}/test/failed.jpeg`,
        generated: false,
    });
    spy.mockRestore();
}));
