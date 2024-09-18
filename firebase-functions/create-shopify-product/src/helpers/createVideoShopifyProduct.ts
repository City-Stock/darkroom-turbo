/* eslint-disable max-len */
import axios from "axios";
import {logger} from "firebase-functions/v1";

export const createVideoShopifyProduct = async ({shopifyExternalVideoUrl, vendor, title, tags, uniqueId}: {
  shopifyExternalVideoUrl: string; vendor: string; title: string; tags: string[]; uniqueId: string
}): Promise<any> => {
  const body = {
    query: `
      mutation productCreate($input: ProductInput!, $media: [CreateMediaInput!]) {
        productCreate(input: $input, media: $media) {
          product {
            id
          }
        
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      input: {
        title,
        productType: tags.includes("Lifestyle") ? "Video - Lifestyle" : "Video - City",
        status: "ACTIVE",
        vendor,
        tags,
        handle: `${title} ${uniqueId}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        options: ["License"],
        variants: [
          {
            title: "Standard",
            price: 75,
            requiresShipping: false,
            options: ["Standard"],
          },
          {
            title: "Enhanced",
            price: 150,
            requiresShipping: false,
            options: ["Enhanced"],
          },
          {
            title: "Custom",
            price: 9999999,
            requiresShipping: false,
            options: ["Custom"],
          },
        ],
      },
      media: [
        {
          alt: `Watermarked ${title}`,
          mediaContentType: "VIDEO",
          originalSource: shopifyExternalVideoUrl,
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
    // console.log(JSON.stringify(productResponse.data, null, 2))
    // console.log(productResponse.data.data.productCreate.product);

    return productResponse.data;
  } catch (err) {
    logger.error("Error creating shopify product", {structuredData: true, err});
  }
};

