import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk-core";
import { TodoStorage } from "./todo.storage";

const XAWS = AWSXRay.captureAWS(AWS);

const s3Client: AWS.S3 = new XAWS.S3({ signatureVersion: "v4" });
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

const todoStorage = new TodoStorage(
  s3Client,
  process.env.S3_BUCKET_NAME,
  urlExpiration
);
export default todoStorage;
