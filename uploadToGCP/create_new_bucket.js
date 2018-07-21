// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

// The name for the new bucket
const bucketName = process.env.bucketName;

// Creates the new bucket
storage
  .createBucket(bucketName)
  .then(() => {
    console.log(`Bucket ${bucketName} created.`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
