import { handlerPath } from "@libs/handler-resolver";

export const auth = {
  handler: `${handlerPath(__dirname)}/handler.auth`,
  events: [
    {
      http: {
        method: "get",
        path: "auth",
      },
    },
  ],
};
