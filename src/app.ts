import express from 'express';
import { createScreenshot, getScreenshot, getScreenshotStatus } from './controllers/screenshot';
require('./queue/screenshotConsumer');

const app = express();

app.use(express.json());

app.get('/', (_, res) => res.status(200).json({ ok: true }));

app.post('/screenshot', createScreenshot);

app.get('/screenshot/:screenshotId', getScreenshot);

app.get('/screenshot/:screenshotId/status', getScreenshotStatus);

export default app;
