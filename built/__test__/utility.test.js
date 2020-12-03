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
const utility = require('../utility');
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const imageDir = path.join(__dirname, `../../${process.env.IMAGE_FOLDER}/test`);
    const imagePath = `${imageDir}/bitcoin.jpeg`;
    try {
        yield fs.promises.mkdir(imageDir);
        yield fs.promises.writeFile(imagePath, '');
    }
    catch (error) {
        console.log('An error ocurred', error);
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const imageDir = path.join(__dirname, `../../${process.env.IMAGE_FOLDER}/test`);
    yield fs.promises.rmdir(imageDir, { recursive: true });
}));
test('Create Image URL', () => {
    expect(utility.createImageUrl('123')).toBe(`${process.env.SERVER_HOST}/screenshot/123`);
    expect(utility.createImageUrl()).toBeNull();
});
test('Get the Image Filename', () => {
    expect(utility.getImageFilename('123')).toBe(`123.${process.env.IMAGE_EXTENSION}`);
    expect(utility.getImageFilename()).toBeNull();
});
test('Get image file path', () => {
    expect(utility.getImagePath('123')).toBe(`${process.env.IMAGE_FOLDER}/test/123.${process.env.IMAGE_EXTENSION}`);
    expect(utility.getImagePath()).toBeNull();
});
test('Check if the URL is valid', () => {
    expect(utility.isValidUrl('http://www.google.com')).toBeTruthy();
    expect(utility.isValidUrl('https://www.google.com')).toBeTruthy();
    expect(utility.isValidUrl('abc://www.google.com')).toBeFalsy();
    expect(utility.isValidUrl('abc://www.google.com', ['abc'])).toBeTruthy();
});
test('Check if the screenshot image exists', () => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield utility.screenshotExists('bitcoin');
    expect(data).toBeTruthy();
    data = yield utility.screenshotExists('');
    expect(data).toBeFalsy();
    data = yield utility.screenshotExists('etherium');
    expect(data).toBeFalsy();
}));
