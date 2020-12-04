## Senior Backend Dev

### Install

```bash
npm install
```

### Setup

I used Bull for queueing which needs a Redis server.

To get the Redis server up, if you have docker up and running you can simply,

```bash
docker-compose up
```

or, if you have Redis installed locally

```bash
redis-server
```

If you have Redis running on a non-standard url/port, you can modify the .env variable

```
REDIS_SERVER_URL=
```

### Run

```bash
npm run start
```

### Use

1. Create screenshot URL.

```
POST: http://localhost:4000/screenshot

Body:
{
    "url": "https://www.reinomuhl.com
}
```

2. Check status of screenshot

ScreenshotId is returned in the POST call above.

```
GET: http://localhost:4000/screenshot/:screenshotId/status
```

3. Retrieve screenshot

```
GET: http://localhost:4000/screenshot/:screenshotId
```

## Design decisions

### Rest vs WebSockets

The test spec requested that the API would return a URL. Ideally I would have preferred only
returning a URL to the screenshot when the screenshot actually exists. However, since we don’t
know how long it might take for the screenshot to be generated.

I did briefly consider using WebSockets, since this would allow the server to maintain the connection
until the screenshot is generated and then close it.

However, since I don’t know exactly where or how this API will be used, I opted to stick with a more
generally available/standard approach of staying with a REST API.

Therefore I decided to follow the Polling Design pattern. The screenshot endpoint still generates the
image URL, however it also returns an additional parameter indicating whether or not the image is
available. The server also has an additional endpoint that allows the user to check the status of the
screenshot.

## Thank you

Thanks for the test. It was fun working on it. :)
