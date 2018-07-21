import face_recognition
import requests
import os
from google.cloud import storage
from google.cloud import pubsub
subscriber = pubsub.SubscriberClient()
storage_client = storage.Client()

known_bucket_name = os.environ['knownBucketName']
unknown_bucket_name = os.environ['unknownBucketName']
known_file = os.environ['knownFile']
unknown_file = os.environ['unknownFile']

known_dest = "known.jpg"
unknown_dest = "unknown.jpg"

# listen to a topic
def listen_to_event():
    topic_name = os.environ['topic_name']
    sub_name = os.environ['sub_name']
    subscriber.create_subscription(sub_name, topic_name)

# download images from google storage account
def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    blob.download_to_filename(destination_file_name)

    print('Blob {} downloaded to {}.'.format(
        source_blob_name,
        destination_file_name))

# use face_recognition package to compare two images,
# if they are not considered the same, will trigger a call to the serverless function that sends sms to users
def compare_face():

    # Load the jpg files into numpy arrays
    abby_image = face_recognition.load_image_file(known_dest)
    unknown_image = face_recognition.load_image_file(unknown_dest)

    # Get the face encodings for each face in each image file
    # Since there could be more than one face in each image, it returns a list of encodings.
    # But since I know each image only has one face, I only care about the first encoding in each image, so I grab index 0.
    try:
        abby_face_encoding = face_recognition.face_encodings(abby_image)[0]
        unknown_face_encoding = face_recognition.face_encodings(unknown_image)[0]
    except IndexError:
        print("I wasn't able to locate any faces in at least one of the images. Check the image files. Aborting...")
        quit()

    known_faces = [
        abby_face_encoding
    ]

    # results is an array of True/False telling if the unknown face matched anyone in the known_faces array
    results = face_recognition.compare_faces(known_faces, unknown_face_encoding)

    # if cannot match the known face, send a text message to alert user
    if results[0] == 0:
        r = requests.get(os.environ['functionURL'])
        print(r.content);

def callback(message):
    # download image to process locally
    download_blob(known_bucket_name, known_file, known_dest)
    download_blob(unknown_bucket_name, unknown_file, unknown_dest)
    compare_face()
    message.ack()

# Open the subscription, passing the callback.
listen_to_event()
future = subscriber.subscribe(
    os.environ['sub_name'],
    callback
)
