import AWS from "aws-sdk";
import AWSXRay from "aws-xray-sdk-core";
import TodoStorage from "./todo.storage.js";

if (process.env.IS_OFFLINE) {
  AWSXRay.setContextMissingStrategy("LOG_ERROR");
}

const XAWS = AWSXRay.captureAWS(AWS);
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

const s3Client = new XAWS.S3({
  signatureVersion: "v4",
});

const todoStorage = new TodoStorage(
  s3Client,
  process.env.S3_BUCKET_NAME,
  urlExpiration
);
export default todoStorage;
