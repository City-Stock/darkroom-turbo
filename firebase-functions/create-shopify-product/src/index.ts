/* eslint-disable max-len */
import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
admin.initializeApp();


export const createShopifyProduct = onDocumentUpdated(
  {
    document: "dev-assets/{assetId}",
  },
  async (event) => {
    if (!event.data || !event.data.after.exists) {
      logger.info("Ignoring because the document was deleted.");
      return;
    }

    const data = event.data.after.data();

    if (data.isWatermarked && !data.isShopify) {
      logger.info("Creating Shopify Product", {structuredData: true, data});

      try {
        const payload = {
          product: {
            title: data?.title,
            body_html: "<strong></strong>",
            vendor: "CityStock",
            product_type: data?.sourceFileType === "image" ? "Image - City" : "Video - City",
            tags: data?.tags,
            images: [
              {
                src: data?.publicWatermarkedUrl,
                alt: data?.sourceFileName,
              },
            ],
            variants: [
              {
                option1: "Standard",
                price: "75.00",
                sku: "1",
                requires_shipping: false,
              },
              {
                option1: "Enhanced",
                price: "150.00",
                sku: "2",
                requires_shipping: false,
              },
              {
                option1: "Custom",
                price: "9,999,999.00",
                sku: "3",
                requires_shipping: false,
              },
            ],
          },
        };

        logger.info("Payload", {structuredData: true, payload});
        const req = await fetch(
          process.env.SHOPIFY_ADMIN_URL as string,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN as string,
            },

            body: JSON.stringify(payload),
          }
        );

        const shopifyProductGID = await req.json();
        const publishId = shopifyProductGID?.product?.admin_graphql_api_id ?? "";

        logger.info("Shopify product created", {structuredData: true, data: shopifyProductGID, publishId});
        await event.data.after.ref.set({isShopify: true, shopifyId: publishId}, {merge: true});
      } catch (error) {
        logger.error("Error creating shopify product", {structuredData: true, error});
      }
    }

    return "Shopify Product Created";
  }
);
