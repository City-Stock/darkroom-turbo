import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  draftOrder: {
    lineItems: {
      title: string;
      price: string;
      quantity: number;
      propreties?: string[];
    }[];
    shippingAddress: {
      first_name: string;
      last_name: string;
      email: string;
      address1: string;
      address2?: string;
      city: string;
      country: string;
      province: string;
      zip: string;
      phone: string;
    };
  };
  editorId: string;
  whccAccessToken: string;
  // add shipping address
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RequestBody;
  console.log(body);
  // {
  // "draft_order": {
  //   "line_items": [
  //       {
  //           "title": name,
  //           "price": price,
  //           "quantity": 1
  //       }
  //   ]
  // }
  // ----------------- Get customer by email ----------------- //
  const customerEmail = body.draftOrder.shippingAddress.email;
  const SHOPIFY_API_KEY = process.env.SHOPIFY_ACCESS_KEY as string;

  const getCustomerInfo = await fetch(
    `https://citystock2.myshopify.com/admin/api/2023-01/customers/search.json?query=email:${body.draftOrder.shippingAddress.email}`,
    {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const customerData = await getCustomerInfo.json();
  if (customerData.customers.length === 0) {
    // ----------------- Create Draft Order ----------------- //
    const shopifyCreateDraftOrder =
      "https://citystock2.myshopify.com/admin/api/2024-01/draft_orders.json";

    console.log(body.draftOrder.lineItems[0].title);
    console.log("Here", body.draftOrder.lineItems);
    console.log("Here 2", body.draftOrder.lineItems[3]);
    const draftOrder = await fetch(shopifyCreateDraftOrder, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        draft_order: {
          line_items: body.draftOrder.lineItems,
          shipping_address: {
            first_name: body.draftOrder.shippingAddress.first_name,
            last_name: body.draftOrder.shippingAddress.last_name,
            email: body.draftOrder.shippingAddress.email,
            address1: body.draftOrder.shippingAddress.address1,
            city: body.draftOrder.shippingAddress.city,
            province: body.draftOrder.shippingAddress.province,
            country: body.draftOrder.shippingAddress.country,
            zip: body.draftOrder.shippingAddress.zip,
            phone: body.draftOrder.shippingAddress.phone,
          },
          customer: {
            id: customerData.customers[0].id || null,
          },
          shipping_line: {
            title: "Standard Shipping",
            price: 7.95,
            code: "STANDARD",
            custom: true,
          },
        },
      }),
    });
    const urlData = await draftOrder.json();
    console.log(urlData);

    // ----------------- Create Metafield for EditorId ----------------- //

    const draftOrderId = urlData.draft_order.id;

    const newMetafieldEditorId = await fetch(
      `https://citystock2.myshopify.com/admin/api/2024-01/draft_orders/${draftOrderId}/metafields.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "whcc_editor_id",
            value: body.editorId,
            type: "single_line_text_field",
          },
        }),
      }
    );
    const editorIdMetafield = await newMetafieldEditorId.json();
    console.log(editorIdMetafield);

    // ----------------- Create Metafield for AccessToken ----------------- //
    console.log(body.whccAccessToken);
    const newMetafieldAccessToken = await fetch(
      `https://citystock2.myshopify.com/admin/api/2024-01/draft_orders/${draftOrderId}/metafields.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "whcc_access_token",
            value: body.whccAccessToken,
            type: "single_line_text_field",
          },
        }),
      }
    );
    const accessTokenMetafield = await newMetafieldAccessToken.json();
    console.log(accessTokenMetafield);

    // ----------------- Create Metafield Draft Order Id----------------- //
    const newMetafieldDraftOrderId = await fetch(
      `https://citystock2.myshopify.com/admin/api/2024-01/draft_orders/${draftOrderId}/metafields.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "draft_order_id",
            value: draftOrderId,
            type: "single_line_text_field",
          },
        }),
      }
    );
    const draftOrderIdMetafield = await newMetafieldDraftOrderId.json();
    console.log(draftOrderIdMetafield);

    return NextResponse.json(urlData, { status: 201 });
  } else {
    // ----------------- Create Draft Order ----------------- //
    const shopifyCreateDraftOrder =
      "https://citystock2.myshopify.com/admin/api/2024-01/draft_orders.json";

    console.log("String:", SHOPIFY_API_KEY);
    const dataShopify = body;

    const draftOrder = await fetch(shopifyCreateDraftOrder, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        draft_order: {
          line_items: body.draftOrder.lineItems,
          shipping_address: {
            first_name: body.draftOrder.shippingAddress.first_name,
            last_name: body.draftOrder.shippingAddress.last_name,
            email: body.draftOrder.shippingAddress.email,
            address1: body.draftOrder.shippingAddress.address1,
            city: body.draftOrder.shippingAddress.city,
            province: body.draftOrder.shippingAddress.province,
            country: body.draftOrder.shippingAddress.country,
            zip: body.draftOrder.shippingAddress.zip,
            phone: body.draftOrder.shippingAddress.phone,
          },
          customer: {
            id: customerData.customers[0].id,
          },
          shipping_line: {
            title: "Standard Shipping",
            price: 7.95,
            code: "STANDARD",
            custom: true,
          },
        },
      }),
    });

    const urlData = await draftOrder.json();
    console.log(urlData);
    // ----------------- Create Metafield for EditorId ----------------- //

    const draftOrderId = urlData.draft_order.id;

    const newMetafieldEditorId = await fetch(
      `https://citystock2.myshopify.com/admin/api/2024-01/draft_orders/${draftOrderId}/metafields.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "whcc_editor_id",
            value: body.editorId,
            type: "single_line_text_field",
          },
        }),
      }
    );
    const editorIdMetafield = await newMetafieldEditorId.json();
    console.log(editorIdMetafield);

    // ----------------- Create Metafield for AccessToken ----------------- //
    console.log(body.whccAccessToken);
    const newMetafieldAccessToken = await fetch(
      `https://citystock2.myshopify.com/admin/api/2024-01/draft_orders/${draftOrderId}/metafields.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "whcc_access_token",
            value: body.whccAccessToken,
            type: "single_line_text_field",
          },
        }),
      }
    );
    const accessTokenMetafield = await newMetafieldAccessToken.json();
    console.log(accessTokenMetafield);

    // ----------------- Create Metafield Draft Order Id----------------- //
    const newMetafieldDraftOrderId = await fetch(
      `https://citystock2.myshopify.com/admin/api/2024-01/draft_orders/${draftOrderId}/metafields.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "draft_order_id",
            value: draftOrderId,
            type: "single_line_text_field",
          },
        }),
      }
    );
    const draftOrderIdMetafield = await newMetafieldDraftOrderId.json();
    console.log(draftOrderIdMetafield);

    return NextResponse.json(urlData, { status: 201 });
  }
}
