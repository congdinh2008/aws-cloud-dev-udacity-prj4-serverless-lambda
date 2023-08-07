import { formatJSONResponse } from "../../libs/api-gateway.js";
import { middyfy } from "../../libs/lambda.js";
import { HttpStatusCode } from "axios";
import { getUserId } from "../utils.mjs";
import { createLogger } from "../../utils/logger.mjs";
import todoService from "../../businessLayer/index.js";

export const handler = middyfy(async (event) => {
  const logger = createLogger("Creating a new Todo");
  try {
    const userId = getUserId(event);

    const todoCreate = event.body;

    logger.info("Creating a new Todo", todoCreate);

    const toDoItem = await todoService.create(todoCreate, userId);

    return formatJSONResponse(HttpStatusCode.Created, {
      item: toDoItem,
    });
  } catch (e) {
    return formatJSONResponse(HttpStatusCode.InternalServerError, {
      message: e.message,
    });
  }
});
