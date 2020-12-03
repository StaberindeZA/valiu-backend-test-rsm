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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utility = __importStar(require("../utility"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const imageDir = path_1.default.join(__dirname, `../../${process.env.IMAGE_FOLDER}/test`);
    const imagePath = `${imageDir}/bitcoin.jpeg`;
    try {
        yield fs_1.default.promises.mkdir(imageDir);
        yield fs_1.default.promises.writeFile(imagePath, '');
    }
    catch (error) {
        console.log('An error ocurred', error);
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const imageDir = path_1.default.join(__dirname, `../../${process.env.IMAGE_FOLDER}/test`);
    yield fs_1.default.promises.rmdir(imageDir, { recursive: true });
}));
test('Create Image URL', () => {
    expect(utility.createImageUrl('123')).toBe(`${process.env.SERVER_HOST}/screenshot/123`);
    expect(utility.createImageUrl('')).toBeFalsy();
});
test('Get the Image Filename', () => {
    expect(utility.getImageFilename('123')).toBe(`123.${process.env.IMAGE_EXTENSION}`);
    expect(utility.getImageFilename('')).toBeFalsy();
});
test('Get image file path', () => {
    expect(utility.getImagePath('123')).toBe(`${process.env.IMAGE_FOLDER}/test/123.${process.env.IMAGE_EXTENSION}`);
    expect(utility.getImagePath('')).toBeFalsy();
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
