import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";


export const startFileProcess = onDocumentUpdated(
  "assets/{assetId}",
  (event) => {
    logger.info("Hello logs!", {structuredData: true});

    if (!event.data || !event.data.after.exists) {
      logger.info("Ignoring because the document was deleted.");
      return;
    }

    const data = event.data.after.data();

    if (!data.isApproved) {
      logger.info("Ignoring because the document is not approved.");
    }

    logger.info("Approved Document Data", {structuredData: true, data});

    return "Hello from Firebase!";
  }
);
