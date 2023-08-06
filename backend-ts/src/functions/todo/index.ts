import { handlerPath } from "@libs/handler-resolver";

export const getTodos = {
  handler: `${handlerPath(__dirname)}/handler.getTodos`,
  events: [
    {
      http: {
        method: "get",
        path: "todos",
        cors: true,
        authorizer: "auth",
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:Query"],
      Resource: `arn:aws:dynamodb:${process.env.MY_REGION}:*:table/${process.env.TODO_TABLE}`,
    },
    {
      Effect: "Allow",
      Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
      Resource: "*",
    },
  ],
};

export const createTodo = {
  handler: `${handlerPath(__dirname)}/handler.createTodo`,
  events: [
    {
      http: {
        method: "post",
        path: "todos",
        cors: true,
        authorizer: "auth",
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:PutItem"],
      Resource: `arn:aws:dynamodb:${process.env.MY_REGION}:*:table/${process.env.TODO_TABLE}`,
    },
    {
      Effect: "Allow",
      Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
      Resource: "*",
    },
  ],
};

export const updateTodo = {
  handler: `${handlerPath(__dirname)}/handler.updateTodo`,
  events: [
    {
      http: {
        method: "patch",
        path: "todos/{todoId}",
        cors: true,
        authorizer: "auth",
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:UpdateItem"],
      Resource: `arn:aws:dynamodb:${process.env.MY_REGION}:*:table/${process.env.TODO_TABLE}`,
    },
    {
      Effect: "Allow",
      Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
      Resource: "*",
    },
  ],
};

export const deleteTodo = {
  handler: `${handlerPath(__dirname)}/handler.deleteTodo`,
  events: [
    {
      http: {
        method: "delete",
        path: "todos/{todoId}",
        cors: true,
        authorizer: "auth",
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:DeleteItem"],
      Resource: `arn:aws:dynamodb:${process.env.MY_REGION}:*:table/${process.env.TODO_TABLE}`,
    },
    {
      Effect: "Allow",
      Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
      Resource: "*",
    },
  ],
};

export const generateUploadUrl = {
  handler: `${handlerPath(__dirname)}/handler.generateUploadUrl`,
  events: [
    {
      http: {
        method: "post",
        path: "todos/{todoId}/attachment",
        cors: true,
        authorizer: "auth",
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["s3:*"],
      Resource: `arn:aws:s3:::${process.env.S3_BUCKET_NAME}/*`,
    },
    {
      Effect: "Allow",
      Action: ["dynamodb:UpdateItem", "dynamodb:GetItem"],
      Resource: `arn:aws:dynamodb:${process.env.MY_REGION}:*:table/${process.env.TODO_TABLE}`,
    },
    {
      Effect: "Allow",
      Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
      Resource: "*",
    },
  ],
};
