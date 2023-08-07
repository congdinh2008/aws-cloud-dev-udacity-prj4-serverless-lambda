import AWS from "aws-sdk";

export const dynamoDBClient = () => {
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
      accessKeyId: "fackeaccesskey",
      secretAccessKey: "fackesecretkey",
    });
  }
  return new AWS.DynamoDB.DocumentClient();
};

export default dynamoDBClient;
