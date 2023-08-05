import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
import { auth } from "@functions/auth";

const serverlessConfiguration: AWS = {
  service: "aws-serverless-todo-be",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline", "serverless-dynamodb"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: { auth, hello },
  package: { individually: true },
  custom: {
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
  },
};

module.exports = serverlessConfiguration;
