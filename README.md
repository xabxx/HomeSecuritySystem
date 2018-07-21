# HomeSecuritySystem
Rpi + GCP project

In this project, I used a Raspberry pi 3, a pi camera, and several GCP resources including storage, app engine, serverless function to create a home security system

The idea is that: when a person comes in, the Rpi takes a picture of the person. 
The said picture will immediately get uploaded to a google storage account where it will publish an event. 
The said event will trigger a backend service that performs near real-time facial comparison to run.
The result from the said facial comparison will have two outcomes: if match, does nothing; If not match, trigger the serverless function that sends a sms to user using gmail api and the carrier's sms gateway. Regarless of the outcome, the service will always be listening to its subscription by pulling from the topic.

Take a look at the RPIGCP.pdf in the root dir., it's a chart that puts everything said above in a design diagram.
