const Pageres = require('pageres');

const takeScreenshot = async (url, filename) => {
  try {
    await new Pageres({
      delay: 2,
      filename,
      format: process.env.IMAGE_EXTENSION,
    })
      .src(url, ['1024x768'])
      .dest('images')
      .run();
    return true;
  } catch (err) {
    console.log('WHOOOOPS ERROR', err);
    return false;
  }
};

module.exports = async (job) => {
  const { url, filename } = job.data;

  const result = await takeScreenshot(url, filename);

  if (result) {
    console.log('Finished generating screenshots!');
  } else {
    console.log('Oh no something went wrong!!!');
  }

  return {
    outURL: `The OutURL is ${job.data.url}`,
  };
};
