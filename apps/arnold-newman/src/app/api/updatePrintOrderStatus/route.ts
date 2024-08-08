import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";

type RequestBody = {
  verifier?: string;
  Status?: "Accepted" | "Rejected" | "Shipped";
  Errors?: any[];
  OrderNumber?: number;
  Event?: string;
  ConfirmationId?: string;
  EntryId?: string;
  Reference?: string;
  SequenceNumber?: string;
};

/*
1. receive verification number from whcc
2. return verificaiton number from whcc
3. recieve whcc status update and update shopify order

need to send to verifiy endpoint
*/

export async function POST(request: NextRequest) {
  const shopifyKey = process.env.SHOPIFY_ACCESS_KEY as string;
  if (request.method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  const contentType = request.headers.get("Content-Type");
  let data: any;

  // Assume data is text by default
  const textData = await request.text();

  // Attempt to parse JSON only if the content type is application/json
  if (contentType === "application/json") {
    try {
      data = JSON.parse(textData);
      console.log("Received JSON:", data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return new NextResponse("Invalid JSON payload", { status: 400 });
    }
  } else {
    // Handle non-JSON payloads (e.g., URL-encoded)
    data = textData;
  }

  console.log(typeof data);
  if (typeof data === "string" && data.startsWith("verifier=")) {
    // GET new access token from WHCC
    const key = process.env.WHCC_ACCESS_KEY as string;
    const secret = process.env.WHCC_ACCESS_SECRET as string;
    const id = process.env.WHCC_ACCESS_ACCOUNT_ID as string;
    const printerBaseURL = process.env.WHCC_API_URL as string;
    console.log("Printer Base URL", printerBaseURL);
    const accessTokenCreate = await fetch(
      `${printerBaseURL}/api/v1/auth/access-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: key,
          secret: secret,
          claims: { accountId: id },
        }),
      }
    );

    const accessTokenData = await accessTokenCreate.json();
    const accessToken = accessTokenData.accessToken;

    // Schedule the verification API call

    const verifier = data.split("=")[1];
    console.log("Verifier:", verifier);
    const verificationResponseVerifier = await fetch(
      `${printerBaseURL}/api/v1/webhooks/verify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verifier: verifier }),
      }
    );
    const verificationData = await verificationResponseVerifier.json();

    if (verificationData) {
      console.log("Data", verificationData);
    } else {
      console.log("Verification failed", verificationData);
    }

    return NextResponse.json({ message: "Verified" });
  } else if (data.Status) {
    // Update Shopify order with WHCC status
    console.log(data.EntryId, data.Status, "ALL right?");
    const updateStatus = await fetch(
      `https://citystock2.myshopify.com/admin/api/2023-10/orders/${data.EntryId}/metafields.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": shopifyKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "whcc_order_status",
            value: data.Status,
            type: "single_line_text_field",
          },
        }),
      }
    );
    const updateStatusData = await updateStatus.json();
    console.log(updateStatusData);
    return NextResponse.json({ message: "Received WHCC status update" });
  } else if (data.ShippingInfo) {
    const shippingInfo = data.ShippingInfo[0];
    const shippingDate = moment
      .tz(shippingInfo.ShipDate, "America/Chicago")
      .format("YYYY-MM-DD");

    // ----------------- Update Order Note ----------------- //
    const updateShipping = await fetch(
      `https://citystock2.myshopify.com/admin/api/2023-10/orders/${data.EntryId}.json`,
      {
        method: "PUT",
        headers: {
          "X-Shopify-Access-Token": shopifyKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            id: data.EntryId,
            note: `Estimated shipping date: ${shippingDate}. Carrier: ${shippingInfo.Carrier}. Tracking number: ${shippingInfo.TrackingNumber}. More details you can check here: ${shippingInfo.TrackingUrl}`,
          },
        }),
      }
    );
    // ----------------- Update Metafield Status ----------------- //

    const updateStatus = await fetch(
      `https://citystock2.myshopify.com/admin/api/2023-10/orders/${data.EntryId}/metafields.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": shopifyKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "whcc_order_status",
            value: data.Event,
            type: "single_line_text_field",
          },
        }),
      }
    );

    // ----------------- Update Tracking Number ----------------- //

    const updateTrackNumber = await fetch(
      `https://citystock2.myshopify.com/admin/api/2023-10/orders/${data.EntryId}/metafields.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": shopifyKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "whcc_tracking_number",
            value: data.ShippingInfo[0].TrackingNumber,
            type: "single_line_text_field",
          },
        }),
      }
    );

    // ----------------- Get Fulfillment Order Id ----------------- //

    const getFulfillmentOrder = await fetch(
      `https://citystock2.myshopify.com/admin/api/2024-01/orders/${data.EntryId}/fulfillment_orders.json`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": shopifyKey,
          "Content-Type": "application/json",
        },
      }
    );

    const fulfillmentOrderData = await getFulfillmentOrder.json();
    const fulfillmentOrderId = fulfillmentOrderData.fulfillment_orders[0].id;

    // ----------------- Create Fulfillment ----------------- //

    const createFulfillment = await fetch(
      `https://citystock2.myshopify.com/admin/api/2023-10/fulfillments.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": shopifyKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fulfillment: {
            line_items_by_fulfillment_order: [
              { fulfillment_order_id: fulfillmentOrderId },
            ],
            notify_customer: true,
            tracking_info: {
              number: shippingInfo.TrackingNumber,
              url: shippingInfo.TrackingUrl,
            },
          },
        }),
      }
    );

    return NextResponse.json({
      message: "Received shipping update, fulfillment created",
    });
  }

  return new NextResponse(JSON.stringify({ message: "Not verified" }), {
    status: 400,
  });
}
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiIyMjIyMjIiLCJzY29wZSI6WyJjbGllbnQiXSwib3JnSWQiOiJqU0hxWkx1ZHNDdW01b2RaMyIsImlzcyI6InByb3NwZWN0b3Itc3RhZ2UuZHJhZ2Ryb3AuZGVzaWduIiwiYXVkIjoicHJvc3BlY3Rvci1zdGFnZS5kcmFnZHJvcC5kZXNpZ24iLCJzdWIiOiJKb0pERGRDWjVBZjluWVNjMyIsImlhdCI6MTcwOTY4MDMwOSwianRpIjoiR1hFSjd3M1AyTkdYVzlDS2giLCJleHAiOjE3MDk3MjM1MDksInJmeCI6MCwicmZpIjowfQ.56pQ6fyXe7r0xpbclW0djqebFVeREM44Ndf8MmfO4CA
