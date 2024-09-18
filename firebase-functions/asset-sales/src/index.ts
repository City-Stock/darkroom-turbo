/* eslint-disable max-len */
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
admin.initializeApp();

export const assetSales = onRequest(async (request, response) => {
  logger.info("Hello logs!", {structuredData: true, request, response});
  const collection = admin.firestore().collection("uploads");
  const querySnapshot = await collection.get();

  const {body} = request;

  const data = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const foundDocs = data?.filter((doc) => body.products.some((product: any) => product?.itemShopifyId?.split("/").pop() === (doc as any)?.shopifyId?.split("/").pop()));


  logger.info("found docs", {structuredData: true, foundDocs});


  // const foundProducts = body.products.filter((product: any) => (foundDoc as any)?.shopifyId?.split("/").pop() === product?.itemShopifyId?.split("/").pop());

  const processRequests = async (docs: any[]) => {
    for (const item of docs) {
      const uploadUserId = (item as any).uploadUserId;
      const newDocRef = admin.firestore().collection("user-sales-stats").doc(uploadUserId);
      const docSnapshot = await newDocRef.get();
      const foundProducts: any[] = body.products.filter((product: any) => product?.itemShopifyId?.split("/").pop() === (item as any)?.shopifyId?.split("/").pop());
      logger.info("found products", {structuredData: true, foundProducts});
      if (foundProducts.length) {
        for (const product of foundProducts) {
          const uploadsDocRef = admin.firestore().collection("uploads").doc(item.id);
          const uploadDocSnapshot = await uploadsDocRef.get();
          logger.info("found upload doc", {structuredData: true, foundProducts});
          const uploadDocData = uploadDocSnapshot.data();
          const existingQtySold = uploadDocData?.salesInfo?.qtySold || 0;
          const existingQty = uploadDocData?.salesInfo?.totalSales || 0;
          const newQty = existingQtySold + product.itemQuantity;
          const newSalesForProducts = existingQty + (product.itemUnitCost * product.itemQuantity);
          try {
            await uploadsDocRef.set({
              salesInfo: {
                qtySold: newQty,
                totalSales: newSalesForProducts,
              },
            }, {merge: true});
            logger.info("aggregated products", {structuredData: true, uploadDocId: item?.id, newQty, newSalesForProducts});
            const docData = docSnapshot.data();
            const existingTotalSales = docData?.totalSales || 0;
            const existingCurrentPayoutTotal = docData?.currentPayoutTotal || 0;
            const existingPayoutTotal = docData?.payoutTotal || 0;
            // Calculate the new totals
            const newTotalSales = existingTotalSales + product.itemQuantity;
            const updatedCurrentPayoutTotal = existingCurrentPayoutTotal + (product.itemUnitCost * product.itemQuantity);
            const newPayoutTotal = existingPayoutTotal + (product.itemUnitCost * product.itemQuantity);
            await newDocRef.set({
              totalSales: newTotalSales,
              currentPayoutTotal: updatedCurrentPayoutTotal,
              payoutTotal: newPayoutTotal,
            }, {merge: true});
            logger.info("aggregated assert sales data", {structuredData: true, uploadUserId, newPayoutTotal, newTotalSales});
          } catch (error) {
            logger.error("Error adding data to collection", {structuredData: true, error});
          }
        }
      }
    }
  };
  if (foundDocs.length) {
    await processRequests(foundDocs);
  }

  response.send("Hello from Firebase!");
});

