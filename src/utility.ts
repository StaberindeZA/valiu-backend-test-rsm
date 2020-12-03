/* eslint-disable no-nested-ternary */
import { URL } from 'url';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const getUniqueId = () => uuidv4();

export const createImageUrl = (screenshotId) =>
  screenshotId ? `${process.env.SERVER_HOST}/screenshot/${screenshotId}` : null;

export const getImageFilename = (screenshotId) =>
  screenshotId ? `${screenshotId}.${process.env.IMAGE_EXTENSION}` : null;

export const getImagePath = (screenshotId) => {
  const imageFolder =
    process.env.NODE_ENV === 'test'
      ? `${process.env.IMAGE_FOLDER}/test`
      : `${process.env.IMAGE_FOLDER}`;

  return screenshotId
    ? `${imageFolder}/${getImageFilename(screenshotId)}`
    : null;
};

export const isValidUrl = (s, protocols = ['http', 'https']) => {
  try {
    const url = new URL(s);
    return protocols
      ? url.protocol
        ? protocols.map((x) => `${x.toLowerCase()}:`).includes(url.protocol)
        : false
      : true;
  } catch (err) {
    return false;
  }
};

export const screenshotExists = async (screenshotId) => {
  try {
    await fs.promises.access(
      getImagePath(screenshotId),
      fs.constants.F_OK
    );
    return true;
  } catch (err) {
    return false;
  }
};