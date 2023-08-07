import { formatJSONResponse } from "../../libs/api-gateway.js";
import { middyfy } from "../../libs/lambda.js";
import { HttpStatusCode } from "axios";
import { getUserId } from "../utils.mjs";
import { createLogger } from "../../utils/logger.mjs";
import todoService from "../../businessLayer/index.js";

export const handler = middyfy(async (event) => {
  const logger = createLogger("Deleting a Todo by Id");
  try {
    const userId = getUserId(event);

    const todoId = event.pathParameters.todoId;
    logger.info("Deleting a Todo by Id ", todoId);

    const deleteData = await todoService.delete(todoId, userId);

    return formatJSONResponse(HttpStatusCode.Ok, {
      result: deleteData,
    });
  } catch (e) {
    return formatJSONResponse(HttpStatusCode.InternalServerError, {
      message: e.message,
    });
  }
});
