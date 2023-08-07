import { formatJSONResponse } from "../../libs/api-gateway.js";
import { middyfy } from "../../libs/lambda.js";
import { HttpStatusCode } from "axios";
import { getUserId } from "../utils.mjs";
import { createLogger } from "../../utils/logger.mjs";
import todoService from "../../businessLayer/index.js";

export const handler = middyfy(async (event) => {
  const logger = createLogger("Getting all Todo");

  const userId = getUserId(event);

  logger.info("Getting all Todo");

  const todos = await todoService.getAll(userId);

  return formatJSONResponse(HttpStatusCode.Ok, {
    items: todos,
  });
});
