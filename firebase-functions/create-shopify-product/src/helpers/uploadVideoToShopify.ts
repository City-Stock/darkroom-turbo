/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import axios from "axios";
import {logger} from "firebase-functions/v1";
import FormData = require("form-data");
import {Readable} from "stream";

export const uploadVideoToShopify = async ({filename, contentLength, contentType, readableStream}: {
  filename: string; contentLength: number; contentType: string; readableStream: Readable
}) => {
  let stagedTarget;

  // Stage Video first to get upload url
  const body = {
    query: `
      mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url,
            resourceUrl,
            parameters {
                name,
                value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      input: [
        {
          fileSize: `${contentLength}`,
          filename,
          httpMethod: "POST",
          mimeType: contentType,
          resource: "VIDEO",
        },
      ],
    },
  };

  try {
    const productResponse = await axios({
      method: "post",
      url: "https://citystock2.myshopify.com/admin/api/2023-01/graphql.json",
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN as string,
        "Content-Type": "application/json",
      },
      data: body,
    });

    logger.info("Staged Successfully", {structuredData: true, productResponse});


    stagedTarget = productResponse.data.data.stagedUploadsCreate.stagedTargets[0];
  } catch (error) {
    logger.error("Error staging shopify product", {structuredData: true, error});
  }

  // Upload video to staged url
  const formData = new FormData();

  formData.append("signature", stagedTarget.parameters.find((p: any) => p.name === "signature").value);
  formData.append("policy", stagedTarget.parameters.find((p: any) => p.name === "policy").value);
  formData.append("GoogleAccessId", stagedTarget.parameters.find((p: any) => p.name === "GoogleAccessId").value);
  formData.append("key", stagedTarget.parameters.find((p: any) => p.name === "key").value);

  // const fileStream = createReadStream(videoBuffer, {start: 0, end: contentLength - 1});
  // FILE NEEDS TO BE THE LAST THING APPENEDED
  formData.append("file", readableStream);

  try {
    await axios({
      method: "post",
      url: "https://shopify-video-production-core-originals.storage.googleapis.com",
      data: formData,
      headers: {...formData.getHeaders()},
    });

    logger.info("Uploaded Successfully", {structuredData: true, formData});
  } catch (err) {
    logger.error("Error uploading shopify product", {structuredData: true, err});
  }

  return stagedTarget.resourceUrl;
};

