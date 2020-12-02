require('dotenv').config({ path: '.env' });
const request = require('supertest');
const Queue = require('bull');
const Redis = require('ioredis');
const app = require('../app');

const agent = request.agent(app);

// afterAll(() => {
//   const screenshotQueue = new Queue(
//     'screenshot-queue',
//     'redis://127.0.0.1:6379'
//   );
//   screenshotQueue
//     .close()
//     .then(() => console.log('done'))
//     .catch((err) => console.log(err));
// });

describe('Add URL to screenshot queue', () => {
  beforeEach(() => {
    // Keep for now
  });

  afterEach(() => {
    // Keep for now
    // Clean up created images
  });

  test('Successfully create job', async () => {
    const res = await agent
      .post('/screenshot')
      .send({ url: 'https://www.reinomuhl.com' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.ok).toBeTruthy();
    expect(res.body.screenshotGenerated).toBeFalsy();
    expect(res.body.url).toBe('https://www.reinomuhl.com');
    // expect(res.body.screenshotURL).toBe();
  });

  test('No body provided', async () => {
    const res = await agent.post('/screenshot').send(null);

    expect(res.statusCode).toEqual(400);
    expect(res.body.ok).toBeFalsy();
    expect(res.body.message).toBe('Please provide a URL.');
  });

  test('No URL provided', async () => {
    const res = await agent.post('/screenshot').send({ url: '' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.ok).toBeFalsy();
    expect(res.body.message).toBe('Please provide a URL.');
  });

  test('Invalid URL provided', async () => {
    const res = await agent
      .post('/screenshot')
      .send({ url: 'abc://www.reinomuhl.com' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.ok).toBeFalsy();
    expect(res.body.message).toBe('Please provide a valid URL.');
  });
});

describe.skip('Check status of screenshot', () => {
  test('Test', () => {
    expect(0).toBeFalsy();
  });
});

describe.skip('Retrieve screenshot', () => {
  test('Test', () => {
    expect(0).toBeFalsy();
  });
});
