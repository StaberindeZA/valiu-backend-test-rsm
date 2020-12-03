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
Object.defineProperty(exports, "__esModule", { value: true });
exports.screenshotExists = exports.isValidUrl = exports.getImagePath = exports.getImageFilename = exports.createImageUrl = exports.getUniqueId = void 0;
/* eslint-disable no-nested-ternary */
const url_1 = require("url");
const fs = __importStar(require("fs"));
const uuid_1 = require("uuid");
const getUniqueId = () => uuid_1.v4();
exports.getUniqueId = getUniqueId;
const createImageUrl = (screenshotId) => screenshotId ? `${process.env.SERVER_HOST}/screenshot/${screenshotId}` : '';
exports.createImageUrl = createImageUrl;
const getImageFilename = (screenshotId) => screenshotId ? `${screenshotId}.${process.env.IMAGE_EXTENSION}` : '';
exports.getImageFilename = getImageFilename;
const getImagePath = (screenshotId) => {
    const imageFolder = process.env.NODE_ENV === 'test'
        ? `${process.env.IMAGE_FOLDER}/test`
        : `${process.env.IMAGE_FOLDER}`;
    return screenshotId
        ? `${imageFolder}/${exports.getImageFilename(screenshotId)}`
        : '';
};
exports.getImagePath = getImagePath;
const isValidUrl = (s, protocols = ['http', 'https']) => {
    try {
        const url = new url_1.URL(s);
        return protocols
            ? url.protocol
                ? protocols.map((x) => `${x.toLowerCase()}:`).includes(url.protocol)
                : false
            : true;
    }
    catch (err) {
        return false;
    }
};
exports.isValidUrl = isValidUrl;
const screenshotExists = (screenshotId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs.promises.access(exports.getImagePath(screenshotId), fs.constants.F_OK);
        return true;
    }
    catch (err) {
        return false;
    }
});
exports.screenshotExists = screenshotExists;
