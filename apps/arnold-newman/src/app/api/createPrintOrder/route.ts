import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  orderId: string;

  orderAttributes: [name: string, value: string];
};
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const modifiedBody = body
      .replace(/gid:\/\//g, '"gid://')
      .replace(/(gid:\/\/shopify\/Order\/\d+)(,)/g, '$1"$2');

    const data = JSON.parse(modifiedBody) as RequestBody;

    // ----------------- Get Metafields ----------------- //
    const shopifyKey = process.env.SHOPIFY_ACCESS_KEY as string;

    const orderString = data.orderId;

    // Split the string using '/'
    const parts = orderString.split("/");

    // Get the last part of the array, which contains the order ID
    const orderId = parts[parts.length - 1];

    const metafields = await fetch(
      `https://citystock2.myshopify.com/admin/api/2024-01/orders/${orderId}/metafields.json`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": shopifyKey,
          "Content-Type": "application/json",
        },
      }
    );
    const metafieldsData = await metafields.json();

    const editorId = metafieldsData.metafields[0].value;
    const editorAccessToken = metafieldsData.metafields[1].value;
    const draftOrder = metafieldsData.metafields[2].value;

    // could i go to shopify and get the draft order by is from the metafield of order.

    // then update order with a post to update shipping info

    const printerBaseURL = process.env.WHCC_API_URL as string;

    // ----------------- Get Draft Order info by id----------------- //

    const draftOrderInfo = await fetch(
      `https://citystock2.myshopify.com/admin/api/2023-10/draft_orders/${draftOrder}.json`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": shopifyKey,
          "Content-Type": "application/json",
        },
      }
    );
    const draftOrderInfoData = await draftOrderInfo.json();

    // ----------------- Update order with Shipping info ----------------- //

    const updateOrder = await fetch(
      `https://citystock2.myshopify.com/admin/api/2023-10/orders/${orderId}.json`,
      {
        method: "PUT",
        headers: {
          "X-Shopify-Access-Token": shopifyKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            id: orderId,
            shipping_address: {
              name: draftOrderInfoData.draft_order.shipping_address.name,
              address1:
                draftOrderInfoData.draft_order.shipping_address.address1,
              city: draftOrderInfoData.draft_order.shipping_address.city,
              province:
                draftOrderInfoData.draft_order.shipping_address.province_code,
              country:
                draftOrderInfoData.draft_order.shipping_address.country_code,
              zip: draftOrderInfoData.draft_order.shipping_address.zip,
              phone: draftOrderInfoData.draft_order.shipping_address.phone,
            },
          },
        }),
      }
    );
    const updatedOrderData = await updateOrder.json();
    console.log(
      orderId,
      editorId,
      data.orderAttributes,
      draftOrderInfoData.draft_order.shipping_address.name,
      "Check this"
    );
    // 1. Update WHCC Export Order to have Address Info
    const exportOrderResponse = await fetch(
      `${printerBaseURL}/api/v1/oas/editors/export`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${editorAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          editors: [
            {
              editorId: editorId,
            },
          ],

          orderAttributes: [548, 553],
          entryId: orderId,

          shipToAddress: {
            name: draftOrderInfoData.draft_order.shipping_address.name,
            addr1: draftOrderInfoData.draft_order.shipping_address.address1,
            city: draftOrderInfoData.draft_order.shipping_address.city,
            state:
              draftOrderInfoData.draft_order.shipping_address.province_code,
            zip: draftOrderInfoData.draft_order.shipping_address.zip,
            country:
              draftOrderInfoData.draft_order.shipping_address.country_code,
          },
          shipFromAddress: {
            name: "CityStock",
            addr1: "2840 Lone Oak Parkway",
            city: "Eagan",
            state: "MN",
            zip: "55121",
            country: "US",
          },
        }),
      }
    );
    const exportOrderData = await exportOrderResponse.json();
    console.log("Export Order Data", exportOrderData);
    // 2. Create Print Order /oas/orders/create
    const createOrderResponse = await fetch(
      `${printerBaseURL}/api/v1/oas/orders/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${editorAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportOrderData.order),
      }
    );
    const createOrderData = await createOrderResponse.json();

    // 3. Confirm Print order /oas/orders/[confirmationId]/confirm
    const confirmOrderResponse = await fetch(
      `${printerBaseURL}/api/v1/oas/orders/${createOrderData.ConfirmationID}/confirm`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${editorAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const confirmOrderData = await confirmOrderResponse.json();

    // 4. ??? Setup webhook?
    const webhookCreation = await fetch(
      `${printerBaseURL}/api/v1/webhooks/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${editorAccessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          callbackUri:
            "https://arnold-newman-dev.vercel.app/api/updatePrintOrderStatus",
        }),
      }
    );
    const webhookData = await webhookCreation.json();
    console.log(webhookData);

    // 5. Add Timeline to Order in Shopify for Confirmation Info

    return NextResponse.json(confirmOrderData, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
