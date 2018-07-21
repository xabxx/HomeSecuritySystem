// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

/**
 * TODO: define the following two const as env. variables
 */
const bucketName = process.env.bucketName;
const filename = process.env.path;

// Uploads a local file to the bucket
storage
  .bucket(bucketName)
  .upload(filename)
  .then(() => {
    console.log(`${filename} uploaded to ${bucketName}.`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
