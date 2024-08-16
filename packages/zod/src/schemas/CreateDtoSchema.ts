import { z } from "zod";

export const createDtoSchema = <ItemType extends z.ZodTypeAny>(itemSchema: ItemType) => 
  z.object({
    errors: z
      .array(
        z.object({
          message: z.string(),
          code: z.string().optional(),
          expected: z.string().optional(),
          received: z.string().optional(),
          path: z.array(z.string()).optional(),
        })
      )
      .nullable(),
    data: z.array(itemSchema),
    page: z.number().nullable(),
  });