import { z } from "zod";

export const CreateShopifyDraftOrderSchema = z
  .object({
    draft_order: z.object({
      line_items: z.array(z.object({
        title: z.string(),
        price: z.string(),
        quantity: z.number()
      }))
    }),
  })
  .strict();

export type CreateShopifyDraftOrderModel = z.infer<typeof CreateShopifyDraftOrderSchema>;

