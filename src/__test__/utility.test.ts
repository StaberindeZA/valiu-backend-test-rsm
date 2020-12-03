require('dotenv').config({ path: '.env' });
import fs from 'fs';
import path from 'path'
import * as utility from '../utility';

beforeAll(async () => {
  const imageDir = path.join(
    __dirname,
    `../../${process.env.IMAGE_FOLDER}/test`
  );
  const imagePath = `${imageDir}/bitcoin.jpeg`;
  try {
    await fs.promises.mkdir(imageDir);
    await fs.promises.writeFile(imagePath, '');
  } catch (error) {
    console.log('An error ocurred', error);
  }
});

afterAll(async () => {
  const imageDir = path.join(
    __dirname,
    `../../${process.env.IMAGE_FOLDER}/test`
  );
  await fs.promises.rmdir(imageDir, { recursive: true });
});

test('Create Image URL', () => {
  expect(utility.createImageUrl('123')).toBe(
    `${process.env.SERVER_HOST}/screenshot/123`
  );

  expect(utility.createImageUrl('')).toBeFalsy();
});

test('Get the Image Filename', () => {
  expect(utility.getImageFilename('123')).toBe(
    `123.${process.env.IMAGE_EXTENSION}`
  );

  expect(utility.getImageFilename('')).toBeFalsy();
});

test('Get image file path', () => {
  expect(utility.getImagePath('123')).toBe(
    `${process.env.IMAGE_FOLDER}/test/123.${process.env.IMAGE_EXTENSION}`
  );

  expect(utility.getImagePath('')).toBeFalsy();
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
