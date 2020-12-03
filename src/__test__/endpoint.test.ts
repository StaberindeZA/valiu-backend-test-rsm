require('dotenv').config({ path: '.env' });
import request, { Response } from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../app';

const agent = request.agent(app);

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
  // Delete all test images
  const imageDir = path.join(
    __dirname,
    `../../${process.env.IMAGE_FOLDER}/test`
  );
  await fs.promises.rmdir(imageDir, { recursive: true });
});

describe('Add URL to screenshot queue', () => {
  test('Successfully create job', async () => {
    const res = await agent
      .post('/screenshot')
      .send({ url: 'https://www.reinomuhl.com' });

    expect(res.status).toEqual(200);
    expect(res.body.ok).toBeTruthy();
    expect(res.body.screenshotGenerated).toBeFalsy();
    expect(res.body.url).toBe('https://www.reinomuhl.com');
    expect(res.body.screenshotURL).toBeTruthy();
  });

  test('No body provided', async () => {
    const res = await agent.post('/screenshot').send(undefined);

    expect(res.status).toEqual(400);
    expect(res.body.ok).toBeFalsy();
    expect(res.body.message).toBe('Please provide a URL.');
  });

  test('No URL provided', async () => {
    const res = await agent.post('/screenshot').send({ url: '' });

    expect(res.status).toEqual(400);
    expect(res.body.ok).toBeFalsy();
    expect(res.body.message).toBe('Please provide a URL.');
  });

  test('Invalid URL provided', async () => {
    const res = await agent
      .post('/screenshot')
      .send({ url: 'abc://www.reinomuhl.com' });

    expect(res.status).toEqual(400);
    expect(res.body.ok).toBeFalsy();
    expect(res.body.message).toBe('Please provide a valid URL.');
  });
});

describe('Check status of screenshot', () => {
  test('Screenshot exists', async () => {
    const res = await agent.get('/screenshot/bitcoin/status').send(undefined);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toBeTruthy();
    expect(res.body.screenshotGenerated).toBeTruthy();
    expect(res.body.screenshotURL).toBe(
      `${process.env.SERVER_HOST}/screenshot/bitcoin`
    );
  });

  test('Screenshot does not exist', async () => {
    const res = await agent.get('/screenshot/doesnotexist/status').send(undefined);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toBeTruthy();
    expect(res.body.screenshotGenerated).toBeFalsy();
    expect(res.body.screenshotURL).toBe(
      `${process.env.SERVER_HOST}/screenshot/doesnotexist`
    );
  });
});

describe('Retrieve screenshot', () => {
  test('Screenshot exists', async () => {
    const res = await agent.get('/screenshot/bitcoin').send(undefined);

    expect(res.status).toEqual(200);
    expect(res.headers['content-type']).toEqual(process.env.IMAGE_MIMETYPE);
  });

  test('Screenshot does not exist', async () => {
    const res = await agent.get('/screenshot/doesnotexist').send(undefined);

    expect(res.status).toEqual(404);
    expect(res.body.ok).toBeFalsy();
  });
});
