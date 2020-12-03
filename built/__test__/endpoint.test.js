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
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');
const agent = request.agent(app);
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
    // Delete all test images
    const imageDir = path.join(__dirname, `../../${process.env.IMAGE_FOLDER}/test`);
    yield fs.promises.rmdir(imageDir, { recursive: true });
}));
describe('Add URL to screenshot queue', () => {
    test('Successfully create job', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield agent
            .post('/screenshot')
            .send({ url: 'https://www.reinomuhl.com' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBeTruthy();
        expect(res.body.screenshotGenerated).toBeFalsy();
        expect(res.body.url).toBe('https://www.reinomuhl.com');
        expect(res.body.screenshotURL).toBeTruthy();
    }));
    test('No body provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield agent.post('/screenshot').send(null);
        expect(res.statusCode).toEqual(400);
        expect(res.body.ok).toBeFalsy();
        expect(res.body.message).toBe('Please provide a URL.');
    }));
    test('No URL provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield agent.post('/screenshot').send({ url: '' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.ok).toBeFalsy();
        expect(res.body.message).toBe('Please provide a URL.');
    }));
    test('Invalid URL provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield agent
            .post('/screenshot')
            .send({ url: 'abc://www.reinomuhl.com' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.ok).toBeFalsy();
        expect(res.body.message).toBe('Please provide a valid URL.');
    }));
});
describe('Check status of screenshot', () => {
    test('Screenshot exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield agent.get('/screenshot/bitcoin/status').send(null);
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBeTruthy();
        expect(res.body.screenshotGenerated).toBeTruthy();
        expect(res.body.screenshotURL).toBe(`${process.env.SERVER_HOST}/screenshot/bitcoin`);
    }));
    test('Screenshot does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield agent.get('/screenshot/doesnotexist/status').send(null);
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toBeTruthy();
        expect(res.body.screenshotGenerated).toBeFalsy();
        expect(res.body.screenshotURL).toBe(`${process.env.SERVER_HOST}/screenshot/doesnotexist`);
    }));
});
describe('Retrieve screenshot', () => {
    test('Screenshot exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield agent.get('/screenshot/bitcoin').send(null);
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toEqual(process.env.IMAGE_MIMETYPE);
    }));
    test('Screenshot does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield agent.get('/screenshot/doesnotexist').send(null);
        expect(res.statusCode).toEqual(404);
        expect(res.body.ok).toBeFalsy();
    }));
});
