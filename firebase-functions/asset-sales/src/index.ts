import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

export const assetSales = onRequest(async (request, response) => {
  logger.info("Hello logs!", {structuredData: true, request, response});

  const {body} = request;
  logger.info("parsed data", {structuredData: true, body});

  // const parsedBody = JSON.parse(body);
  // logger.info("parsed data", {structuredData: true, parsedBody});

  response.send("Hello from Firebase!");
});

