/* eslint-disable no-nested-ternary */
const { URL } = require('url');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

exports.getUniqueId = () => uuidv4();

exports.createImageUrl = (screenshotId) =>
  screenshotId ? `${process.env.SERVER_HOST}/screenshot/${screenshotId}` : null;

exports.getImageFilename = (screenshotId) =>
  screenshotId ? `${screenshotId}.${process.env.IMAGE_EXTENSION}` : null;

exports.getImagePath = (screenshotId) => {
  const imageFolder =
    process.env.NODE_ENV === 'test'
      ? `${process.env.IMAGE_FOLDER}/test`
      : `${process.env.IMAGE_FOLDER}`;

  return screenshotId
    ? `${imageFolder}/${this.getImageFilename(screenshotId)}`
    : null;
};

exports.isValidUrl = (s, protocols = ['http', 'https']) => {
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

exports.screenshotExists = async (screenshotId) => {
  try {
    await fs.promises.access(
      this.getImagePath(screenshotId),
      fs.constants.F_OK
    );
    return true;
  } catch (err) {
    return false;
  }
};
