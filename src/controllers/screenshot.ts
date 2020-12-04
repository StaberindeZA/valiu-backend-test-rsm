import { Response, Request } from "express";
import Queue from 'bull';
import fs from 'fs';
import DebugLogger from 'debug';
import { createImageUrl, getImageFilename, getImagePath, getUniqueId, isValidUrl, screenshotExists } from "../utility";

const debug = DebugLogger('valiu:screenshotController');

const redisServerURL = process.env.REDIS_SERVER_URL || 'redis://127.0.0.1:6379';
const screenshotQueue = new Queue('screenshot-queue', redisServerURL);

export const createScreenshot = async (req: Request, res: Response) => {
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

  debug('This is the job id', job.id);

  return res.json({
    ok: true,
    screenshotGenerated: false,
    url,
    screenshotURL,
  });
}

export const getScreenshot = async (req: Request, res: Response) => {
  const imagePath = getImagePath(req.params.screenshotId);

  try {
    const data = await fs.promises.readFile(imagePath);
    res.writeHead(200, { 'Content-Type': process.env.IMAGE_MIMETYPE });
    res.end(data);
  } catch (err) {
    res.status(404).json({ ok: false });
  }
}

export const getScreenshotStatus = async (req: Request, res: Response) => {
  const { screenshotId } = req.params;

  const status = await screenshotExists(screenshotId);

  return res.json({
    ok: true,
    screenshotGenerated: status,
    screenshotURL: createImageUrl(screenshotId),
  });
}