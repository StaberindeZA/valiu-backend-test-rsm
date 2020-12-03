import express from 'express';
import Queue from 'bull';
import fs from 'fs';
import {
  isValidUrl,
  createImageUrl,
  screenshotExists,
  getImagePath,
  getUniqueId,
  getImageFilename,
} from './utility';
require('./screenshotConsumer');

const app = express();

app.use(express.json());

const screenshotQueue = new Queue('screenshot-queue', 'redis://127.0.0.1:6379');

app.get('/', (_, res) => res.status(200).json({ ok: true }));

app.post('/screenshot', async (req: express.Request, res: express.Response) => {
  const { url } = req.body;

  if (!url)
    return res
      .status(400)
      .json({ ok: false, message: 'Please provide a URL.' });

  if (!isValidUrl(url))
    return res
      .status(400)
      .json({ ok: false, message: 'Please provide a valid URL.' });

  const uniqueId = getUniqueId();
  const filename = getImageFilename(uniqueId);
  const screenshotURL = createImageUrl(uniqueId);

  // Screenshot Queue - Producer
  // Add incoming URL to Bull Queue for the Consumer to pick it up
  const job = await screenshotQueue.add(
    {
      url,
      filename,
    },
    {
      attempts: 3,
      backoff: 5000,
    }
  );

  console.log('This is the job id', job.id);

  res.json({
    ok: true,
    screenshotGenerated: false,
    url,
    screenshotURL,
  });
});

app.get('/screenshot/:screenshotId', async (req, res) => {
  const imagePath = getImagePath(req.params.screenshotId);

  try {
    const data = await fs.promises.readFile(imagePath);
    res.writeHead(200, { 'Content-Type': process.env.IMAGE_MIMETYPE });
    res.end(data);
  } catch (err) {
    res.status(404).json({ ok: false });
  }
});

app.get('/screenshot/:screenshotId/status', async (req, res) => {
  const { screenshotId } = req.params;

  const status = await screenshotExists(screenshotId);

  return res.json({
    ok: true,
    screenshotGenerated: status,
    screenshotURL: createImageUrl(screenshotId),
  });
});

export default app;
