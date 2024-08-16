import { z } from "zod";

export const UploadRequestSchema = z.object({
  approvalStatus: z.string(),
  city: z.string(),
  contributorName: z.string(),
  contributorUserId: z.string(),
  ddaAssetId: z.string(),
  ddaProductId: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  isDdaLinked: z.boolean(),
  isInAwsS3: z.boolean(),
  isLifestyle: z.boolean(),
  isLinked: z.boolean(),
  isShopify: z.boolean(),
  isProcessed: z.boolean(),
  isUploadedToShopify: z.boolean(),
  isWatermarked: z.boolean(),
  productName: z.string(),
  s3ImageRef: z.string(),
  shopifyId: z.string(),
  sourceFileName: z.string(),
  sourceFileRef: z.string(),
  sourceFileType: z.string(),
  state: z.string(),
  tags: z.array(z.string()),
  uploadUserId: z.string(),
  publicWatermarkedUrl: z.string(),
  title: z.string(),
});

export type UploadRequestModel = z.infer<typeof UploadRequestSchema>;