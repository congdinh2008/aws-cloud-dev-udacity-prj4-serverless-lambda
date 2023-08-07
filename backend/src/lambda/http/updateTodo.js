import { formatJSONResponse } from "../../libs/api-gateway.js";
import { middyfy } from "../../libs/lambda.js";
import { HttpStatusCode } from "axios";
import { getUserId } from "../utils.mjs";
import { createLogger } from "../../utils/logger.mjs";
import todoService from "../../businessLayer/index.js";

export const handler = middyfy(async (event) => {
  const logger = createLogger("Updating a Todo");
  console.log("Processing Event ", event);
  try {
    const userId = getUserId(event);

    console.log("Processing Event ", event);

    const todoId = event.pathParameters.todoId;
    console.log("Processing Event ", todoId);

    const updatedTodo = event.body;

    logger.info("Updating a Todo ", updatedTodo);

    const toDoItem = await todoService.update(todoId, userId, updatedTodo);

    return formatJSONResponse(HttpStatusCode.Ok, {
      item: toDoItem,
    });
  } catch (e) {
    return formatJSONResponse(HttpStatusCode.InternalServerError, {
      message: e.message,
    });
  }
});
