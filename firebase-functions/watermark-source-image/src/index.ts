/* eslint-disable max-len */
import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import sharp = require("sharp");
import {applicationDefault} from "firebase-admin/app";
admin.initializeApp({
  credential: applicationDefault(),
  projectId: "citystock-darkroom-dev",
});


// const functions = getFunctions(getApp());
// connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export const watermarkSourceImage = onDocumentUpdated(
  {
    document: "dev-assets/{assetId}",
    memory: "512MiB",
  },
  async (event) => {
    if (!event.data || !event.data.after.exists) {
      logger.info("Ignoring because the document was deleted.");
      return;
    }


    const data = event.data.after.data();

    if (data.approvalStatus.toLowerCase() === "approved" && !data.isWatermarked && data.sourceFileType === "image") {
      logger.info("Approved Document Data", {structuredData: true, data});

      try {
        const fileName = data.sourceFileName;
        const originalFilePath = `sources/${fileName}`;
        const bucket = admin.storage().bucket("gs://citystock-darkroom-dev.appspot.com");
        const [originalFileBuffer] = await bucket.file(originalFilePath).download();
        const [waterMarkImageBuffer] = await bucket.file("watermarks/watermark-citystock.png").download();
        const baseImage = sharp(originalFileBuffer);
        const baseMetadata = await baseImage.metadata();
        if (baseMetadata.width === undefined || baseMetadata.height === undefined) {
          throw new Error("Image metadata does not contain width or height");
        }
        const resizedImage = await baseImage.resize({
          width: Math.floor(baseMetadata.width / 2),
          height: Math.floor(baseMetadata.height / 2),
          fit: sharp.fit.inside,
          withoutEnlargement: true}).toBuffer();

        const watermarkedImage = await sharp(resizedImage)
          .composite([{input: waterMarkImageBuffer}])
          .toBuffer();
        const watermarkedFilePath = `watermarked/${fileName}`;
        const watermarkedFile = bucket.file(watermarkedFilePath);
        await watermarkedFile.save(watermarkedImage);
        // Wait for the file to be saved before making it public to ensure the public URL is available (beats race condition)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await watermarkedFile.makePublic();

        const publicWatermarkedUrl = watermarkedFile.publicUrl();

        logger.info("Watermark applied and image saved", {structuredData: true, watermarkedFilePath, publicWatermarkedUrl});
        await event.data.after.ref.set({isWatermarked: true, isShopify: false, publicWatermarkedUrl}, {merge: true});
      } catch (error) {
        logger.error("Error applying watermark", {structuredData: true, error});
      }
    }

    return "Watermarking complete";
  }
);
