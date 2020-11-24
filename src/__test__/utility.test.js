require('dotenv').config({ path: '.env' });
const utility = require('../utility');

test('Create Image URL', () => {
  expect(utility.createImageUrl('123')).toBe(
    `${process.env.SERVER_HOST}/screenshot/123`
  );

  expect(utility.createImageUrl()).toBeNull();
});

test('Get the Image Filename', () => {
  expect(utility.getImageFilename('123')).toBe(
    `123.${process.env.IMAGE_EXTENSION}`
  );

  expect(utility.getImageFilename()).toBeNull();
});

test('Get image file path', () => {
  expect(utility.getImagePath('123')).toBe(
    `${process.env.IMAGE_FOLDER}/123.${process.env.IMAGE_EXTENSION}`
  );

  expect(utility.getImagePath()).toBeNull();
});

test('Check if the URL is valid', () => {
  expect(utility.isValidUrl('http://www.google.com')).toBeTruthy();
  expect(utility.isValidUrl('https://www.google.com')).toBeTruthy();
  expect(utility.isValidUrl('abc://www.google.com')).toBeFalsy();
  expect(utility.isValidUrl('abc://www.google.com', ['abc'])).toBeTruthy();
});

test('Check if the screenshot image exists', async () => {
  let data = await utility.screenshotExists('bitcoin');
  expect(data).toBeTruthy();
  data = await utility.screenshotExists('');
  expect(data).toBeFalsy();
  data = await utility.screenshotExists('etherium');
  expect(data).toBeFalsy();
});
