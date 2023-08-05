import { handlerPath } from "@libs/handler-resolver";

export const getTodos = {
  handler: `${handlerPath(__dirname)}/handler.getTodos`,
  events: [
    {
      http: {
        method: "get",
        path: "todos",
      },
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
      },
    },
  ],
};

export const updateTodo = {
  handler: `${handlerPath(__dirname)}/handler.updateTodo`,
  events: [
    {
      http: {
        method: "put",
        path: "todos/{todoId}",
      },
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
      },
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
      },
    },
  ],
};
