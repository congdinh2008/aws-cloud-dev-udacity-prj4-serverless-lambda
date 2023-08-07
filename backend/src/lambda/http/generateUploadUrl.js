import { middyfy } from "../../libs/lambda.js";
import { HttpStatusCode } from "axios";
import { getUserId } from "../utils.mjs";
import { createLogger } from "../../utils/logger.mjs";
import todoService from "../../businessLayer/index.js";
import { v4 } from "uuid";

export const handler = middyfy(async (event) => {
  const logger = createLogger("Generate upload url");
  const userId = getUserId(event);

  const todoId = event.pathParameters.todoId;
  const attachmentId = v4();

  const uploadUrl = await todoService.generateUploadUrl(attachmentId);
  logger.info("Generate upload url ", uploadUrl);

  await todoService.updateAttachmentUrl(userId, todoId, attachmentId);
  logger.info(
    `Update Todo Attachment URL ${uploadUrl} with attachment id = ${attachmentId} for todo with id = ${todoId}`
  );

  return {
    statusCode: HttpStatusCode.Accepted,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl,
    }),
  };
});
