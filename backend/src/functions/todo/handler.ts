import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode } from "axios";
import { getUserId } from "src/helpers/auth/auth.helper";
import { createLogger } from "src/helpers/logging/logging.helper";
import Todo from "src/models/todo.model";
import todoService from "src/services";
import { TodoCreate } from "src/view-models/todo-create.view-model";
import { TodoUpdate } from "src/view-models/todo-update.view-model";
import { v4 } from "uuid";

export const getTodos = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger("Getting all Todo");

    const authorization = event.headers.Authorization;
    const split = authorization.split(" ");
    const jwtToken = split[1];

    logger.info("Getting all Todo");

    const todos: Todo[] = await todoService.getAll(jwtToken);

    return formatJSONResponse(HttpStatusCode.Ok, {
      items: todos,
    });
  }
);

export const createTodo = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger("Creating a new Todo");
    try {
      const authorization = event.headers.Authorization;
      const split = authorization.split(" ");
      const jwtToken = split[1];

      const todoCreate: TodoCreate = event.body as any;

      logger.info("Creating a new Todo", todoCreate);

      const toDoItem = await todoService.create(todoCreate, jwtToken);

      return formatJSONResponse(HttpStatusCode.Created, {
        item: toDoItem,
      });
    } catch (e) {
      return formatJSONResponse(HttpStatusCode.InternalServerError, {
        message: e.message,
      });
    }
  }
);

export const updateTodo = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger("Updating a Todo");
    console.log("Processing Event ", event);
    try {
      const authorization = event.headers.Authorization;
      const split = authorization.split(" ");
      const jwtToken = split[1];

      const todoId = event.pathParameters.todoId;
      const updatedTodo: TodoUpdate = event.body as any;

      logger.info("Updating a Todo ", updatedTodo);

      const toDoItem = await todoService.update(todoId, jwtToken, updatedTodo);

      return formatJSONResponse(HttpStatusCode.Ok, {
        item: toDoItem,
      });
    } catch (e) {
      return formatJSONResponse(HttpStatusCode.InternalServerError, {
        message: e.message,
      });
    }
  }
);

export const deleteTodo = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger("Deleting a Todo by Id");
    try {
      const authorization = event.headers.Authorization;
      const split = authorization.split(" ");
      const jwtToken = split[1];

      const todoId = event.pathParameters.todoId;
      logger.info("Deleting a Todo by Id ", todoId);

      const deleteData = await todoService.delete(todoId, jwtToken);

      return formatJSONResponse(HttpStatusCode.Ok, {
        result: deleteData,
      });
    } catch (e) {
      return formatJSONResponse(HttpStatusCode.InternalServerError, {
        message: e.message,
      });
    }
  }
);

export const generateUploadUrl = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);

    const todoId = event.pathParameters.todoId;
    const attachmentId = v4();

    const uploadUrl = await todoService.generateUploadUrl(attachmentId);

    await todoService.updateAttachmentUrl(userId, todoId, attachmentId);

    return {
      statusCode: 202,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl,
      }),
    };
  }
);
