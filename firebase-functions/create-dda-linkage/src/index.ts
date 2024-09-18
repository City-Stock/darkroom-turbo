/* eslint-disable prefer-const */
/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import poll from "./helpers/poll";
admin.initializeApp();

export const createDdaLinkage = onDocumentUpdated(
  {
    document: "uploads/{assetId}",
    memory: "512MiB",
  },
  async (event) => {
    if (!event.data || !event.data.after.exists) {
      logger.info("Ignoring because the document was deleted.");
      return;
    }

    const data = event.data.after.data();

    if (data.isWatermarked && data.isShopify && !data.isDda) {
      logger.info("Creating DDA Linkage", {structuredData: true, data});
      try {
        const fetchDda = async () => {
          const req = await fetch(`https://app.digital-downloads.com/api/v1/products?with_assets=true&page=1&limit=1000&product_id=${gid}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${process.env.DDA_API_KEY}`,
              "Content-Type": "application/json",
            },
          });
          const result = await req.json();
          return result;
        };

        const gid = data?.shopifyId.replace("gid://shopify/Product/", "");
        logger.info("DDA", {structuredData: true, gid, apiKey: process.env.DDA_API_KEY});
        const checkLinkResp = await fetchDda();
        logger.info("Checking...", {structuredData: true, data: checkLinkResp});

        const validationCheck = (result: any) => !result.meta.total;

        logger.info("Validating...", {structuredData: true, total: checkLinkResp.meta.total});
        await poll(
          fetchDda,
          validationCheck,
          1000,
          "Waiting for DDA to finish processing..."
        );

        logger.info("Product found! Uploading Asset to S3", {structuredData: true, data});

        const bucket = admin.storage().bucket(process.env.BUCKET_NAME);
        const sourceFilePath = `uploads/${data.sourceFileName}`;
        const file = bucket.file(sourceFilePath);
        const [fileBuffer] = await file.download();
        const baseUrl = process.env.DDA_API_URL;
        const mime = data.sourceFileName.split(".").pop();
        const req = await fetch(
          `${baseUrl}/assets/signed`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.DDA_API_KEY}`,
            },
            body: JSON.stringify({
              name: data.sourceFileName,
              size: data.sourceFileSize,
              mime: mime,
            }),
          }
        );
        const resp = await req.json();
        logger.info("Asset Uploaded to S3", {structuredData: true, urls: resp.urls, fileName: file.name, resp});


        let partsArr = [];
        for (const part of resp.urls) {
          const blob = fileBuffer.slice(part.start, part.end);
          partsArr.push(
            await fetch(part.url, {
              method: "PUT",
              body: blob,
              headers: {
                "Content-Type": "application/octet-stream",
              },
            }).then((resp) => {
              const etag = resp?.headers?.get("etag")?.replace(/"/g, "");
              return {
                ETag: etag,
                PartNumber: part.part,
              };
            })
          );
        }
        const url = `${baseUrl}/assets/${resp.id}/uploaded`;


        logger.info("Creating chunked assets in s3", {structuredData: true, url, upload_id: resp.upload_id});

        Promise.all(partsArr).then((parts) => {
          fetch(`${baseUrl}/assets/${resp.id}/uploaded`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.DDA_API_KEY}`,
            },
            body: JSON.stringify({
              parts: parts,
              upload_id: resp.upload_id,
            }),
          });
        });

        logger.info("Updated assets with etag and part number", {structuredData: true, data});


        const findProductReq = await fetch(`${baseUrl}/products?product_id=${gid}&with_assets=true`, {
          headers: {
            "Authorization": `Bearer ${process.env.DDA_API_KEY}`,
            "Content-Type": "application/json",
          },
        });

        const productsResp = await findProductReq.json();
        const productIdsToLink = productsResp.data.map((product: any) => product.id);

        logger.info("Products found", {structuredData: true, data: productsResp, productIdsToLink});

        const linkProductsReq = await fetch(`${baseUrl}/assets/${resp.id}/attach`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.DDA_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            products: productIdsToLink,
          }),
        });

        logger.info("DDA Linked product created", {structuredData: true, data: linkProductsReq});
        await event.data.after.ref.set({isDda: true, ddaProductIds: productIdsToLink, ddaAssetId: resp?.id}, {merge: true});
      } catch (error) {
        logger.error("Error Creating Linkage", {structuredData: true, error});
      }
    }

    return "DDA Linkage Created";
  }
);
