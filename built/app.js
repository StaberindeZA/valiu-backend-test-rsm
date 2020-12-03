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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Queue = require("bull");
var fs = require("fs");
var utility_1 = require("./utility");
require('./screenshotConsumer');
var app = express();
app.use(express.json());
var screenshotQueue = new Queue('screenshot-queue', 'redis://127.0.0.1:6379');
app.get('/', function (_, res) { return res.status(200).json({ ok: true }); });
app.post('/screenshot', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, uniqueId, filename, screenshotURL, job;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = req.body.url;
                if (!url)
                    return [2 /*return*/, res
                            .status(400)
                            .json({ ok: false, message: 'Please provide a URL.' })];
                if (!utility_1.isValidUrl(url))
                    return [2 /*return*/, res
                            .status(400)
                            .json({ ok: false, message: 'Please provide a valid URL.' })];
                uniqueId = utility_1.getUniqueId();
                filename = utility_1.getImageFilename(uniqueId);
                screenshotURL = utility_1.createImageUrl(uniqueId);
                return [4 /*yield*/, screenshotQueue.add({
                        url: url,
                        filename: filename,
                    }, {
                        attempts: 3,
                        backoff: 5000,
                    })];
            case 1:
                job = _a.sent();
                console.log('This is the job id', job.id);
                res.json({
                    ok: true,
                    screenshotGenerated: false,
                    url: url,
                    screenshotURL: screenshotURL,
                });
                return [2 /*return*/];
        }
    });
}); });
app.get('/screenshot/:screenshotId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var imagePath, data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                imagePath = utility_1.getImagePath(req.params.screenshotId);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fs.promises.readFile(imagePath)];
            case 2:
                data = _a.sent();
                res.writeHead(200, { 'Content-Type': process.env.IMAGE_MIMETYPE });
                res.end(data);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(404).json({ ok: false });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/screenshot/:screenshotId/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var screenshotId, status;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                screenshotId = req.params.screenshotId;
                return [4 /*yield*/, utility_1.screenshotExists(screenshotId)];
            case 1:
                status = _a.sent();
                return [2 /*return*/, res.json({
                        ok: true,
                        screenshotGenerated: status,
                        screenshotURL: utility_1.createImageUrl(screenshotId),
                    })];
        }
    });
}); });
module.exports = app;
