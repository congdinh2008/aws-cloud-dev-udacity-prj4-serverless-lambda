import type { AWS } from "@serverless/typescript";

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  generateUploadUrl,
} from "@functions/todo";
import { auth } from "@functions/auth";

const serverlessConfiguration: AWS = {
  service: "aws-serverless-todo-be",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-aws-documentation",
    "serverless-iam-roles-per-function",
    "serverless-reqvalidator-plugin",
    "serverless-offline",
    "serverless-dynamodb",
    "serverless-s3-local",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: "dev",
    region: "us-east-1",
    tracing: {
      lambda: true,
      apiGateway: true,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: `${process.env.AWS_NODEJS_CONNECTION_REUSE_ENABLED}`,
      NODE_OPTIONS: `${process.env.NODE_OPTIONS}`,
      TODO_TABLE: `${process.env.TODO_TABLE}`,
      USER_ID_INDEX: `${process.env.USER_ID_INDEX}`,
      S3_BUCKET_NAME: `${process.env.S3_BUCKET_NAME}`,
      MY_REGION: `${process.env.MY_REGION}`,
      SIGNED_URL_EXPIRATION: `${process.env.SIGNED_URL_EXPIRATION}`,
    },
  },
  // import the function via paths
  functions: {
    auth,
    getTodos,
    createTodo,
    updateTodo,
    generateUploadUrl,
    deleteTodo,
  },
  package: { individually: true },
  custom: {
    documentation: {
      api: {
        info: {
          version: "1.0",
          title: "Serverless Todo App",
          description: "A simple serverless todo app",
        },
        tags: {
          name: "todos",
          description: "Todo items",
        },
      },
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    "serverless-offline": {
      httpPort: 5000,
    },
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
        seed: true,
        docker: true,
      },
    },
    s3: {
      host: "localhost",
      port: 4569,
      directory: "./s3-data/",
      cors: "./s3_bucket.cors.xml",
    },
  },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            "gatewayresponse.header.Access-Control-Allow-Methods":
              "'GET, POST, PUT, DELETE, OPTIONS'",
          },
          ResponseType: "DEFAULT_4XX",
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
        },
      },

      RequestBodyValidator: {
        Type: "AWS::ApiGateway::RequestValidator",
        Properties: {
          Name: "request-body-validator",
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
          ValidateRequestBody: true,
          ValidateRequestParameters: false,
        },
      },

      TodoTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: `${process.env.TODO_TABLE}`,
          AttributeDefinitions: [
            {
              AttributeName: "userId",
              AttributeType: "S",
            },
            {
              AttributeName: "todoId",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "userId",
              KeyType: "HASH",
            },
            {
              AttributeName: "todoId",
              KeyType: "RANGE",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
          GlobalSecondaryIndexes: [
            {
              IndexName: `${process.env.USER_ID_INDEX}`,
              KeySchema: [
                {
                  AttributeName: "userId",
                  KeyType: "HASH",
                },
                {
                  AttributeName: "todoId",
                  KeyType: "RANGE",
                },
              ],
              Projection: {
                ProjectionType: "ALL",
              },
            },
          ],
        },
      },

      AttachmentsBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: `${process.env.S3_BUCKET_NAME}`,
          OwnershipControls: {
            Rules: [
              {
                ObjectOwnership: "ObjectWriter",
              },
            ],
          },
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: false,
            BlockPublicPolicy: false,
            IgnorePublicAcls: false,
            RestrictPublicBuckets: false,
          },
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ["*"],
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                MaxAge: 3000,
              },
            ],
          },
        },
      },

      BucketPolicy: {
        Type: "AWS::S3::BucketPolicy",
        Properties: {
          PolicyDocument: {
            Id: "UdacityServerlessTodo",
            Version: "2012-10-17",
            Statement: {
              Sid: "PublicReadForGetBucketObjects",
              Effect: "Allow",
              Principal: "*",
              Action: "s3:GetObject",
              Resource: `arn:aws:s3:::${process.env.S3_BUCKET_NAME}/*`,
            },
          },
          Bucket: {
            Ref: "AttachmentsBucket",
          }
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
