/* eslint-disable max-len */
import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import sharp = require("sharp");
import {applicationDefault} from "firebase-admin/app";
import {TranscoderServiceClient} from "@google-cloud/video-transcoder";
import {google} from "@google-cloud/video-transcoder/build/protos/protos";
import poll from "./helpers/poll";
admin.initializeApp({
  credential: applicationDefault(),
  projectId: "citystock-darkroom-dev",
});

const googleCredentials = {
  "type": "service_account",
  "project_id": "citystock-darkroom-dev",
  "private_key_id": process.env.TRANSCODER_KEY_ID,
  "private_key": process.env.TRANSCODER_PRIVATE_KEY,
  "client_email": "transcoder-api@citystock-darkroom-dev.iam.gserviceaccount.com",
  "client_id": "100504647775636446017",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/transcoder-api%40citystock-darkroom-dev.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com",
};
const projectId = "citystock-darkroom-dev";

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
    if (data.approvalStatus.toLowerCase() === "approved" && !data.isWatermarked && data.sourceFileType === "video") {
      logger.info("Watermarking Video", {structuredData: true, data, creds: googleCredentials});
      const location = "us-east4";
      try {
        const fileNameNoExtension = data.sourceFileName.split(".")[0];
        const transcoderClient = new TranscoderServiceClient({
          credentials: googleCredentials,
          projectId: projectId,
        });
        const jobRequestBody = {
          parent: transcoderClient.locationPath(projectId, location),
          job: {
            inputUri: `gs://citystock-darkroom-dev.appspot.com/sources/${data.sourceFileName}`,
            outputUri: "gs://citystock-darkroom-dev.appspot.com/watermarked/",
            config: {
              editList: [{key: "edit0", inputs: ["input0"]}],
              overlays: [
                {
                  image: {
                    uri: "gs://citystock-darkroom-dev.appspot.com/watermarks/watermark-citystock.png",
                    alpha: 1,
                  },
                  animations: [
                    {
                      animationStatic: {
                        startTimeOffset: {
                          seconds: "0",
                          nanos: 0,
                        },
                      },
                    },
                    {
                      animationEnd: {
                        startTimeOffset: {
                          seconds: "10",
                          nanos: 0,
                        },
                      },
                    },
                  ],
                },
              ],
              elementaryStreams: [
                {
                  key: "video-stream0",
                  videoStream: {
                    h264: {
                      heightPixels: 720,
                      widthPixels: 1280,
                      bitrateBps: 5000000,
                      frameRate: 30,
                    },
                  },
                },
              ],
              muxStreams: [
                {key: fileNameNoExtension, elementaryStreams: ["video-stream0"]},
              ],
            },
          },
        };
        const [job] = await transcoderClient.createJob(jobRequestBody);
        // Poll job status to ensure its complete before continuing
        const getJobInfo = async () => {
          const jobId = job?.name?.split("/jobs/")[1];
          const request = {
            name: transcoderClient.jobPath(projectId, location, jobId as string),
          };
          const [response] = await transcoderClient.getJob(request);
          logger.info("Job Info", {structuredData: true, response});
          return response;
        };

        const validationCheck = (result: google.cloud.video.transcoder.v1.IJob) => result.state !== "SUCCEEDED";

        logger.info("Validating Job Status", {structuredData: true});
        await poll(
          getJobInfo,
          validationCheck,
          1000,
          "Waiting for Job to complete"
        );

        logger.info("Watermarking Job Completed", {structuredData: true, data});
        const bucket = admin.storage().bucket("gs://citystock-darkroom-dev.appspot.com");

        const videoFile = bucket.file(`watermarked/${data.sourceFileName}`);

        const [buffer] = await videoFile.download();

        await videoFile.save(buffer, {contentType: "video/mp4"});

        // Wait for the file to be saved before making it public to ensure the public URL is available (beats race condition)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        videoFile.makePublic();

        const url = videoFile.publicUrl();
        logger.info("Public url created", {structuredData: true, data, public: url});


        await event.data.after.ref.set({isWatermarked: true, isShopify: false, publicWatermarkedUrl: url}, {merge: true});
      } catch (error) {
        logger.error("Error applying watermark", {structuredData: true, error});
      }
    }

    return "Watermarking complete";
  }
);
